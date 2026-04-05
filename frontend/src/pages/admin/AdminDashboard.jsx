import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, Navigate } from 'react-router-dom';

// Konfigurasi axios global dengan token interceptor
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const uploadImage = async (file) => {
  if (!file) return '';
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  } catch (err) {
    alert('Gagal mengunggah gambar: ' + (err.response?.data?.error || err.message));
    return '';
  }
};

const quillModules = {
   toolbar: [
     [{ 'header': [1, 2, 3, false] }],
     ['bold', 'italic', 'underline', 'strike'],
     [{'list': 'ordered'}, {'list': 'bullet'}],
     ['clean']
   ],
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profil');
  const navigate = useNavigate();

  // Perlindungan akses rute
  if (!sessionStorage.getItem('adminToken')) {
     return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
     if(window.confirm("Yakin ingin mengakhiri sesi admin?")) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
     }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex mt-16 md:mt-20">
       <div className="w-64 bg-[#144C33] text-white p-6 shadow-xl hidden md:block border-r-4 border-emerald-900 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black mb-8 border-b-2 border-emerald-700/50 pb-4 tracking-wide">Panel Admin</h2>
            <nav className="space-y-4 font-bold text-sm tracking-widest">
               <button onClick={() => setActiveTab('profil')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='profil'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>PROFIL UTAMA</button>
               <button onClick={() => setActiveTab('pimpinan')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='pimpinan'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>JAJARAN PIMPINAN</button>
               <button onClick={() => setActiveTab('halaman')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='halaman'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>HALAMAN TENTANG KAMI</button>
               <button onClick={() => setActiveTab('sejarah')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='sejarah'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>SEJARAH SEKOLAH</button>
               <button onClick={() => setActiveTab('ekstra')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='ekstra'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>LAYANAN & PUBLIKASI</button>
               <button onClick={() => setActiveTab('berita')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='berita'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>KELOLA BERITA</button>
               <button onClick={() => setActiveTab('prestasi')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='prestasi'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>KELOLA PRESTASI</button>
               <div className="my-4 border-t border-emerald-800"></div>
               <button onClick={() => setActiveTab('akun')} className={`w-full text-left px-4 py-4 rounded transition shadow-sm ${activeTab==='akun'? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'}`}>AKUN SAYA</button>
            </nav>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-4 rounded font-bold text-sm tracking-widest text-red-200 mt-12 hover:bg-red-900/50 transition">LOG OUT KELUAR</button>
       </div>
       <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'profil' && <ProfileManager />}
          {activeTab === 'pimpinan' && <PimpinanManager />}
          {activeTab === 'halaman' && <PagesManager />}
          {activeTab === 'sejarah' && <SejarahManager />}
          {activeTab === 'ekstra' && <ExtrasManager />}
          {activeTab === 'berita' && <NewsManager />}
          {activeTab === 'prestasi' && <AchievementManager />}
          {activeTab === 'akun' && <AccountManager />}
       </div>
    </div>
  );
}

// ---- Sub Components ----

function AccountManager() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    if(form.newPassword !== form.confirmPassword) {
       return setError('Password baru dan konfirmasi tidak pas/sama!');
    }
    
    try {
      const res = await api.put('/auth/password', {
         currentPassword: form.currentPassword,
         newPassword: form.newPassword
      });
      setMessage(res.data.message);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch(err) {
      setError(err.response?.data?.error || 'Gagal merubah password. Coba kembali.');
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 max-w-2xl">
       <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-l-8 border-emerald-600 pl-4">Pengaturan Akun & Keamanan</h1>
       
       {message && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg mb-6 font-bold">{message}</div>}
       {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-bold truncate">{error}</div>}

       <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password Saat Ini</label>
            <input type="password" required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} placeholder="Ketik kata sandi lama Anda" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Password Baru</label>
               <input type="password" minLength={6} required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} placeholder="Min. 6 karakter" />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Psw. Baru</label>
               <input type="password" minLength={6} required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} placeholder="Ulangi kembali" />
             </div>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition">Simpan Password Baru</button>
       </form>
    </div>
  )
}

function ProfileManager() {
  const [data, setData] = useState({ 
    name: '', description: '', 
    logoUrl: '', headerText: '', backgroundUrl: '',
    headmasterName: '', headmasterPhotoUrl: '',
    studentCount: 0, teacherCount: 0, alumniCount: 0,
    achievementInt: 0, achievementNat: 0, achievementProv: 0, achievementReg: 0,
    vision: '', mission: '', motto: '', historyText: '', orgStructureUrl: '', orgDesc: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile').then(res => {
        if(res.data.id) setData(res.data);
        setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', data);
      alert('Profil berhasil diperbarui!');
    } catch(err) { alert('Gagal memperbarui profil: '+ (err.response?.data?.error||'Cek koneksi/login expired.')); }
  };

  if(loading) return <p className="text-center font-bold text-gray-400 mt-20 animate-pulse">Memuat data profil...</p>;

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 max-w-4xl">
       <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-l-8 border-emerald-600 pl-4">Pengaturan Profil & Statistik Sekolah</h1>
       <form onSubmit={handleSave} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Web / Sekolah</label>
            <input type="text" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none transition" value={data.name || ''} onChange={e => setData({...data, name: e.target.value})} />
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
             <h3 className="font-bold text-emerald-800 tracking-wide mb-6">Pengaturan Tampilan (Setting System)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Gambar Logo Sekolah (JPG/PNG)</label>
                  {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="h-12 mb-2 object-contain" />}
                  <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm bg-white" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setData({...data, logoUrl: url}); } }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Teks Header Utama</label>
                  <input type="text" placeholder="Selamat Datang di SMAN 4" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.headerText || ''} onChange={e => setData({...data, headerText: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Gambar Background (Opsional)</label>
                  {data.backgroundUrl && <img src={data.backgroundUrl} alt="Bg" className="h-20 mb-2 object-cover rounded" />}
                  <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm bg-white" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setData({...data, backgroundUrl: url}); } }} />
                </div>
             </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
             <h3 className="font-bold text-emerald-800 tracking-wide mb-6">Pesan Utama & Kepala Sekolah</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Nama Kepala Sekolah</label>
                  <input type="text" placeholder="Semisal: Hj. Emi Suhaemi, S.Pd" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.headmasterName || ''} onChange={e => setData({...data, headmasterName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Foto Kepala Sekolah (JPG/PNG)</label>
                  {data.headmasterPhotoUrl && <img src={data.headmasterPhotoUrl} alt="Kepsek" className="h-24 mb-2 object-cover rounded shadow" />}
                  <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm bg-white" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setData({...data, headmasterPhotoUrl: url}); } }} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sambutan Kepsek / Pesan Utama</label>
                  <div className="bg-white rounded border pb-10">
                     <ReactQuill theme="snow" value={data.description || ''} onChange={val => setData({...data, description: val})} modules={quillModules} className="h-32" />
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
             <h3 className="font-bold text-gray-800 tracking-wide mb-6">Data Statistik Orang</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Peserta Didik</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.studentCount || 0} onChange={e => setData({...data, studentCount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tenaga Pendidik</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.teacherCount || 0} onChange={e => setData({...data, teacherCount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Staf Kependidikan</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.staffCount || 0} onChange={e => setData({...data, staffCount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Estimasi Alumni</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.alumniCount || 0} onChange={e => setData({...data, alumniCount: Number(e.target.value)})} />
                </div>
             </div>
             
             <h3 className="font-bold text-gray-800 tracking-wide mb-6 mt-10">Data Statistik Prestasi</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Internasional</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.achievementInt || 0} onChange={e => setData({...data, achievementInt: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Nasional</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.achievementNat || 0} onChange={e => setData({...data, achievementNat: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Provinsi</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.achievementProv || 0} onChange={e => setData({...data, achievementProv: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Regional/Kota</label>
                  <input type="number" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm" value={data.achievementReg || 0} onChange={e => setData({...data, achievementReg: Number(e.target.value)})} />
                </div>
             </div>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg w-full md:w-auto">Simpan Perubahan</button>
       </form>
    </div>
  )
}

function NewsManager() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '' });

  useEffect(() => { loadNews(); }, []);

  const loadNews = () => api.get('/news').then(res => setNews(res.data));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/news', form);
      setForm({ title: '', content: '', imageUrl: '' });
      loadNews();
    } catch(err) { alert('Gagal mendisimpan. Login Anda mungkin sudah kedaluwarsa.'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus berita ini secara permanen?')) {
       await api.delete(`/news/${id}`);
       loadNews();
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
       <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900 border-l-8 border-emerald-600 pl-4">Tulis Pengumuman / Berita</h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <input placeholder="Ketik Judul Berita di sini..." required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none font-bold text-lg" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            
            <div>
               <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Unggah Foto Utama (Saran: Lanskap/Horizontal)</label>
               {form.imageUrl && <img src={form.imageUrl} alt="News Preview" className="h-24 mb-2 object-cover rounded shadow" />}
               <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm bg-slate-50" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setForm({...form, imageUrl: url}); } }} />
            </div>

            <div className="bg-white rounded border pb-10 mb-4 h-48">
               <ReactQuill theme="snow" value={form.content || ''} onChange={val => setForm({...form, content: val})} modules={quillModules} className="h-full" placeholder="Isi Konten Berita lengkap..." />
            </div>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-emerald-700 transition">Publikasikan Berita</button>
          </form>
       </div>
       <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-extrabold mb-6">Arsip Berita Dipublikasi</h2>
          <div className="space-y-4">
             {news.length === 0 && <p className="text-gray-400 italic">Belum ada berita dibuat.</p>}
             {news.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 hover:bg-emerald-50 transition p-4 border border-gray-100 rounded-lg">
                   <div>
                     <p className="font-bold text-gray-800">{item.title}</p>
                     <p className="text-xs font-mono mt-1 text-emerald-600">{new Date(item.publishedAt).toLocaleDateString()}</p>
                   </div>
                   <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold px-4 py-2 hover:bg-red-100 rounded transition">Hapus</button>
                </div>
             ))}
          </div>
       </div>
    </div>
  )
}

function AchievementManager() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({ title: '', level: 'Nasional', date: '', imageUrl: '' });

  useEffect(() => { loadAch(); }, []);

  const loadAch = () => api.get('/achievements').then(res => setAchievements(res.data));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/achievements', { ...form, date: form.date ? new Date(form.date) : new Date() });
      setForm({ title: '', level: 'Nasional', date: '', imageUrl: '' });
      loadAch();
    } catch(err) { alert('Gagal mendisimpan. Login Anda mungkin sudah kedaluwarsa.'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Hapus data rekor prestasi ini?')) {
       await api.delete(`/achievements/${id}`);
       loadAch();
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
       <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900 border-l-8 border-emerald-600 pl-4">Tambah Validasi Prestasi Baru</h2>
          <form onSubmit={handleCreate} className="space-y-5 flex flex-col">
            <input placeholder="Judul Prestasi (cth: Juara 1 Futsal Olimpiade 2026)" required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none font-bold" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            
            <div>
               <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Dokumentasi (Foto Piala / Perlombaan)</label>
               {form.imageUrl && <img src={form.imageUrl} alt="Prestasi View" className="h-24 mb-2 object-cover rounded shadow" />}
               <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-white focus:border-emerald-500 rounded-lg p-3 outline-none shadow-sm bg-slate-50" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setForm({...form, imageUrl: url}); } }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tanggal Prestasi</label>
                  <input type="date" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Kategori / Tingkat</label>
                  <select className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                    <option>Internasional</option>
                    <option>Nasional</option>
                    <option>Provinsi</option>
                    <option>Kota / Regional</option>
                  </select>
               </div>
            </div>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg self-start mt-2 font-bold shadow-lg hover:bg-emerald-700 transition">Simpan Daftar Prestasi</button>
          </form>
       </div>
       <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-extrabold mb-6">Database Prestasi Siswa</h2>
          <div className="space-y-4">
             {achievements.length === 0 && <p className="text-gray-400 italic">Belum ada data prestasi di database.</p>}
             {achievements.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 hover:bg-emerald-50 p-4 border rounded-lg transition">
                   <div>
                     <p className="font-bold text-gray-800">{item.title}</p>
                     <div className="flex gap-2 items-center mt-1">
                        <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-0.5 rounded font-bold">{item.level}</span>
                        <span className="text-xs text-gray-400 font-mono">{new Date(item.date).toLocaleDateString()}</span>
                     </div>
                   </div>
                   <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold px-4 py-2 hover:bg-red-100 rounded transition">Hapus</button>
                </div>
             ))}
          </div>
       </div>
    </div>
  )
}

function PagesManager() {
  const [data, setData] = useState({ vision: '', mission: '', motto: '', historyText: '', orgStructureUrl: '', orgDesc: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile').then(res => {
        if(res.data.id) setData(res.data);
        setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', data);
      alert('Konten halaman berhasil diperbarui!');
    } catch(err) { alert('Gagal menyimpan.'); }
  };

  if(loading) return <p className="text-center font-bold text-gray-400 mt-20 animate-pulse">Memuat konten...</p>;

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 max-w-4xl space-y-10">
       <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Kelola Halaman "Tentang Kami"</h1>
       <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-emerald-800 border-b pb-2">Visi Misi & Motto</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Visi Sekolah</label>
              <div className="bg-white rounded border pb-10">
                 <ReactQuill theme="snow" value={data.vision || ''} onChange={val => setData({...data, vision: val})} modules={quillModules} className="h-24" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Misi Sekolah</label>
              <div className="bg-white rounded border pb-10">
                 <ReactQuill theme="snow" value={data.mission || ''} onChange={val => setData({...data, mission: val})} modules={quillModules} className="h-32" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Motto</label>
              <input type="text" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3" value={data.motto || ''} onChange={e => setData({...data, motto: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h3 className="font-bold text-xl text-emerald-800 border-b pb-2">Struktur Organisasi</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Gambar Bagan Organisasi</label>
              {data.orgStructureUrl && <img src={data.orgStructureUrl} alt="Bagan" className="h-32 mb-4 object-contain" />}
              <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 bg-white cursor-pointer" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setData({...data, orgStructureUrl: url}); } }} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Singkat Struktur</label>
              <div className="bg-white rounded border pb-10">
                 <ReactQuill theme="snow" value={data.orgDesc || ''} onChange={val => setData({...data, orgDesc: val})} modules={quillModules} className="h-24" />
              </div>
            </div>
          </div>

          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg w-full">Simpan Pembaruan Halaman</button>
       </form>
    </div>
  )
}

function ExtrasManager() {
  const [services, setServices] = useState([]);
  const [pubs, setPubs] = useState([]);
  
  const [svcForm, setSvcForm] = useState({ title: '', description: '', iconUrl: '' });
  const [pubForm, setPubForm] = useState({ title: '', fileUrl: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = () => {
    api.get('/services').then(res => setServices(res.data));
    api.get('/publications').then(res => setPubs(res.data));
  };

  const handleCreateSvc = async (e) => {
    e.preventDefault();
    await api.post('/services', svcForm);
    setSvcForm({ title: '', description: '', iconUrl: '' });
    loadAll();
  };

  const handleCreatePub = async (e) => {
    e.preventDefault();
    await api.post('/publications', pubForm);
    setPubForm({ title: '', fileUrl: '' });
    loadAll();
  };

  return (
    <div className="space-y-12 max-w-5xl">
       {/* Layanan */}
       <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-extrabold mb-4 text-emerald-800 border-b pb-2">Tambah Layanan</h2>
            <form onSubmit={handleCreateSvc} className="space-y-4">
              <input placeholder="Nama Layanan (Cth: Perpus Digital)" required className="w-full border-2 rounded p-2" value={svcForm.title} onChange={e=>setSvcForm({...svcForm, title: e.target.value})} />
              <div className="bg-white rounded border pb-10 h-32 mb-4 mt-2">
                 <ReactQuill theme="snow" value={svcForm.description || ''} onChange={val => setSvcForm({...svcForm, description: val})} modules={quillModules} className="h-full" placeholder="Deskripsi Singkat..." />
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded font-bold">Simpan Layanan</button>
            </form>
          </div>
          <div className="flex-1 pl-0 md:pl-8 md:border-l">
            <h2 className="text-xl font-extrabold mb-4 text-gray-800">Daftar Layanan</h2>
            <div className="space-y-2">
               {services.length === 0 && <p className="text-xs text-gray-400">Belum ada data.</p>}
               {services.map(i => (
                 <div key={i.id} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{i.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{i.description}</p>
                    </div>
                    <button onClick={async () =>{ if(window.confirm('Delete?')){ await api.delete(`/services/${i.id}`); loadAll(); } }} className="text-red-500 text-xs font-bold px-2 py-1">X</button>
                 </div>
               ))}
            </div>
          </div>
       </div>

       {/* Publikasi */}
       <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-extrabold mb-4 text-emerald-800 border-b pb-2">Tambah Dokumen Publikasi</h2>
            <form onSubmit={handleCreatePub} className="space-y-4">
              <input placeholder="Judul Dokumen (Cth: Kalender Akademik)" required className="w-full border-2 rounded p-2" value={pubForm.title} onChange={e=>setPubForm({...pubForm, title: e.target.value})} />
              
              <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg space-y-3">
                 <label className="block text-xs font-bold text-gray-500 uppercase">Opsi 1: Upload File dari Komputer (PDF/DOC/Medsos)</label>
                 <input type="file" className="w-full border-2 rounded bg-white p-2 text-sm" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setPubForm({...pubForm, fileUrl: url}); } }} />
                 
                 <div className="text-center font-bold text-gray-400 text-xs">ATAU</div>
                 
                 <label className="block text-xs font-bold text-gray-500 uppercase">Opsi 2: Masukkan Link GDrive Secara Manual</label>
                 <input placeholder="https://drive.google.com/..." className="w-full border-2 rounded p-2 text-sm" value={pubForm.fileUrl} onChange={e=>setPubForm({...pubForm, fileUrl: e.target.value})} />
              </div>

              <button className="bg-emerald-600 text-white px-4 py-2 rounded font-bold w-full md:w-auto">Simpan Dokumen</button>
            </form>
          </div>
          <div className="flex-1 pl-0 md:pl-8 md:border-l">
            <h2 className="text-xl font-extrabold mb-4 text-gray-800">Arsip Publikasi</h2>
            <div className="space-y-2">
               {pubs.length === 0 && <p className="text-xs text-gray-400">Belum ada data.</p>}
               {pubs.map(i => (
                 <div key={i.id} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{i.title}</h4>
                      <a href={i.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline line-clamp-1">{i.fileUrl || 'Tanpa Link'}</a>
                    </div>
                    <button onClick={async () =>{ if(window.confirm('Delete?')){ await api.delete(`/publications/${i.id}`); loadAll(); } }} className="text-red-500 text-xs font-bold px-2 py-1">X</button>
                 </div>
               ))}
            </div>
          </div>
       </div>
    </div>
  )
}

function PimpinanManager() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    position: '',
    bio: '',
    imageUrl: '',
    category: 'Pimpinan'
  });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    api.get('/staff').then(res => {
       const pimpinanData = res.data.filter(item => item.category === 'Pimpinan');
       setData(pimpinanData);
    });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/staff/${editingId}`, form);
      } else {
        await api.post('/staff', form);
      }
      setForm({ name: '', position: '', bio: '', imageUrl: '', category: 'Pimpinan' });
      setShowModal(false);
      setEditingId(null);
      loadData();
    } catch(err) { alert('Gagal menyimpan data pimpinan. Silakan coba lagi.'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus data ini?')) {
       await api.delete(`/staff/${id}`);
       loadData();
    }
  };

  const handleEdit = (item) => {
    setForm({
       name: item.name,
       position: item.position,
       bio: item.bio || '',
       imageUrl: item.imageUrl || '',
       category: 'Pimpinan'
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ name: '', position: '', bio: '', imageUrl: '', category: 'Pimpinan' });
    setEditingId(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-10 max-w-6xl">
       <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Data Informasi Pimpinan</h2>
             <button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition">+ Tambah Data</button>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-100 border-b-2 border-emerald-500">
                      <th className="p-3 font-bold text-gray-700 uppercase text-xs">No</th>
                      <th className="p-3 font-bold text-gray-700 uppercase text-xs text-center">Gambar</th>
                      <th className="p-3 font-bold text-gray-700 uppercase text-xs w-1/2">Isi</th>
                      <th className="p-3 font-bold text-gray-700 uppercase text-xs text-center">Edit</th>
                   </tr>
                </thead>
                <tbody>
                   {data.length === 0 && (
                     <tr><td colSpan="4" className="p-4 text-center text-gray-400 italic">Belum ada data pimpinan terdaftar.</td></tr>
                   )}
                   {data.map((item, idx) => (
                      <tr key={item.id} className="border-b bg-gray-50 hover:bg-emerald-50 transition">
                         <td className="p-3 text-center text-sm font-bold text-gray-500">{idx + 1}</td>
                         <td className="p-3 flex justify-center">
                            {item.imageUrl ? (
                               <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded shadow-sm border" />
                            ) : (
                               <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 italic">Kosong</div>
                            )}
                         </td>
                         <td className="p-3">
                            <p className="font-bold text-gray-800 uppercase">{item.name}</p>
                            <p className="text-sm text-emerald-700 font-bold tracking-wide uppercase">{item.position} {item.bio ? `- ${item.bio}` : ''}</p>
                         </td>
                         <td className="p-3">
                            <div className="flex justify-center gap-2">
                               <button onClick={() => handleEdit(item)} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded transition" title="Edit Data">✏️</button>
                               <button onClick={() => handleDelete(item.id)} className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded transition" title="Hapus Data">🗑️</button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* Moda Tambah/Edit */}
       {showModal && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xl w-full">
               <h3 className="text-xl font-extrabold mb-6 text-gray-900 border-l-4 border-emerald-600 pl-3">
                  {editingId ? 'Edit Data Pimpinan' : 'Tambah Data Pimpinan'}
               </h3>
               <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap (beserta Gelar)</label>
                    <input autoFocus required className="w-full border-2 border-slate-200 rounded p-2 focus:border-emerald-500" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Contoh: ALIF RIFA'I, S.S" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jabatan Posisi</label>
                    <input required className="w-full border-2 border-slate-200 rounded p-2 focus:border-emerald-500" value={form.position} onChange={e=>setForm({...form, position: e.target.value})} placeholder="Contoh: WAKA KESISWAAN" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Informasi Tambahan (NIP/NIG)</label>
                    <input className="w-full border-2 border-slate-200 rounded p-2 focus:border-emerald-500" value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} placeholder="Contoh: NIP : 198102212007101001" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Upload Fotografi (JPG/PNG)</label>
                    {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="h-16 mb-2 border rounded shadow-sm" />}
                    <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-slate-200 cursor-pointer rounded p-2 bg-gray-50 focus:border-emerald-500" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setForm({...form, imageUrl: url}); } }} />
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                     <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold transition">Batal</button>
                     <button type="submit" className="px-6 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700 font-bold transition shadow-lg">{editingId ? 'Simpan Pembaruan' : 'Simpan Pimpinan Baru'}</button>
                  </div>
               </form>
            </div>
         </div>
       )}
    </div>
  )
}

function SejarahManager() {
  const [data, setData] = useState({ historyText: '', historyImageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile').then(res => {
        if(res.data.id) setData(res.data);
        setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', data);
      alert('Sejarah sekolah berhasil diperbarui!');
    } catch(err) { alert('Gagal menyimpan sejarah.'); }
  };

  if(loading) return <p className="text-center font-bold text-gray-400 mt-20 animate-pulse">Memuat data sejarah...</p>;

  // React Quill Modules for Toolbar
  // Using global quillModules

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 max-w-5xl space-y-8">
       <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Sejarah Sekolah</h1>
       <form onSubmit={handleSave} className="space-y-8">
          
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-6">
             <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Edit Foto Utama Sejarah</label>
                <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 bg-white cursor-pointer" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setData({...data, historyImageUrl: url}); } }} />
             </div>
             <div className="w-48 h-32 bg-gray-200 border border-dashed border-gray-400 rounded-lg flex items-center justify-center overflow-hidden">
                {data.historyImageUrl ? (
                   <img src={data.historyImageUrl} alt="Sejarah" className="object-cover w-full h-full" />
                ) : (
                   <span className="text-xs text-gray-500 font-bold uppercase text-center px-2">Preview Foto</span>
                )}
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten Sejarah Sekolah</label>
             <div className="bg-white rounded-lg overflow-hidden border">
                <ReactQuill 
                   theme="snow" 
                   value={data.historyText || ''} 
                   onChange={(val) => setData({...data, historyText: val})} 
                   modules={quillModules}
                   className="h-80 pb-12"
                />
             </div>
          </div>

          <div className="flex justify-start pt-4">
             <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-lg font-bold shadow-lg transition tracking-wide flex items-center gap-2">
               Save
             </button>
          </div>
       </form>
    </div>
  )
}
