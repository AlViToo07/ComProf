const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('16132sman4bogor', 10);
  
  // Cari admin yang sudah ada dari database VPS
  const existingAdmin = await prisma.admin.findFirst();
  
  if (existingAdmin) {
    // Timpa akun lama menjadi username & password baru
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: { username: 'Staff-admin-1', password: hashedPassword }
    });
    console.log('✅ Akun Admin berhasil diperbarui menjadi Staff-admin-1 / 16132sman4bogor');
  } else {
    // Kalau belum ada sama sekali, buat baru
    await prisma.admin.create({
      data: { username: 'Staff-admin-1', password: hashedPassword }
    });
    console.log('✅ Admin baru berhasil dibuat: Staff-admin-1 / 16132sman4bogor');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
