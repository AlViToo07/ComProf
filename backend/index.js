const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Mencegah error folder uploads tidak ada
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Hanya JPG/JPEG/PNG/PDF/DOC/XLS.'), false);
    }
  }
});

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const SECRET_KEY = "SUPER_SECRET_KEY_FOR_SMAN4_COMPROF";

app.use(cors());
app.use(express.json());
// Serve static files from 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Default Admin
async function initAdmin() {
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: { username: 'admin', password: hashedPassword }
    });
    console.log("Default admin created: admin / admin123");
  }
}
initAdmin();

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return res.status(401).json({ error: 'Username atau password salah!' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ error: 'Username atau password salah!' });

    const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '1d' });
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.put('/api/auth/password', verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) return res.status(400).json({ error: 'Password saat ini kurang tepat.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: req.admin.id },
      data: { password: hashedPassword }
    });
    res.json({ message: 'Password berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengubah password' });
  }
});

// --- ROUTES ---

// Upload endpoint
app.post('/api/upload', verifyAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file' });
  // Mengembalikan URL publik untuk gambar
  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// 1. Profil Sekolah (GET open, PUT protected)
app.get('/api/profile', async (req, res) => {
  try {
    const profile = await prisma.schoolProfile.findFirst();
    res.json(profile || {});
  } catch (error) { res.status(500).json({ error: 'Failed to fetch profile' }); }
});

app.put('/api/profile', verifyAdmin, async (req, res) => {
  try {
    const { id, name, description, vision, mission, contactInfo, logoUrl, headerText, backgroundUrl, motto, historyText, historyImageUrl, orgStructureUrl, orgDesc, headmasterName, headmasterPhotoUrl, studentCount, teacherCount, staffCount, alumniCount, achievementInt, achievementNat, achievementProv, achievementReg } = req.body;
    const dataObj = { 
      name, description, vision, mission, contactInfo, 
      logoUrl, headerText, backgroundUrl,
      motto, historyText, historyImageUrl, orgStructureUrl, orgDesc,
      headmasterName, headmasterPhotoUrl,
      studentCount: Number(studentCount||0), 
      teacherCount: Number(teacherCount||0), 
      staffCount: Number(staffCount||0), 
      alumniCount: Number(alumniCount||0),
      achievementInt: Number(achievementInt||0),
      achievementNat: Number(achievementNat||0),
      achievementProv: Number(achievementProv||0),
      achievementReg: Number(achievementReg||0)
    };
    let profile;
    if (id) {
      profile = await prisma.schoolProfile.update({ where: { id: parseInt(id) }, data: dataObj });
    } else {
      profile = await prisma.schoolProfile.create({ data: dataObj });
    }
    res.json(profile);
  } catch (error) { res.status(500).json({ error: 'Failed to update' }); }
});

// 2. Prestasi (GET open, POST/DELETE protected)
app.get('/api/achievements', async (req, res) => {
  try {
    const data = await prisma.achievement.findMany({ orderBy: { id: 'desc' } });
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch' }); }
});

app.post('/api/achievements', verifyAdmin, async (req, res) => {
  try {
    const { title, description, date, imageUrl, level } = req.body;
    const newRecord = await prisma.achievement.create({
      data: { title, description, date: new Date(date), imageUrl, level }
    });
    res.status(201).json(newRecord);
  } catch (error) { res.status(500).json({ error: 'Failed to create' }); }
});

app.delete('/api/achievements/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.achievement.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: 'Failed to delete' }); }
});

// 3. Jajaran Staff / Guru
app.get('/api/staff', async (req, res) => {
  try {
    const data = await prisma.staff.findMany({ orderBy: { id: 'asc' } });
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch' }); }
});

app.post('/api/staff', verifyAdmin, async (req, res) => {
  try {
    const { name, position, bio, imageUrl, category } = req.body;
    const newRecord = await prisma.staff.create({ data: { name, position, bio, imageUrl, category } });
    res.status(201).json(newRecord);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

app.put('/api/staff/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, position, bio, imageUrl, category } = req.body;
    const updatedRecord = await prisma.staff.update({
      where: { id: parseInt(req.params.id) },
      data: { name, position, bio, imageUrl, category }
    });
    res.json(updatedRecord);
  } catch (error) { res.status(500).json({ error: 'Failed to update' }); }
});

app.delete('/api/staff/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.staff.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: 'Failed to delete' }); }
});

// 4. Berita (News)
app.get('/api/news', async (req, res) => {
  try {
    const data = await prisma.news.findMany({ orderBy: { publishedAt: 'desc' } });
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch' }); }
});

app.post('/api/news', verifyAdmin, async (req, res) => {
  try {
    const { title, content, imageUrl, author } = req.body;
    const newRecord = await prisma.news.create({ data: { title, content, imageUrl, author } });
    res.status(201).json(newRecord);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/news/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: 'Failed to delete' }); }
});

// 5. Layanan
app.get('/api/services', async (req, res) => {
  try {
    const data = await prisma.service.findMany({ orderBy: { id: 'desc' } });
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/services', verifyAdmin, async (req, res) => {
  try {
    const { title, description, iconUrl } = req.body;
    const record = await prisma.service.create({ data: { title, description, iconUrl } });
    res.json(record);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/services/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

// 6. Publikasi
app.get('/api/publications', async (req, res) => {
  try {
    const data = await prisma.publication.findMany({ orderBy: { publishedAt: 'desc' } });
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/publications', verifyAdmin, async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    const record = await prisma.publication.create({ data: { title, fileUrl } });
    res.json(record);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/publications/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.publication.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
