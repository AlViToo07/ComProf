import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, Navigate } from 'react-router-dom';

// Axios instance dengan token interceptor
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper upload gambar
const uploadImage = async (file) => {
  if (!file) return '';
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.url;
  } catch (err) {
    alert('Gagal mengunggah gambar: ' + (err.response?.data?.error || err.message));
    return '';
  }
};

// Konfigurasi toolbar Quill
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

// ── Komponen Modal Umum ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center font-bold text-lg transition">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Upload Field dengan Preview ───────────────────────────────────────────────
function ImageUploadField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      {value && <img src={value} alt="preview" className="h-24 mb-2 rounded-lg object-cover shadow border" />}
      <input type="file" accept="image/jpeg,image/png,image/jpg"
        className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-2 text-sm bg-white cursor-pointer"
        onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if (url) onChange(url); } }} />
    </div>
  );
}

// ── Input Field biasa ─────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <input type={type} required={required} placeholder={placeholder}
        className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none transition text-sm"
        value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

// ── Tombol Aksi Tabel ─────────────────────────────────────────────────────────
function ActionBtn({ onClick, color, children }) {
  const colors = {
    green: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    red: 'bg-red-100 text-red-700 hover:bg-red-200',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  };
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${colors[color] || colors.green}`}>
      {children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profil');
  const navigate = useNavigate();

  if (!sessionStorage.getItem('adminToken')) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    if (window.confirm('Yakin ingin mengakhiri sesi admin?')) {
      sessionStorage.removeItem('adminToken');
      navigate('/admin/login', { replace: true });
    }
  };

  const tabs = [
    { key: 'profil', label: 'PROFIL UTAMA' },
    { key: 'pimpinan', label: 'JAJARAN PIMPINAN' },
    { key: 'halaman', label: 'TENTANG KAMI' },
    { key: 'sejarah', label: 'SEJARAH SEKOLAH' },
    { key: 'layanan', label: 'LAYANAN' },
    { key: 'publikasi', label: 'PUBLIKASI' },
    { key: 'berita', label: 'BERITA' },
    { key: 'prestasi', label: 'PRESTASI' },
    { key: 'akun', label: 'AKUN SAYA' },
  ];

  return (
    <div className="min-h-[85vh] bg-slate-50 flex mt-16 md:mt-20">
      {/* Sidebar */}
      <div className="w-64 bg-[#144C33] text-white p-6 shadow-xl hidden md:flex flex-col justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-black mb-8 border-b-2 border-emerald-700/50 pb-4 tracking-wide">Panel Admin</h2>
          <nav className="space-y-2 font-bold text-sm tracking-widest">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`w-full text-left px-4 py-3 rounded transition text-xs ${activeTab === t.key ? 'bg-emerald-600' : 'hover:bg-emerald-800'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded font-bold text-sm text-red-200 hover:bg-red-900/50 transition">
          LOG OUT KELUAR
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'profil' && <ProfileManager />}
        {activeTab === 'pimpinan' && <PimpinanManager />}
        {activeTab === 'halaman' && <PagesManager />}
        {activeTab === 'sejarah' && <SejarahManager />}
        {activeTab === 'layanan' && <LayananManager />}
        {activeTab === 'publikasi' && <PublikasiManager />}
        {activeTab === 'berita' && <NewsManager />}
        {activeTab === 'prestasi' && <AchievementManager />}
        {activeTab === 'akun' && <AccountManager />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ACCOUNT MANAGER
// ══════════════════════════════════════════════════════════════════════════════
function AccountManager() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault(); setMessage(''); setError('');
    if (form.newPassword !== form.confirmPassword) return setError('Password baru dan konfirmasi tidak sama!');
    try {
      const res = await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMessage(res.data.message);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setError(err.response?.data?.error || 'Gagal merubah password.'); }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-xl">
      <h1 className="text-2xl font-extrabold mb-6 text-gray-900 border-l-8 border-emerald-600 pl-4">Pengaturan Akun</h1>
      {message && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg mb-4 font-bold text-sm">{message}</div>}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 font-bold text-sm">{error}</div>}
      <form onSubmit={handleChangePassword} className="space-y-4">
        <Field label="Password Saat Ini" type="password" required value={form.currentPassword} onChange={v => setForm({ ...form, currentPassword: v })} />
        <Field label="Password Baru (min. 6 karakter)" type="password" required value={form.newPassword} onChange={v => setForm({ ...form, newPassword: v })} />
        <Field label="Konfirmasi Password Baru" type="password" required value={form.confirmPassword} onChange={v => setForm({ ...form, confirmPassword: v })} />
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold shadow transition">Simpan Password Baru</button>
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE MANAGER
// ══════════════════════════════════════════════════════════════════════════════
function ProfileManager() {
  const [data, setData] = useState({ name: '', description: '', logoUrl: '', headerText: '', backgroundUrl: '', headmasterName: '', headmasterPhotoUrl: '', studentCount: 0, teacherCount: 0, staffCount: 0, alumniCount: 0, achievementInt: 0, achievementNat: 0, achievementProv: 0, achievementReg: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/profile').then(res => { if (res.data.id) setData(res.data); setLoading(false); }); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try { await api.put('/profile', data); alert('Profil berhasil diperbarui!'); }
    catch (err) { alert('Gagal: ' + (err.response?.data?.error || 'Cek koneksi.')); }
  };

  if (loading) return <p className="text-center text-gray-400 animate-pulse mt-20">Memuat data...</p>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-4xl">
      <h1 className="text-2xl font-extrabold mb-8 text-gray-900 border-l-8 border-emerald-600 pl-4">Profil & Statistik Sekolah</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <Field label="Nama Sekolah / Website" value={data.name || ''} onChange={v => setData({ ...data, name: v })} />

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 space-y-4">
          <h3 className="font-bold text-emerald-800">Tampilan Halaman Beranda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadField label="Logo Sekolah (JPG/PNG)" value={data.logoUrl} onChange={url => setData({ ...data, logoUrl: url })} />
            <Field label="Teks Header Utama" value={data.headerText || ''} placeholder="Selamat Datang di SMAN 4" onChange={v => setData({ ...data, headerText: v })} />
          </div>
          <ImageUploadField label="Gambar Background Hero" value={data.backgroundUrl} onChange={url => setData({ ...data, backgroundUrl: url })} />
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800">Kepala Sekolah & Sambutan</h3>
          <Field label="Nama Kepala Sekolah" value={data.headmasterName || ''} placeholder="Hj. Emi Suhaemi, S.Pd" onChange={v => setData({ ...data, headmasterName: v })} />
          <ImageUploadField label="Foto Kepala Sekolah" value={data.headmasterPhotoUrl} onChange={url => setData({ ...data, headmasterPhotoUrl: url })} />
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Sambutan / Pesan Utama</label>
            <textarea className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none h-28 text-sm" value={data.description || ''} onChange={e => setData({ ...data, description: e.target.value })} />
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Statistik Warga Sekolah</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['studentCount', 'Peserta Didik'], ['teacherCount', 'Tenaga Pendidik'], ['staffCount', 'Staf Kependidikan'], ['alumniCount', 'Estimasi Alumni']].map(([k, l]) => (
              <div key={k}>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{l}</label>
                <input type="number" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-2 outline-none text-sm" value={data[k] || 0} onChange={e => setData({ ...data, [k]: Number(e.target.value) })} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Statistik Prestasi</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['achievementInt', 'Internasional'], ['achievementNat', 'Nasional'], ['achievementProv', 'Provinsi'], ['achievementReg', 'Regional/Kota']].map(([k, l]) => (
              <div key={k}>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{l}</label>
                <input type="number" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-2 outline-none text-sm" value={data[k] || 0} onChange={e => setData({ ...data, [k]: Number(e.target.value) })} />
              </div>
            ))}
          </div>
        </div>

        <button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold shadow transition">Simpan Perubahan</button>
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGES MANAGER (Visi Misi, Organisasi)
// ══════════════════════════════════════════════════════════════════════════════
function PagesManager() {
  const [data, setData] = useState({ vision: '', mission: '', motto: '', orgStructureUrl: '', orgDesc: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/profile').then(res => { if (res.data.id) setData(res.data); setLoading(false); }); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try { await api.put('/profile', data); alert('Konten halaman berhasil diperbarui!'); }
    catch { alert('Gagal menyimpan.'); }
  };

  if (loading) return <p className="text-center text-gray-400 animate-pulse mt-20">Memuat konten...</p>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-4xl">
      <h1 className="text-2xl font-extrabold mb-8 text-gray-900 border-l-8 border-emerald-600 pl-4">Halaman "Tentang Kami"</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-emerald-800 border-b pb-2">Visi, Misi & Motto</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Visi Sekolah</label>
            <textarea className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 h-20 text-sm" value={data.vision || ''} onChange={e => setData({ ...data, vision: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Misi Sekolah (pisahkan dengan Enter)</label>
            <textarea className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 h-28 text-sm" value={data.mission || ''} onChange={e => setData({ ...data, mission: e.target.value })} />
          </div>
          <Field label="Motto" value={data.motto || ''} onChange={v => setData({ ...data, motto: v })} />
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-emerald-800 border-b pb-2">Struktur Organisasi</h3>
          <ImageUploadField label="Upload Gambar Bagan" value={data.orgStructureUrl} onChange={url => setData({ ...data, orgStructureUrl: url })} />
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Singkat</label>
            <textarea className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 h-20 text-sm" value={data.orgDesc || ''} onChange={e => setData({ ...data, orgDesc: e.target.value })} />
          </div>
        </div>
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold shadow transition">Simpan Pembaruan</button>
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SEJARAH MANAGER
// ══════════════════════════════════════════════════════════════════════════════
function SejarahManager() {
  const [data, setData] = useState({ historyText: '', historyImageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/profile').then(res => { if (res.data.id) setData(res.data); setLoading(false); }); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try { await api.put('/profile', data); alert('Sejarah berhasil diperbarui!'); }
    catch { alert('Gagal menyimpan.'); }
  };

  if (loading) return <p className="text-center text-gray-400 animate-pulse mt-20">Memuat data...</p>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-4xl">
      <h1 className="text-2xl font-extrabold mb-8 text-gray-900 border-l-8 border-emerald-600 pl-4">Sejarah Sekolah</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <ImageUploadField label="Foto Utama Sejarah" value={data.historyImageUrl} onChange={url => setData({ ...data, historyImageUrl: url })} />
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten Sejarah</label>
          <div className="border rounded-lg overflow-hidden">
            <ReactQuill theme="snow" value={data.historyText || ''} onChange={val => setData({ ...data, historyText: val })} modules={quillModules} className="h-72 pb-12" />
          </div>
        </div>
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold shadow transition">Simpan Sejarah</button>
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NEWS MANAGER (CRUD + Modal + Rich Text)
// ══════════════════════════════════════════════════════════════════════════════
function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { title: '', content: '', imageUrl: '', author: '' };
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/news').then(res => { setNews(res.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ title: item.title, content: item.content, imageUrl: item.imageUrl || '', author: item.author || '' }); setEditing(item.id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/news/${editing}`, form);
      else await api.post('/news', form);
      closeModal(); load();
    } catch (err) { alert('Gagal menyimpan: ' + (err.response?.data?.error || err.message)); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus berita "${title}"?`)) return;
    await api.delete(`/news/${id}`); load();
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Kelola Berita</h1>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2">
          <span className="text-lg">+</span> Tambah Berita
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {loading ? <p className="text-center text-gray-400 p-8">Memuat...</p> : news.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-3">📰</div><p className="text-slate-400">Belum ada berita. Klik "+ Tambah Berita".</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs w-1/2">Judul</th>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs">Tanggal</th>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs">Penulis</th>
                <th className="p-4 text-center font-bold text-slate-600 uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border" />}
                      <span className="font-semibold text-slate-800 line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{new Date(item.publishedAt).toLocaleDateString('id-ID')}</td>
                  <td className="p-4 text-slate-500">{item.author || '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <ActionBtn color="green" onClick={() => openEdit(item)}>✏️ Edit</ActionBtn>
                      <ActionBtn color="red" onClick={() => handleDelete(item.id, item.title)}>🗑️ Hapus</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Berita' : 'Tambah Berita Baru'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Judul Berita" required value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Masukkan judul berita..." />
            <Field label="Penulis / Author" value={form.author} onChange={v => setForm({ ...form, author: v })} placeholder="Nama penulis..." />
            <ImageUploadField label="Foto Utama Berita" value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten Berita *</label>
              <div className="border rounded-lg overflow-hidden">
                <ReactQuill theme="snow" value={form.content} onChange={val => setForm({ ...form, content: val })} modules={quillModules} className="h-64 pb-12" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">Batal</button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow transition">{editing ? 'Simpan Perubahan' : 'Publikasikan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT MANAGER (CRUD + Modal + Rich Text)
// ══════════════════════════════════════════════════════════════════════════════
function AchievementManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { title: '', description: '', imageUrl: '', level: 'Nasional', date: '' };
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/achievements').then(res => { setData(res.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setModal(true); };
  const openEdit = (item) => {
    setForm({ title: item.title, description: item.description || '', imageUrl: item.imageUrl || '', level: item.level || 'Nasional', date: item.date ? new Date(item.date).toISOString().split('T')[0] : '' });
    setEditing(item.id); setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/achievements/${editing}`, form);
      else await api.post('/achievements', form);
      closeModal(); load();
    } catch (err) { alert('Gagal menyimpan.'); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus prestasi "${title}"?`)) return;
    await api.delete(`/achievements/${id}`); load();
  };

  const levelColors = { Internasional: 'text-purple-700 bg-purple-50', Nasional: 'text-amber-700 bg-amber-50', Provinsi: 'text-blue-700 bg-blue-50', 'Kota/Kab': 'text-emerald-700 bg-emerald-50' };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Kelola Prestasi</h1>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2">
          <span className="text-lg">+</span> Tambah Prestasi
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {loading ? <p className="text-center text-gray-400 p-8">Memuat...</p> : data.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-3">🏆</div><p className="text-slate-400">Belum ada prestasi.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs w-1/2">Judul Prestasi</th>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs">Level</th>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs">Tanggal</th>
                <th className="p-4 text-center font-bold text-slate-600 uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border" />
                        : <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🏆</div>}
                      <span className="font-semibold text-slate-800 line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${levelColors[item.level] || 'text-slate-600 bg-slate-50'}`}>{item.level}</span></td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <ActionBtn color="green" onClick={() => openEdit(item)}>✏️ Edit</ActionBtn>
                      <ActionBtn color="red" onClick={() => handleDelete(item.id, item.title)}>🗑️ Hapus</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Prestasi' : 'Tambah Prestasi Baru'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Judul Prestasi" required value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Juara 1 Olimpiade Matematika..." />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tanggal" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tingkat / Level</label>
                <select className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none text-sm" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                  {['Kota/Kab', 'Provinsi', 'Nasional', 'Internasional'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <ImageUploadField label="Foto Dokumentasi Prestasi" value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Detail</label>
              <div className="border rounded-lg overflow-hidden">
                <ReactQuill theme="snow" value={form.description} onChange={val => setForm({ ...form, description: val })} modules={quillModules} className="h-48 pb-12" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">Batal</button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow transition">{editing ? 'Simpan Perubahan' : 'Simpan Prestasi'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYANAN MANAGER (CRUD + Modal + Rich Text)
// ══════════════════════════════════════════════════════════════════════════════
function LayananManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { title: '', description: '', iconUrl: '' };
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/services').then(res => { setData(res.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ title: item.title, description: item.description || '', iconUrl: item.iconUrl || '' }); setEditing(item.id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/services/${editing}`, form);
      else await api.post('/services', form);
      closeModal(); load();
    } catch { alert('Gagal menyimpan.'); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus layanan "${title}"?`)) return;
    await api.delete(`/services/${id}`); load();
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Kelola Layanan</h1>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2">
          <span className="text-lg">+</span> Tambah Layanan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {loading ? <p className="text-center text-gray-400 p-8">Memuat...</p> : data.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-3">🏫</div><p className="text-slate-400">Belum ada layanan. Klik "+ Tambah Layanan".</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs w-2/3">Nama Layanan</th>
                <th className="p-4 text-center font-bold text-slate-600 uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description ? item.description.replace(/<[^>]+>/g, '') : '-'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <ActionBtn color="green" onClick={() => openEdit(item)}>✏️ Edit</ActionBtn>
                      <ActionBtn color="red" onClick={() => handleDelete(item.id, item.title)}>🗑️ Hapus</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Layanan' : 'Tambah Layanan Baru'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nama Layanan" required value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Perpustakaan Digital..." />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Layanan</label>
              <div className="border rounded-lg overflow-hidden">
                <ReactQuill theme="snow" value={form.description} onChange={val => setForm({ ...form, description: val })} modules={quillModules} className="h-52 pb-12" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">Batal</button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow transition">{editing ? 'Simpan Perubahan' : 'Simpan Layanan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIKASI MANAGER (CRUD + Modal)
// ══════════════════════════════════════════════════════════════════════════════
function PublikasiManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { title: '', fileUrl: '' };
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/publications').then(res => { setData(res.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ title: item.title, fileUrl: item.fileUrl || '' }); setEditing(item.id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/publications/${editing}`, form);
      else await api.post('/publications', form);
      closeModal(); load();
    } catch { alert('Gagal menyimpan.'); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus publikasi "${title}"?`)) return;
    await api.delete(`/publications/${id}`); load();
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Kelola Publikasi</h1>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2">
          <span className="text-lg">+</span> Tambah Dokumen
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {loading ? <p className="text-center text-gray-400 p-8">Memuat...</p> : data.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-3">📄</div><p className="text-slate-400">Belum ada dokumen publikasi.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs w-1/2">Judul Dokumen</th>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs">Tanggal</th>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs">Link File</th>
                <th className="p-4 text-center font-bold text-slate-600 uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-slate-800">{item.title}</td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{new Date(item.publishedAt).toLocaleDateString('id-ID')}</td>
                  <td className="p-4">
                    {item.fileUrl ? (
                      <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline text-xs font-mono line-clamp-1 max-w-[150px] block">
                        {item.fileUrl.startsWith('/uploads') ? '📎 File Lokal' : '🔗 Link Eksternal'}
                      </a>
                    ) : <span className="text-slate-400 text-xs">-</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <ActionBtn color="green" onClick={() => openEdit(item)}>✏️ Edit</ActionBtn>
                      <ActionBtn color="red" onClick={() => handleDelete(item.id, item.title)}>🗑️ Hapus</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Dokumen' : 'Tambah Dokumen Publikasi'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Judul Dokumen" required value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Kalender Akademik 2025/2026..." />
            <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Upload File (PDF/DOC/Gambar)</label>
                <input type="file" className="w-full border-2 border-slate-200 rounded-lg p-2 text-sm bg-white cursor-pointer"
                  onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if (url) setForm({ ...form, fileUrl: url }); } }} />
              </div>
              <div className="text-center text-xs font-bold text-slate-400">— ATAU —</div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Link Google Drive / URL</label>
                <input type="url" placeholder="https://drive.google.com/..." className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 text-sm outline-none" value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} />
              </div>
            </div>
            {form.fileUrl && <p className="text-xs text-emerald-600 font-mono bg-emerald-50 p-2 rounded">✓ File: {form.fileUrl.substring(0, 60)}...</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">Batal</button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow transition">{editing ? 'Simpan Perubahan' : 'Simpan Dokumen'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PIMPINAN MANAGER (CRUD + Modal — sudah ada, dipertahankan)
// ══════════════════════════════════════════════════════════════════════════════
function PimpinanManager() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { name: '', position: '', bio: '', imageUrl: '', category: 'Pimpinan' };
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/staff').then(res => setData(res.data.filter(i => i.category === 'Pimpinan')));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ name: item.name, position: item.position, bio: item.bio || '', imageUrl: item.imageUrl || '', category: 'Pimpinan' }); setEditing(item.id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/staff/${editing}`, form);
      else await api.post('/staff', form);
      closeModal(); load();
    } catch { alert('Gagal menyimpan.'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus data pimpinan "${name}"?`)) return;
    await api.delete(`/staff/${id}`); load();
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Jajaran Pimpinan</h1>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2">
          <span className="text-lg">+</span> Tambah Data
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {data.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-3">👤</div><p className="text-slate-400">Belum ada data pimpinan.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-center font-bold text-slate-600 uppercase text-xs w-16">Foto</th>
                <th className="p-4 text-left font-bold text-slate-600 uppercase text-xs">Nama & Jabatan</th>
                <th className="p-4 text-center font-bold text-slate-600 uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-center">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-emerald-100" />
                      : <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mx-auto">👤</div>}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-emerald-600 font-bold">{item.position}</p>
                    {item.bio && <p className="text-xs text-slate-400 mt-0.5">{item.bio}</p>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <ActionBtn color="green" onClick={() => openEdit(item)}>✏️ Edit</ActionBtn>
                      <ActionBtn color="red" onClick={() => handleDelete(item.id, item.name)}>🗑️ Hapus</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Data Pimpinan' : 'Tambah Data Pimpinan'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nama Lengkap (beserta Gelar)" required value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="ALIF RIFA'I, S.S" />
            <Field label="Jabatan / Posisi" required value={form.position} onChange={v => setForm({ ...form, position: v })} placeholder="WAKA KESISWAAN" />
            <Field label="Informasi Tambahan (NIP/NIG)" value={form.bio} onChange={v => setForm({ ...form, bio: v })} placeholder="NIP : 198102212007101001" />
            <ImageUploadField label="Foto (JPG/PNG)" value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">Batal</button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow transition">{editing ? 'Simpan Pembaruan' : 'Simpan Pimpinan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
