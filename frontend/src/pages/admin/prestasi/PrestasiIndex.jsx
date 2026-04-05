import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiCalendar, FiAward } from 'react-icons/fi';
import api from '../utils/api';

export default function PrestasiIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await api.get('/achievements');
    setData(res.data);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus data prestasi "${title}"?`)) {
      await api.delete(`/achievements/${id}`);
      loadData();
    }
  };

  const levelColor = (level) => {
    const map = {
      'Internasional': 'bg-purple-100 text-purple-700',
      'Nasional': 'bg-blue-100 text-blue-700',
      'Provinsi': 'bg-amber-100 text-amber-700',
      'Kota / Regional': 'bg-emerald-100 text-emerald-700',
    };
    return map[level] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">Kelola Prestasi</h1>
          <p className="text-gray-500 text-sm mt-1 pl-6">Database prestasi siswa & sekolah</p>
        </div>
        <Link
          to="/admin/prestasi/create"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition flex items-center gap-2 self-start"
        >
          <FiPlus size={18} />
          Tambah Prestasi
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="text-center font-bold text-gray-400 py-16 animate-pulse">Memuat data prestasi...</p>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <FiAward className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 italic text-lg">Belum ada data prestasi.</p>
            <Link to="/admin/prestasi/create" className="text-emerald-600 font-bold hover:underline mt-2 inline-block">
              + Tambah prestasi pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-slate-50 border-b-2 border-emerald-500">
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-12">No</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-20">Foto</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs">Judul Prestasi</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-28">Tingkat</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-32">Tanggal</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id} className="border-b bg-white hover:bg-emerald-50/50 transition">
                    <td className="p-4 text-center text-sm font-bold text-gray-400">{idx + 1}</td>
                    <td className="p-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-12 w-16 object-cover rounded shadow-sm border" />
                      ) : (
                        <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center">
                          <FiImage className="text-gray-300" size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{item.title}</p>
                      {item.description && <p className="text-xs text-gray-400 line-clamp-1 mt-1">{item.description}</p>}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${levelColor(item.level)}`}>
                        {item.level || '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                        <FiCalendar size={12} />
                        {item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/prestasi/edit/${item.id}`}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2.5 rounded-lg transition"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2.5 rounded-lg transition"
                          title="Hapus"
                        >
                          <FiTrash2 size={15} />
                        </button>
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
