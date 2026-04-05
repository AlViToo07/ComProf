import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiLayers } from 'react-icons/fi';
import api from '../utils/api';

export default function LayananIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await api.get('/services');
    setData(res.data);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus layanan "${title}"?`)) {
      await api.delete(`/services/${id}`);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Kelola Layanan</h1>
          <p className="text-gray-500 text-sm mt-1 pl-6">Daftar layanan sekolah</p>
        </div>
        <Link to="/admin/layanan/create" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition flex items-center gap-2 self-start">
          <FiPlus size={18} />
          Tambah Layanan
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="text-center font-bold text-gray-400 py-16 animate-pulse">Memuat data...</p>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <FiLayers className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 italic text-lg">Belum ada data layanan.</p>
            <Link to="/admin/layanan/create" className="text-emerald-600 font-bold hover:underline mt-2 inline-block">+ Tambah layanan pertama</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-slate-50 border-b-2 border-emerald-500">
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-12">No</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs">Nama Layanan</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs">Deskripsi</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id} className="border-b bg-white hover:bg-emerald-50/50 transition">
                    <td className="p-4 text-center text-sm font-bold text-gray-400">{idx + 1}</td>
                    <td className="p-4"><p className="font-bold text-gray-800">{item.title}</p></td>
                    <td className="p-4"><p className="text-sm text-gray-500 line-clamp-2">{item.description || '-'}</p></td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link to={`/admin/layanan/edit/${item.id}`} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2.5 rounded-lg transition" title="Edit"><FiEdit2 size={15} /></Link>
                        <button onClick={() => handleDelete(item.id, item.title)} className="bg-red-100 hover:bg-red-200 text-red-700 p-2.5 rounded-lg transition" title="Hapus"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
