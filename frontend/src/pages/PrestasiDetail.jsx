import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const api = axios.create({ baseURL: '/api' });

const levelColors = {
  Internasional: 'bg-purple-100 text-purple-800 border-purple-200',
  Nasional: 'bg-amber-100 text-amber-800 border-amber-200',
  Provinsi: 'bg-blue-100 text-blue-800 border-blue-200',
  'Kota/Kab': 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function PrestasiDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const res = await api.get(`/achievements/slug/${slug}`);
        if (typeof res.data !== 'object' || res.headers['content-type']?.includes('text/html')) {
          throw new Error("Invalid API response: received HTML string.");
        }
        setAchievement(res.data);
        const allRes = await api.get('/achievements');
        setRelated(allRes.data.filter(a => a.slug !== slug).slice(0, 3));
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-40 flex justify-center items-center bg-slate-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
        className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full" />
    </div>
  );

  if (notFound || !achievement) return (
    <div className="min-h-screen pt-40 flex flex-col justify-center items-center bg-slate-50 text-center px-4">
      <div className="text-7xl mb-6">🏆</div>
      <h1 className="text-3xl font-black text-slate-800 mb-4">Prestasi Tidak Ditemukan</h1>
      <p className="text-slate-500 mb-8">Data prestasi yang Anda cari tidak ada atau telah dihapus.</p>
      <Link to="/prestasi" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
        Kembali ke Halaman Prestasi
      </Link>
    </div>
  );

  const levelColor = levelColors[achievement.level] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24">
      {/* Hero */}
      <div className="relative w-full h-[50vh] bg-slate-900 pt-20">
        {achievement.imageUrl ? (
          <img src={achievement.imageUrl} alt={achievement.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="relative z-10 h-full flex items-center justify-center flex-col text-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="text-6xl mb-4 drop-shadow-2xl">🏆</div>
            <span className={`inline-block px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase mb-4 ${levelColor}`}>
              Tingkat {achievement.level}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl drop-shadow-lg">
              {achievement.title}
            </h1>
            <p className="text-emerald-300 font-bold mt-4">
              📅 {new Date(achievement.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12">
            {/* Nav back */}
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-bold text-sm mb-8 transition">
              ← Kembali ke Prestasi
            </button>

            {/* Photo if exists */}
            {achievement.imageUrl && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
                <img src={achievement.imageUrl} alt={achievement.title}
                  className="w-full h-72 object-cover" />
              </div>
            )}

            {/* Description */}
            {achievement.description ? (
              <div
                className="prose prose-emerald prose-lg max-w-none
                  prose-headings:text-slate-900 prose-headings:font-black
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-strong:text-slate-800"
                dangerouslySetInnerHTML={{ __html: achievement.description }}
              />
            ) : (
              <p className="text-slate-500 text-center py-8 italic">Deskripsi detail belum tersedia untuk prestasi ini.</p>
            )}

            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center">
              <Link to="/prestasi"
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all">
                ← Semua Prestasi
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Related */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Prestasi Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(item => (
                <Link key={item.id} to={`/prestasi/${item.slug || item.id}`}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-3">🏆</div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${levelColors[item.level] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {item.level}
                  </span>
                  <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mt-3 line-clamp-2 leading-snug text-sm">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
