import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const api = axios.create({ baseURL: '/api' });

export default function LayananDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [layanan, setLayanan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/services/${id}`)
      .then(res => setLayanan(res.data))
      .catch(err => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-40 flex justify-center items-center bg-slate-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
        className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full" />
    </div>
  );

  if (notFound || !layanan) return (
    <div className="min-h-screen pt-40 flex flex-col justify-center items-center bg-slate-50 text-center px-4">
      <div className="text-7xl mb-6">🏫</div>
      <h1 className="text-3xl font-black text-slate-800 mb-4">Layanan Tidak Ditemukan</h1>
      <Link to="/layanan" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
        Kembali ke Layanan
      </Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24">
      {/* Hero */}
      <div className="bg-emerald-900 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto relative z-10">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-300 hover:text-white font-bold text-sm mb-8 transition">
            ← Kembali ke Layanan
          </button>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">{layanan.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-14">
            {layanan.description ? (
              <div
                className="prose prose-emerald prose-lg max-w-none
                  prose-headings:text-slate-900 prose-headings:font-black
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-a:text-emerald-600 prose-strong:text-slate-800
                  prose-ul:text-slate-600 prose-ol:text-slate-600"
                dangerouslySetInnerHTML={{ __html: layanan.description }}
              />
            ) : (
              <p className="text-slate-500 text-center py-12 italic">Detail layanan belum tersedia.</p>
            )}

            <div className="mt-12 pt-6 border-t border-slate-100 flex justify-center">
              <Link to="/layanan"
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all">
                ← Semua Layanan
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
