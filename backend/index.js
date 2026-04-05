const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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
const SECRET_KEY = process.env.JWT_SECRET || "SUPER_SECRET_KEY_FOR_SMAN4_COMPROF";

// --- MIDDLEWARES KEAMANAN ---
app.use(helmet({
  crossOriginResourcePolicy: false, // Agar file /uploads tetap bisa diakses secara publik
  contentSecurityPolicy: false,     // Disable CSP strict agar frontend React bisa dimuat dengan tenang (bisa disesuaikan nanti)
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Jika .env punya FRONTEND_URL, batasi ke situ. Jika tidak, tetap *
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
// Serve static files from 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Default Admin
async function initAdmin() {
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash('16132sman4bogor', 10);
    await prisma.admin.create({
      data: { username: 'Staff-admin-1', password: hashedPassword }
    });
    console.log("Default admin created: Staff-admin-1 / 16132sman4bogor");
  }
}
initAdmin();

// --- AUTH ROUTES ---
// Mencegah Brute-force & Spam Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 request per IP per 15 menit
  message: { error: 'Terlalu banyak percobaan login, silakan coba lagi setelah 15 menit.' }
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
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
  // Mengembalikan URL secara dinamis/relatif agar tidak error (localhost) di server VPS
  const fileUrl = `/uploads/${req.file.filename}`;
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

app.get('/api/achievements/:id', async (req, res) => {
  try {
    const data = await prisma.achievement.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!data) return res.status(404).json({ error: 'Not found' });
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

app.put('/api/achievements/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, date, imageUrl, level } = req.body;
    const updatedRecord = await prisma.achievement.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, date: date ? new Date(date) : undefined, imageUrl, level }
    });
    res.json(updatedRecord);
  } catch (error) { res.status(500).json({ error: 'Failed to update' }); }
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

app.get('/api/staff/:id', async (req, res) => {
  try {
    const data = await prisma.staff.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!data) return res.status(404).json({ error: 'Not found' });
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

app.get('/api/news/:id', async (req, res) => {
  try {
    const data = await prisma.news.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!data) return res.status(404).json({ error: 'Not found' });
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

app.put('/api/news/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, content, imageUrl, author } = req.body;
    const updatedRecord = await prisma.news.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, imageUrl, author }
    });
    res.json(updatedRecord);
  } catch (error) { res.status(500).json({ error: 'Failed to update' }); }
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
app.get('/api/services/:id', async (req, res) => {
  try {
    const data = await prisma.service.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch' }); }
});
app.post('/api/services', verifyAdmin, async (req, res) => {
  try {
    const { title, description, iconUrl } = req.body;
    const record = await prisma.service.create({ data: { title, description, iconUrl } });
    res.json(record);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
app.put('/api/services/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, iconUrl } = req.body;
    const updatedRecord = await prisma.service.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, iconUrl }
    });
    res.json(updatedRecord);
  } catch (error) { res.status(500).json({ error: 'Failed to update' }); }
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
app.get('/api/publications/:id', async (req, res) => {
  try {
    const data = await prisma.publication.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch' }); }
});
app.post('/api/publications', verifyAdmin, async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    const record = await prisma.publication.create({ data: { title, fileUrl } });
    res.json(record);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
app.put('/api/publications/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    const updatedRecord = await prisma.publication.update({
      where: { id: parseInt(req.params.id) },
      data: { title, fileUrl }
    });
    res.json(updatedRecord);
  } catch (error) { res.status(500).json({ error: 'Failed to update' }); }
});
app.delete('/api/publications/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.publication.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

// 7. Serve React Frontend
// Menginstruksikan Express agar menjadikan folder 'dist' milik React sebagai wadah file statis utama
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Untuk rute apapun (*) yang bukan merupakan jalur /api di atas,
// berikan file index.html milik React agar React Router yang mengambil alih halamannya
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
