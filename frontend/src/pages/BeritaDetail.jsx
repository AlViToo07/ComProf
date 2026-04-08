import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const api = axios.create({ baseURL: '/api' });

export default function BeritaDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNews = async () => {
      try {
        const res = await api.get(`/news/slug/${slug}`);
        setNews(res.data);
        // Ambil berita lain untuk "Berita Terkait"
        const allRes = await api.get('/news');
        setRelated(allRes.data.filter(n => n.slug !== slug).slice(0, 3));
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-40 flex justify-center items-center bg-slate-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
        className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen pt-40 flex flex-col justify-center items-center bg-slate-50 text-center px-4">
      <div className="text-7xl mb-6">📰</div>
      <h1 className="text-3xl font-black text-slate-800 mb-4">Berita Tidak Ditemukan</h1>
      <p className="text-slate-500 mb-8">Berita yang Anda cari tidak ada atau telah dihapus.</p>
      <Link to="/info-publikasi" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
        Kembali ke Info & Publikasi
      </Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Image */}
      <div className="relative w-full h-[55vh] bg-slate-900">
        {news.imageUrl ? (
          <img src={news.imageUrl} alt={news.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="relative z-10 h-full flex items-end max-w-4xl mx-auto px-4 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-emerald-300 hover:text-white font-bold text-sm transition">
                ← Kembali
              </button>
              <span className="text-slate-500">|</span>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full">
                Berita
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg max-w-3xl">
              {news.title}
            </h1>
            <div className="flex items-center gap-6 mt-5 text-sm text-slate-400">
              {news.author && (
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    {news.author.charAt(0).toUpperCase()}
                  </span>
                  {news.author}
                </span>
              )}
              <span>📅 {new Date(news.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div
            className="bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-slate-100 p-8 md:p-14 prose prose-emerald prose-lg max-w-none
              prose-headings:text-slate-900 prose-headings:font-black
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-a:text-emerald-600 prose-a:font-semibold
              prose-strong:text-slate-800
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:rounded-lg prose-blockquote:py-1"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </motion.div>

        {/* Divider */}
        <div className="my-16 border-t border-slate-200" />

        {/* Related News */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h2 className="text-2xl font-black text-slate-900 mb-8">Berita Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(item => (
                <Link key={item.id} to={`/berita/${item.slug || item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                  <div className="h-40 bg-slate-100 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-4xl">📰</div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-400 font-mono mb-2">
                      {new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-12 flex justify-center">
          <Link to="/info-publikasi"
            className="flex items-center gap-2 px-8 py-3 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold rounded-full transition-all duration-300">
            ← Semua Berita & Publikasi
          </Link>
        </div>
      </div>
    </div>
  );
}
