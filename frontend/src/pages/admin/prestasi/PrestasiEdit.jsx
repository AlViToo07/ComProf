import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import api, { uploadImage } from '../utils/api';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function PrestasiEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', level: 'Nasional', date: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // React Quill Modules for Toolbar
  const modules = {
     toolbar: [
       [{ 'header': [1, 2, 3, false] }],
       ['bold', 'italic', 'underline', 'strike'],
       [{'list': 'ordered'}, {'list': 'bullet'}],
       ['clean']
     ],
  };

  useEffect(() => {
    api.get(`/achievements/${id}`).then(res => {
      setForm({
        title: res.data.title || '',
        description: res.data.description || '',
        level: res.data.level || 'Nasional',
        date: res.data.date ? new Date(res.data.date).toISOString().split('T')[0] : '',
        imageUrl: res.data.imageUrl || ''
      });
      setLoading(false);
    }).catch(() => {
      alert('Data tidak ditemukan.');
      navigate('/admin/prestasi');
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/achievements/${id}`, { ...form, date: form.date ? new Date(form.date) : undefined });
      alert('Prestasi berhasil diperbarui!');
      navigate('/admin/prestasi');
    } catch (err) {
      alert('Gagal menyimpan perubahan.');
    }
    setSaving(false);
  };

  if (loading) return <p className="text-center font-bold text-gray-400 mt-20 animate-pulse">Memuat data...</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/prestasi" className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition">
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Edit Prestasi</h1>
          <p className="text-gray-500 text-sm mt-1 pl-6">Perbarui data prestasi</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Prestasi <span className="text-red-500">*</span></label>
            <input required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none font-bold transition" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi (Opsional)</label>
            <div className="bg-white rounded-lg overflow-hidden border">
              <ReactQuill theme="snow" value={form.description || ''} onChange={val => setForm({ ...form, description: val })} modules={modules} className="h-32 pb-12" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Prestasi</label>
              <input type="date" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tingkat / Kategori</label>
              <select className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option>Internasional</option>
                <option>Nasional</option>
                <option>Provinsi</option>
                <option>Kota / Regional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dokumentasi Foto (JPG/PNG)</label>
            {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="h-32 mb-3 object-cover rounded-lg shadow border" />}
            <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none bg-slate-50 cursor-pointer" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if (url) setForm({ ...form, imageUrl: url }); } }} />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2">
              <FiSave size={16} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <Link to="/admin/prestasi" className="px-8 py-3 rounded-lg font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
