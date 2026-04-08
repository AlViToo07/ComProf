/**
 * SEEDER — ComProf SMAN 4 Bogor
 * Jalankan: node seed.js
 * Mengisi semua tabel dengan data contoh untuk testing fitur.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper: buat slug dari teks
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

async function main() {
  console.log('🌱 Memulai seeder...\n');

  // ── 1. Admin ────────────────────────────────────────────────────────────────
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const hashed = await bcrypt.hash('16132sman4bogor', 10);
    await prisma.admin.create({ data: { username: 'Staff-admin-1', password: hashed } });
    console.log('✅ Admin dibuat: Staff-admin-1 / 16132sman4bogor');
  } else {
    console.log('⏭️  Admin sudah ada, lewati.');
  }

  // ── 2. Profil Sekolah ───────────────────────────────────────────────────────
  const profileCount = await prisma.schoolProfile.count();
  if (profileCount === 0) {
    await prisma.schoolProfile.create({
      data: {
        name: 'SMA Negeri 4 Bogor',
        description: 'Selamat datang di SMAN 4 Kota Bogor. Kami berkomitmen mencetak generasi cerdas, berkarakter, dan berdaya saing global melalui pendidikan berkualitas tinggi yang berpijak pada nilai-nilai kearifan lokal dan kebangsaan.',
        vision: 'Terwujudnya SMAN 4 Kota Bogor sebagai sekolah unggulan yang menghasilkan lulusan beriman, berkarakter, berprestasi, dan berwawasan global.',
        mission: 'Menyelenggarakan pembelajaran bermutu dan inovatif.\nMengembangkan potensi siswa secara holistik dan optimal.\nMembangun budaya sekolah yang disiplin, jujur, dan saling menghargai.\nMemperkuat kerjasama dengan orang tua, masyarakat, dan dunia usaha.\nMemanfaatkan teknologi dalam mendukung proses pendidikan.',
        motto: 'BERPRESTASI, BERKARAKTER, BERDAYA SAING',
        headerText: 'Membangun Generasi\nCerdas & Berkarakter\ndi SMAN 4 Kota Bogor',
        headmasterName: 'Hj. Emi Suhaemi, S.Pd., M.M.',
        studentCount: 1035,
        teacherCount: 72,
        staffCount: 28,
        alumniCount: 15000,
        achievementInt: 12,
        achievementNat: 87,
        achievementProv: 145,
        achievementReg: 312,
        historyText: `<h2>Sejarah Berdirinya SMAN 4 Kota Bogor</h2>
<p>SMA Negeri 4 Kota Bogor berdiri pada tahun <strong>1981</strong> atas prakarsa Pemerintah Daerah Kota Bogor dalam rangka memenuhi kebutuhan pendidikan menengah atas yang semakin meningkat di wilayah Bogor Selatan.</p>
<p>Sejak pertama kali membuka pendaftaran peserta didik, sekolah ini langsung mendapat sambutan hangat dari masyarakat sekitar. Pada tahun pertama, tercatat sebanyak 3 rombongan belajar dengan total 120 siswa berhasil terdaftar.</p>
<h3>Era Perkembangan (1990–2010)</h3>
<p>Memasuki era 1990-an, SMAN 4 Bogor mulai menunjukkan geliatnya sebagai sekolah berprestasi. Berbagai kejuaraan akademik maupun non-akademik berhasil diraih, mengangkat nama sekolah ke tingkat provinsi bahkan nasional.</p>
<p>Pada tahun 2005, sekolah mendapatkan status <strong>Sekolah Standar Nasional (SSN)</strong> dari Kementerian Pendidikan, sebuah pengakuan atas kualitas pembelajaran dan manajemen sekolah yang terus meningkat.</p>
<h3>Era Modern (2010–Sekarang)</h3>
<p>Di era modern, SMAN 4 Bogor terus berinovasi dengan mengintegrasikan teknologi dalam proses pembelajaran. Program kelas riset, laboratorium sains modern, dan kemitraan dengan berbagai universitas ternama menjadi bukti nyata komitmen sekolah terhadap kemajuan pendidikan.</p>`,
        orgDesc: 'Struktur organisasi SMAN 4 Kota Bogor terdiri dari Kepala Sekolah sebagai pimpinan tertinggi, dibantu oleh Wakil Kepala Sekolah bidang Kurikulum, Kesiswaan, Sarana Prasarana, dan Hubungan Masyarakat.',
      }
    });
    console.log('✅ Profil sekolah dibuat');
  } else {
    console.log('⏭️  Profil sekolah sudah ada, lewati.');
  }

  // ── 3. Jajaran Pimpinan ─────────────────────────────────────────────────────
  const staffCount = await prisma.staff.count();
  if (staffCount === 0) {
    const pimpinan = [
      { name: 'Hj. Emi Suhaemi, S.Pd., M.M.', position: 'Kepala Sekolah', bio: 'NIP: 196805121993032008', category: 'Pimpinan' },
      { name: 'Drs. Ahmad Fauzi, M.Pd.', position: 'Wakil Kepala Sekolah Kurikulum', bio: 'NIP: 197203141998021003', category: 'Pimpinan' },
      { name: 'Siti Rahayu, S.Pd.', position: 'Wakil Kepala Sekolah Kesiswaan', bio: 'NIP: 197805222001122002', category: 'Pimpinan' },
      { name: 'Bambang Supriyadi, S.T.', position: 'Wakil Kepala Sekolah Sarana & Prasarana', bio: 'NIP: 197612102005011010', category: 'Pimpinan' },
      { name: 'Dra. Nurul Hidayah, M.Si.', position: 'Wakil Kepala Sekolah Hubungan Masyarakat', bio: 'NIP: 197001281997022001', category: 'Pimpinan' },
    ];
    await prisma.staff.createMany({ data: pimpinan });
    console.log(`✅ ${pimpinan.length} data pimpinan dibuat`);
  } else {
    console.log('⏭️  Data staff sudah ada, lewati.');
  }

  // ── 4. Berita (News) ────────────────────────────────────────────────────────
  const newsCount = await prisma.news.count();
  if (newsCount === 0) {
    const newsItems = [
      {
        title: 'Perayaan HUT Ke-44 SMAN 4 Bogor Berlangsung Meriah dan Penuh Semangat',
        content: `<h2>Momen Bersejarah yang Tak Terlupakan</h2>
<p>Perayaan Hari Ulang Tahun (HUT) ke-44 SMA Negeri 4 Kota Bogor berlangsung dengan penuh sukacita dan semangat pada hari Sabtu, 15 Maret 2026. Acara yang dihadiri oleh seluruh warga sekolah, alumni, orang tua murid, dan tamu undangan ini menjadi momentum refleksi perjalanan panjang institusi pendidikan kebanggaan Bogor Selatan ini.</p>
<p>Rangkaian acara dimulai sejak pagi hari dengan upacara bendera khidmat yang dipimpin langsung oleh Kepala Sekolah, <strong>Hj. Emi Suhaemi, S.Pd., M.M.</strong> Dalam sambutannya, beliau menyampaikan apresiasi mendalam kepada seluruh sivitas akademika yang telah berkontribusi bagi kemajuan sekolah.</p>
<h3>Pameran Karya Siswa</h3>
<p>Salah satu highlight acara adalah pameran karya siswa yang menampilkan lebih dari 200 karya seni, hasil penelitian ilmiah, dan proyek teknologi. Pengunjung dibuat terkagum-kagum dengan inovasi-inovasi yang lahir dari tangan-tangan kreatif generasi muda SMAN 4 Bogor.</p>
<p>Perayaan ditutup dengan penampilan kolosal <em>Tari Kreasi Nusantara</em> yang melibatkan 200 siswa dan pertunjukan kembang api yang menerangi langit malam Bogor Selatan.</p>`,
        author: 'Tim Humas SMAN 4 Bogor',
        publishedAt: new Date('2026-03-15'),
      },
      {
        title: 'Sosialisasi Jalur Masuk Perguruan Tinggi Negeri 2026 untuk Siswa Kelas XII',
        content: `<h2>Persiapan Menuju Perguruan Tinggi Impian</h2>
<p>SMAN 4 Kota Bogor menggelar kegiatan Sosialisasi Jalur Penerimaan Mahasiswa Baru (PMB) 2026 untuk seluruh siswa kelas XII pada hari Rabu, 10 Maret 2026. Acara ini menghadirkan narasumber dari Lembaga Tes Masuk Perguruan Tinggi (LTMPT) dan perwakilan dari beberapa universitas ternama di Indonesia.</p>
<p>Kegiatan ini mencakup pemaparan tentang:</p>
<ul>
<li><strong>Jalur SNBP</strong> — Seleksi Nasional Berdasarkan Prestasi</li>
<li><strong>Jalur SNBT</strong> — Seleksi Nasional Berdasarkan Tes</li>
<li><strong>Jalur Mandiri</strong> — Seleksi yang diadakan oleh masing-masing perguruan tinggi</li>
</ul>
<p>Siswa diberikan panduan lengkap tentang cara mendaftar, syarat yang diperlukan, serta strategi mempersiapkan diri menghadapi seleksi. Konselor sekolah juga hadir memberikan bimbingan individual bagi siswa yang membutuhkan arahan dalam memilih program studi.</p>`,
        author: 'Seksi Bimbingan Konseling',
        publishedAt: new Date('2026-03-10'),
      },
      {
        title: 'SMAN 4 Bogor Raih Predikat Sekolah Adiwiyata Mandiri Tingkat Nasional',
        content: `<h2>Penghargaan Bergengsi Bidang Lingkungan Hidup</h2>
<p>Sebuah prestasi membanggakan kembali diraih oleh SMA Negeri 4 Kota Bogor. Pada tanggal 5 Maret 2026, sekolah ini resmi menerima penghargaan sebagai <strong>Sekolah Adiwiyata Mandiri Tingkat Nasional</strong> dari Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia.</p>
<p>Penghargaan ini merupakan bukti nyata komitmen SMAN 4 Bogor dalam mengintegrasikan nilai-nilai kepedulian lingkungan ke dalam seluruh aspek kehidupan sekolah, mulai dari kurikulum pembelajaran, pengelolaan sampah, hingga pemanfaatan energi terbarukan.</p>
<blockquote>
<p>"Penghargaan ini bukan hanya milik sekolah, tapi milik seluruh keluarga besar SMAN 4 Bogor yang telah bersama-sama menjaga bumi kita." — Kepala Sekolah</p>
</blockquote>`,
        author: 'Tim Adiwiyata SMAN 4 Bogor',
        publishedAt: new Date('2026-03-05'),
      },
      {
        title: 'Kegiatan Bakti Sosial OSIS: Berbagi Kebahagiaan di Panti Asuhan Al-Ikhlas',
        content: `<h2>Aksi Nyata Kepedulian Sosial Generasi Muda</h2>
<p>Organisasi Siswa Intra Sekolah (OSIS) SMAN 4 Kota Bogor menggelar kegiatan Bakti Sosial bertajuk <em>"Berbagi Kebahagiaan"</em> di Panti Asuhan Al-Ikhlas, Bogor Selatan, pada Minggu, 1 Maret 2026. Kegiatan ini diikuti oleh 75 siswa dari berbagai kelas dan melibatkan partisipasi aktif guru serta orang tua murid.</p>
<p>Dalam kegiatan ini, panitia berhasil mengumpulkan donasi berupa:</p>
<ul>
<li>250 paket sembako lengkap</li>
<li>150 set perlengkapan alat tulis</li>
<li>Uang tunai sebesar Rp 12.500.000 untuk pengembangan fasilitas panti</li>
</ul>
<p>Ketua OSIS, <strong>Rafi Pratama (XII IPA 3)</strong>, menyampaikan bahwa kegiatan ini merupakan bentuk nyata dari nilai-nilai kepedulian sosial yang selalu ditanamkan di SMAN 4 Bogor.</p>`,
        author: 'Pengurus OSIS SMAN 4 Bogor',
        publishedAt: new Date('2026-03-01'),
      },
      {
        title: 'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Segera Dibuka',
        content: `<h2>Informasi Resmi PPDB SMAN 4 Bogor 2026/2027</h2>
<p>SMA Negeri 4 Kota Bogor dengan bangga mengumumkan bahwa pendaftaran Penerimaan Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2026/2027 akan segera dibuka. Berikut informasi penting yang perlu diperhatikan oleh calon peserta didik dan orang tua:</p>
<h3>Jalur Penerimaan</h3>
<ul>
<li><strong>Jalur Zonasi</strong> — Kuota 50% dari total daya tampung</li>
<li><strong>Jalur Afirmasi</strong> — Kuota 15% untuk siswa dari keluarga tidak mampu dan penyandang disabilitas</li>
<li><strong>Jalur Perpindahan Tugas Orang Tua</strong> — Kuota 5%</li>
<li><strong>Jalur Prestasi</strong> — Kuota 30% berdasarkan nilai rapor dan penghargaan kejuaraan</li>
</ul>
<h3>Persyaratan Umum</h3>
<ul>
<li>Berusia maksimal 21 tahun per 1 Juli 2026</li>
<li>Lulus SMP/MTs atau sederajat pada tahun 2024, 2025, atau 2026</li>
<li>Memiliki ijazah atau surat keterangan lulus</li>
</ul>
<p>Informasi lebih lanjut akan diumumkan melalui website resmi Dinas Pendidikan Kota Bogor dan papan pengumuman sekolah.</p>`,
        author: 'Panitia PPDB SMAN 4 Bogor',
        publishedAt: new Date('2026-02-25'),
      },
    ];

    for (const item of newsItems) {
      const slug = generateSlug(item.title);
      await prisma.news.create({ data: { ...item, slug } });
    }
    console.log(`✅ ${newsItems.length} berita dibuat`);
  } else {
    console.log('⏭️  Data berita sudah ada, lewati.');
  }

  // ── 5. Prestasi ─────────────────────────────────────────────────────────────
  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    const achievements = [
      { title: 'Juara 1 Olimpiade Matematika Tingkat Nasional', level: 'Nasional', date: new Date('2026-02-20'), description: '<p>Siswa SMAN 4 Bogor berhasil meraih <strong>Juara 1</strong> dalam Olimpiade Matematika Nasional yang diselenggarakan oleh Kemdikbud. Prestasi luar biasa ini diraih oleh <strong>Alfarrel Gibran Pratama (XI MIPA 2)</strong> yang menyisihkan lebih dari 3.000 peserta dari seluruh Indonesia.</p><p>Keberhasilan ini merupakan hasil dari pembinaan intensif selama 6 bulan di bawah bimbingan guru matematika senior SMAN 4 Bogor.</p>' },
      { title: 'Medali Emas Kejuaraan Pencak Silat Internasional Thailand Open', level: 'Internasional', date: new Date('2026-01-15'), description: '<p>Tiga atlet silat SMAN 4 Bogor berhasil meraih <strong>Medali Emas</strong> dalam ajang Thailand Open Pencak Silat Championship 2026 di Bangkok, Thailand. Mereka adalah Rizki Ananda, Siti Khamidah, dan Muhammad Fadhil yang bertanding di kategori yang berbeda.</p>' },
      { title: 'Juara Umum Lomba Karya Ilmiah Remaja Tingkat Provinsi Jawa Barat', level: 'Provinsi', date: new Date('2025-11-10'), description: '<p>Tim KIR (Karya Ilmiah Remaja) SMAN 4 Bogor berhasil meraih <strong>Juara Umum</strong> dalam Lomba KIR Tingkat Provinsi Jawa Barat 2025 dengan mengantongi 3 medali emas dari 5 kategori yang diikuti.</p><p>Tema penelitian unggulan yang berhasil meraih emas adalah inovasi pengolahan limbah plastik menjadi bahan bakar alternatif.</p>' },
      { title: 'Juara 1 Debat Bahasa Inggris antar SMA se-Kota Bogor', level: 'Kota/Kab', date: new Date('2026-03-01'), description: '<p>Tim debat SMAN 4 Bogor berhasil meraih <strong>Juara 1</strong> dalam kompetisi Debat Bahasa Inggris antar SMA se-Kota Bogor yang diselenggarakan oleh Dinas Pendidikan Kota Bogor. Tim ini terdiri dari Nayla Firdaus, Yusuf Habibie, dan Putri Indah Lestari.</p>' },
      { title: 'Juara 3 Kompetisi Robotika Nasional SMA/SMK', level: 'Nasional', date: new Date('2025-12-05'), description: '<p>Tim Robotika Ekstrakurikuler SMAN 4 Bogor berhasil meraih <strong>Juara 3 Nasional</strong> dalam Kompetisi Robotika SMA/SMK yang diselenggarakan di Universitas Indonesia. Robot yang diciptakan bertemakan solusi pertanian cerdas berbasis sensor IoT.</p>' },
      { title: 'Paskibraka Pasukan 17 Tingkat Kota Bogor', level: 'Kota/Kab', date: new Date('2025-08-17'), description: '<p>Dua orang siswa SMAN 4 Bogor terpilih sebagai anggota <strong>Paskibraka Pasukan 17 Kota Bogor</strong> dalam rangkaian peringatan HUT RI ke-80. Mereka adalah M. Iqbal Taufiqurrahman (XI IPS 1) sebagai pembawa bendera putra dan Dewi Sartika Putri (XI MIPA 3) sebagai pembawa bendera putri.</p>' },
    ];

    for (const item of achievements) {
      const slug = generateSlug(item.title);
      await prisma.achievement.create({ data: { ...item, slug } });
    }
    console.log(`✅ ${achievements.length} data prestasi dibuat`);
  } else {
    console.log('⏭️  Data prestasi sudah ada, lewati.');
  }

  // ── 6. Layanan ──────────────────────────────────────────────────────────────
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    const services = [
      {
        title: 'Perpustakaan Digital & Fisik',
        description: `<h3>Fasilitas Literasi Terpadu</h3>
<p>SMAN 4 Bogor memiliki perpustakaan modern yang terintegrasi antara koleksi fisik dan digital. Koleksi buku mencapai lebih dari <strong>15.000 judul</strong> yang mencakup buku pelajaran, referensi ilmiah, sastra, hingga buku pengembangan diri.</p>
<ul>
<li>Akses e-book dan jurnal ilmiah internasional 24 jam</li>
<li>Ruang baca nyaman berkapasitas 100 orang</li>
<li>Sistem peminjaman berbasis digital/kartu RFID</li>
<li>Pojok baca tematik dan ruang diskusi kelompok</li>
</ul>
<p><strong>Jam Operasional:</strong> Senin–Jumat pukul 07.00–16.00 WIB</p>`,
      },
      {
        title: 'Laboratorium Sains Terpadu',
        description: `<h3>Ruang Eksplorasi Ilmu Pengetahuan</h3>
<p>Laboratorium sains SMAN 4 Bogor terdiri dari 3 unit laboratorium yang dilengkapi peralatan modern dan standar internasional.</p>
<ul>
<li><strong>Lab Fisika</strong> — Alat percobaan lengkap, osiloskop digital, sensor data logger</li>
<li><strong>Lab Kimia</strong> — Lemari asam, alat destilasi, spektrometer</li>
<li><strong>Lab Biologi</strong> — Mikroskop digital, preparat awetan, model anatomi</li>
</ul>
<p>Setiap laboratorium dilengkapi dengan sistem ventilasi standar, APAR (Alat Pemadam Api Ringan), dan SOP keselamatan yang ketat.</p>`,
      },
      {
        title: 'Laboratorium Komputer & Multimedia',
        description: `<h3>Pusat Pembelajaran Digital</h3>
<p>Laboratorium komputer SMAN 4 Bogor dilengkapi dengan <strong>60 unit komputer</strong> spesifikasi tinggi yang terhubung dengan jaringan internet berkecepatan tinggi (1 Gbps fiber optic).</p>
<ul>
<li>Studio rekaman audio-visual untuk produksi konten kreatif</li>
<li>Software desain grafis, video editing, dan pemrograman</li>
<li>Smart board interaktif di setiap ruangan</li>
<li>Tersedia untuk kegiatan belajar mandiri di luar jam pelajaran</li>
</ul>`,
      },
      {
        title: 'Bimbingan Konseling (BK)',
        description: `<h3>Pendampingan Akademik & Psikologi Siswa</h3>
<p>Layanan Bimbingan Konseling (BK) SMAN 4 Bogor hadir untuk mendampingi siswa dalam menghadapi berbagai tantangan akademik maupun personal selama masa studi.</p>
<ul>
<li>Konsultasi individual tentang pilihan jurusan dan karir</li>
<li>Mediasi konflik antar siswa</li>
<li>Program anti-bullying dan kesehatan mental</li>
<li>Bimbingan kelompok tematik setiap minggu</li>
</ul>
<p>Konselor kami adalah tenaga profesional berlisensi dengan pengalaman lebih dari 10 tahun di bidang psikologi pendidikan.</p>`,
      },
      {
        title: 'Klinik Kesehatan Sekolah (UKS)',
        description: `<h3>Kesehatan Fisik & Mental Warga Sekolah</h3>
<p>Unit Kesehatan Sekolah (UKS) SMAN 4 Bogor beroperasi setiap hari sekolah dengan tenaga kesehatan terlatih untuk memberikan pertolongan pertama dan layanan kesehatan dasar.</p>
<ul>
<li>Pemeriksaan kesehatan rutin (tekanan darah, glukosa darah)</li>
<li>Penanganan cedera ringan dan pertolongan pertama</li>
<li>Konsultasi kesehatan dengan dokter (2x seminggu)</li>
<li>Penyuluhan kesehatan remaja dan gizi seimbang</li>
</ul>`,
      },
    ];
    await prisma.service.createMany({ data: services });
    console.log(`✅ ${services.length} layanan dibuat`);
  } else {
    console.log('⏭️  Data layanan sudah ada, lewati.');
  }

  // ── 7. Publikasi ────────────────────────────────────────────────────────────
  const pubCount = await prisma.publication.count();
  if (pubCount === 0) {
    const publications = [
      { title: 'Kalender Akademik Tahun Pelajaran 2025/2026', fileUrl: 'https://drive.google.com/file/d/example1', publishedAt: new Date('2025-07-01') },
      { title: 'Jadwal Ujian Akhir Semester Genap 2025/2026', fileUrl: 'https://drive.google.com/file/d/example2', publishedAt: new Date('2026-05-01') },
      { title: 'Tata Tertib Siswa SMAN 4 Bogor Edisi 2025', fileUrl: 'https://drive.google.com/file/d/example3', publishedAt: new Date('2025-07-15') },
      { title: 'Buku Panduan PPDB Tahun Ajaran 2026/2027', fileUrl: 'https://drive.google.com/file/d/example4', publishedAt: new Date('2026-02-01') },
      { title: 'Laporan Kegiatan Adiwiyata Sekolah 2025', fileUrl: 'https://drive.google.com/file/d/example5', publishedAt: new Date('2025-12-01') },
      { title: 'Formulir Izin Tidak Masuk Sekolah', fileUrl: 'https://drive.google.com/file/d/example6', publishedAt: new Date('2025-07-01') },
    ];
    await prisma.publication.createMany({ data: publications });
    console.log(`✅ ${publications.length} dokumen publikasi dibuat`);
  } else {
    console.log('⏭️  Data publikasi sudah ada, lewati.');
  }

  console.log('\n🎉 Seeder selesai! Semua data berhasil ditambahkan.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Login Admin: username = Staff-admin-1  |  password = 16132sman4bogor');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch(e => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
