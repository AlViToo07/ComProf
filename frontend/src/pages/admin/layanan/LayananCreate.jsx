import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import api from '../utils/api';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function LayananCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', iconUrl: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/services', form);
      alert('Layanan berhasil ditambahkan!');
      navigate('/admin/layanan');
    } catch (err) { alert('Gagal menyimpan.'); }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/layanan" className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition"><FiArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Tambah Layanan Baru</h1>
          <p className="text-gray-500 text-sm mt-1 pl-6">Tambah layanan sekolah</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Layanan <span className="text-red-500">*</span></label>
            <input required placeholder="Cth: Perpustakaan Digital" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none font-bold transition" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi <span className="text-red-500">*</span></label>
            <div className="bg-white rounded-lg overflow-hidden border">
              <ReactQuill theme="snow" value={form.description || ''} onChange={val => setForm({ ...form, description: val })} modules={modules} className="h-32 pb-12" placeholder="Deskripsi singkat layanan..." />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2">
              <FiSave size={16} />{saving ? 'Menyimpan...' : 'Simpan Layanan'}
            </button>
            <Link to="/admin/layanan" className="px-8 py-3 rounded-lg font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
