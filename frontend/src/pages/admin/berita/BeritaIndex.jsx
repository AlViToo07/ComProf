import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiCalendar, FiFileText } from 'react-icons/fi';
import api from '../utils/api';

export default function BeritaIndex() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news');
      setNews(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Yakin ingin menghapus berita "${title}" secara permanen?`)) {
      await api.delete(`/news/${id}`);
      loadNews();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 border-l-8 border-emerald-600 pl-4">
            Kelola Berita
          </h1>
          <p className="text-gray-500 text-sm mt-1 pl-6">Daftar semua berita & pengumuman yang dipublikasikan</p>
        </div>
        <Link
          to="/admin/berita/create"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition flex items-center gap-2 self-start"
        >
          <FiPlus size={18} />
          Tulis Berita Baru
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="text-center font-bold text-gray-400 py-16 animate-pulse">Memuat data berita...</p>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <FiFileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 italic text-lg">Belum ada berita dibuat.</p>
            <Link to="/admin/berita/create" className="text-emerald-600 font-bold hover:underline mt-2 inline-block">
              + Tulis berita pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-slate-50 border-b-2 border-emerald-500">
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-12">No</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-20">Gambar</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs">Judul</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs w-32">Tanggal</th>
                  <th className="p-4 font-bold text-gray-700 uppercase text-xs text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item, idx) => (
                  <tr key={item.id} className="border-b bg-white hover:bg-emerald-50/50 transition group">
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
                      <p className="font-bold text-gray-800 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-1">{item.content?.replace(/<[^>]*>/g, '')?.substring(0, 80)}...</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-emerald-600 font-mono flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/berita/edit/${item.id}`}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2.5 rounded-lg transition"
                          title="Edit Berita"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2.5 rounded-lg transition"
                          title="Hapus Berita"
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


