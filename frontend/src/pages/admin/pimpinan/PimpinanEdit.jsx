import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import api, { uploadImage } from '../utils/api';

export default function PimpinanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', position: '', bio: '', imageUrl: '', category: 'Pimpinan' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/staff/${id}`).then(res => {
      setForm({
        name: res.data.name || '',
        position: res.data.position || '',
        bio: res.data.bio || '',
        imageUrl: res.data.imageUrl || '',
        category: 'Pimpinan'
      });
      setLoading(false);
    }).catch(() => {
      alert('Data tidak ditemukan.');
      navigate('/admin/pimpinan');
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/staff/${id}`, form);
      alert('Data pimpinan berhasil diperbarui!');
      navigate('/admin/pimpinan');
    } catch (err) {
      alert('Gagal menyimpan.');
    }
    setSaving(false);
  };

  if (loading) return <p className="text-center font-bold text-gray-400 mt-20 animate-pulse">Memuat data...</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/pimpinan" className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition">
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Edit Data Pimpinan</h1>
          <p className="text-gray-500 text-sm mt-1 pl-6">Perbarui informasi pimpinan</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap (beserta Gelar) <span className="text-red-500">*</span></label>
            <input required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none font-bold transition" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan Posisi <span className="text-red-500">*</span></label>
            <input required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none transition" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Informasi Tambahan (NIP/NIG)</label>
            <input className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none transition" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Foto (JPG/PNG)</label>
            {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="h-32 mb-3 object-cover rounded-lg shadow border" />}
            <input type="file" accept="image/jpeg, image/png, image/jpg" className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-lg p-3 outline-none bg-slate-50 cursor-pointer" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if (url) setForm({ ...form, imageUrl: url }); } }} />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2">
              <FiSave size={16} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <Link to="/admin/pimpinan" className="px-8 py-3 rounded-lg font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
