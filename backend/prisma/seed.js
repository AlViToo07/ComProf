const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Start seeding...');

  // 1. Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
    },
  });
  console.log('Admin user seeded:', admin.username);

  // 2. School Profile
  await prisma.schoolProfile.deleteMany({});
  const profile = await prisma.schoolProfile.create({
    data: {
      name: 'SMAN 4 Kota Bogor',
      description: '<p>Selamat datang di <strong>SMAN 4 Kota Bogor</strong>. Sekolah yang berkomitmen mengembangkan pendidikan berprestasi dan berkarakter menuju nilai kearifan lokal.</p>',
      vision: '<p>Menjadi institusi pendidikan terbaik yang mencetak kader bangsa yang religius, cerdas, kreatif, dan berwawasan lingkungan.</p>',
      mission: '<p>1. Meningkatkan kualitas pembelajaran.<br/>2. Membina karakter religius.<br/>3. Mengembangkan bakat dan minat siswa.</p>',
      motto: 'Cerdas, Berkarakter, Berbudaya Lingkungan',
      contactInfo: 'Jl. Dreded No.36, Bogor Selatan, Kota Bogor\nTelp: (0251) 8322238\nEmail: info@sman4bogor.sch.id',
      studentCount: 1035,
      teacherCount: 45,
      staffCount: 20,
      alumniCount: 10500,
      achievementInt: 10,
      achievementNat: 45,
      achievementProv: 80,
      achievementReg: 120,
      headerText: 'Membangun Generasi\nCerdas & Berkarakter\ndi SMAN 4 Kota Bogor',
      orgDesc: '<p>Struktur Organisasi didesain untuk memaksimalkan pelayanan sekolah.</p>',
      headmasterName: 'Hj. Emi Suhaemi, S.Pd',
      historyText: '<p>Sejarah singkat SMAN 4 Kota Bogor berawal dari komitmen bersama masyarakat untuk mendirikan sekolah lanjutan unggulan.</p>',
    }
  });
  console.log('School Profile seeded');

  // 3. Programs
  await prisma.program.deleteMany({});
  await prisma.program.createMany({
    data: [
      { title: 'Program Kelas Riset & Inovasi', description: 'Program ini dirancang untuk mengembangkan nalar kritis dan analitis siswa melalui pembimbingan intensif dalam penggalian ide dan pelaksanaan penelitian.', isActive: true },
      { title: 'Program Digital & Teknologi Terapan', description: 'Siswa dibekali dengan kemampuan literasi digital mendalam dan keterampilan aplikatif di bidang teknologi cerdas yang dapat diimplementasikan praktis.', isActive: true },
      { title: 'Program Penguatan Karakter & Kepemimpinan', description: 'Memfokuskan pembentukan moral kepemimpinan dan nilai kedisiplinan pada peserta didik, memastikan keseimbangan akademik dan soft-skill.', isActive: true }
    ]
  });
  console.log('Programs seeded');

  // 4. Achievements (Prestasi)
  await prisma.achievement.deleteMany({});
  await prisma.achievement.createMany({
    data: [
      { title: 'Siswa SMAN 4 Bogor Raih Juara 1 Olimpiade Sains', description: '<p>Delegasi sekolah berhasil membawa medali emas pada kompetisi sains tingkat provinsi.</p>', level: 'Provinsi', date: new Date('2026-03-10') },
      { title: 'Medali Emas Kejuaraan Pencak Silat', description: '<p>Prestasi membanggakan di bidang olahraga bela diri internasional.</p>', level: 'Internasional', date: new Date('2026-01-20') },
      { title: 'Juara 1 Lomba Debat Bahasa Inggris Banten', description: '<p>Meraih juara pertama pada ajang debat antar SMA.</p>', level: 'Provinsi', date: new Date('2025-11-10') },
      { title: 'Juara Umum Lomba Paskibraka Tingkat Kota', description: '<p>Penghargaan tertinggi kompetisi baris-berbaris.</p>', level: 'Kota / Regional', date: new Date('2026-02-15') }
    ]
  });
  console.log('Achievements seeded');

  // 5. News (Berita)
  await prisma.news.deleteMany({});
  await prisma.news.createMany({
    data: [
      { title: 'Perayaan HUT Ke-43 SMAN 4 Bogor Berlangsung Meriah', content: '<p>Acara tahunan dirayakan dengan berbagai perlombaan dan pementasan seni oleh siswa dengan antusias tinggi berskala luas.</p>', author: 'Humas SMAN 4', publishedAt: new Date('2026-03-25') },
      { title: 'Sosialisasi Masuk Perguruan Tinggi Negeri', content: '<p>Kegiatan ini ditujukan untuk seluruh siswa kelas XII sebagai bekal persiapan masuk kuliah jalur undangan SNBP.</p>', author: 'Bimbingan Konseling', publishedAt: new Date('2026-03-20') },
      { title: 'Kegiatan Bakti Sosial OSIS Ramadhan', content: '<p>Bentuk kepedulian siswa terhadap lingkungan sekitar dengan membagikan takjil gratis ke fasilitas umum.</p>', author: 'OSIS', publishedAt: new Date('2026-03-15') },
    ]
  });
  console.log('News seeded');

  // 6. Services (Layanan)
  await prisma.service.deleteMany({});
  await prisma.service.createMany({
    data: [
      { title: 'Perpustakaan Digital', description: '<p>Akses ratusan buku cetak dan e-book yang terintegrasi secara online untuk mendukung kegiatan belajar siswa.</p>' },
      { title: 'E-Learning Terintegrasi', description: '<p>Platform pembelajaran jarak jauh dan manajemen tugas sekolah khusus SMAN 4 Bogor.</p>' },
      { title: 'Bimbingan Karir & Konseling', description: '<p>Layanan konsultasi psikometrik, penjurusan, dan pendampingan persiapan SNBP/SNBT.</p>' },
      { title: 'Laboratorium Komputer', description: '<p>Akses perangkat komputer dengan spesifikasi tinggi dilengkapi dengan jaringan internet super cepat.</p>' }
    ]
  });
  console.log('Services seeded');

  // 7. Staff (Pimpinan)
  await prisma.staff.deleteMany({});
  await prisma.staff.createMany({
    data: [
      { name: 'Hj. Emi Suhaemi, S.Pd', position: 'Kepala Sekolah', category: 'Pimpinan' },
      { name: 'Drs. Asep Sunandar, M.Si', position: 'Wakasek Kurikulum', category: 'Pimpinan' },
      { name: 'Siti Nurhaliza, M.Pd', position: 'Wakasek Kesiswaan', category: 'Pimpinan' },
      { name: 'Budi Raharjo, S.Kom', position: 'Guru TIK', category: 'Guru' }
    ]
  });
  console.log('Staff seeded');

  // 8. Publications (Dokumen Publikasi)
  await prisma.publication.deleteMany({});
  await prisma.publication.createMany({
    data: [
      { title: 'Kalender Akademik 2026/2027', publishedAt: new Date('2026-03-12') },
      { title: 'Tata Tertib Peserta Didik Baru', publishedAt: new Date('2026-03-10') },
      { title: 'Panduan Penggunaan Sistem E-Learning', publishedAt: new Date('2026-03-05') }
    ]
  });
  console.log('Publications seeded');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
