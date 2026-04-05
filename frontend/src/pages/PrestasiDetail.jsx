import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiAward } from 'react-icons/fi';

const api = axios.create({ baseURL: '/api' });

export default function PrestasiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/achievements/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Prestasi tidak ditemukan:", err);
        navigate('/prestasi'); // Redirect if not found
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen pt-40 flex justify-center items-center font-bold text-gray-500 bg-slate-50">
      <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-16 h-16 border-t-4 border-emerald-600 border-solid rounded-full" />
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white text-slate-500 hover:text-emerald-600 rounded-full shadow-sm hover:shadow transition-all group">
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-sm font-semibold text-slate-500 flex gap-2 items-center">
            <Link to="/" className="hover:text-emerald-600 transition">Beranda</Link>
            <span>/</span>
            <Link to="/prestasi" className="hover:text-emerald-600 transition">Prestasi</Link>
            <span>/</span>
            <span className="text-emerald-600">Detail</span>
          </div>
        </div>

        {/* Presentation Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_15px_40px_rgb(0,0,0,0.05)] border border-slate-100 flex flex-col items-center text-center">
          
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-100 to-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <FiAward className="text-amber-500" size={36} />
          </div>

          <div className="inline-block px-4 py-1 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-full mb-4 border border-slate-200">
            Tingkat {data.level || 'Regional'}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4 max-w-3xl">
            {data.title}
          </h1>

          <div className="flex items-center gap-2 text-slate-500 font-mono text-sm mb-10">
            <FiCalendar className="text-emerald-500" size={16} />
            {data.date ? new Date(data.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal tidak spesifik'}
          </div>

          {/* Hero Image */}
          {data.imageUrl && (
            <div className="w-full max-w-2xl mx-auto mt-2 mb-10 rounded-2xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200/50">
              <img src={data.imageUrl} alt={data.title} className="w-full h-auto max-h-[400px] object-cover hover:scale-105 transition duration-700" />
            </div>
          )}

          {/* Details */}
          {data.description && (
            <div className="w-full max-w-3xl text-left bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100/50">
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4 border-b border-emerald-200/50 pb-2 inline-block">
                Deskripsi Prestasi
              </h3>
              <div className="prose prose-emerald max-w-none text-slate-700 text-lg">
                 <div dangerouslySetInnerHTML={{ __html: data.description }} className="rich-text-content" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      <style>{`
         .rich-text-content p { margin-bottom: 1.5em; line-height: 1.8; color: #334155; }
         .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 { font-weight: 800; color: #0f172a; margin-top: 1.5em; margin-bottom: 0.5em; }
         .rich-text-content ul, .rich-text-content ol { padding-left: 1.5em; margin-bottom: 1.5em; list-style-position: outside; }
         .rich-text-content ul { list-style-type: disc; }
         .rich-text-content ol { list-style-type: decimal; }
      `}</style>
    </div>
  );
}
