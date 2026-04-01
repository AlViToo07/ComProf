import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const api = axios.create({ baseURL: '/api' });

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    api.get('/achievements').then(res => {
      if (res.data && res.data.length > 0) {
        setAchievements(res.data);
      } else {
        // Fallback placeholder data
        setAchievements([
          { id: 1, title: 'Juara 1 Lomba Web Design', date: '2026-05-12T00:00:00.000Z', level: 'Nasional', desc: 'Siswa kelas XII memenangkan kompetisi membuat website interaktif.' },
          { id: 2, title: 'Medali Emas Olimpiade Fisika', date: '2026-03-20T00:00:00.000Z', level: 'Provinsi', desc: 'Meraih medali emas dengan skor tertinggi di tingkat provinsi Jawa Barat.' },
          { id: 3, title: 'Juara Umum Paskibraka', date: '2026-02-15T00:00:00.000Z', level: 'Kota/Kab', desc: 'Tim Paskibra SMAN 4 Bogor kembali membawa piala bergilir juara umum.' },
          { id: 4, title: 'Juara 2 Debat Bahasa Inggris', date: '2025-11-10T00:00:00.000Z', level: 'Nasional', desc: 'Berhasil melaju ke tahap final tingkat nasional mewakili regional.' },
          { id: 5, title: 'Best Delegation Model United Nations', date: '2025-09-05T00:00:00.000Z', level: 'Internasional', desc: 'Delegasi MUN sekolah meraih predikat terbaik di forum simulasi PBB tingkat wilayah Asia.' },
        ]);
      }
      setLoading(false);
    }).catch(() => {
       setAchievements([
          { id: 1, title: 'Juara 1 Lomba Web Design', date: '2026-05-12T00:00:00.000Z', level: 'Nasional', desc: 'Siswa kelas XII memenangkan kompetisi membuat website interaktif.' },
          { id: 2, title: 'Medali Emas Olimpiade Fisika', date: '2026-03-20T00:00:00.000Z', level: 'Provinsi', desc: 'Meraih medali emas dengan skor tertinggi di tingkat provinsi Jawa Barat.' }
       ]);
       setLoading(false);
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const filteredAchievements = filter === 'Semua' ? achievements : achievements.filter(a => a.level === filter);
  const levels = ['Semua', 'Kota/Kab', 'Provinsi', 'Nasional', 'Internasional'];

  if(loading) return (
    <div className="min-h-screen pt-40 flex justify-center items-center bg-slate-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full" />
    </div>
  );

  return (
    <div className="pt-24 pb-24 min-h-screen bg-slate-50 font-sans overflow-hidden">
      
      <section className="relative py-20 bg-slate-900 mb-16 px-4">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-block px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold tracking-widest text-xs mb-6 backdrop-blur">
               HALL OF FAME
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Prestasi Gemilang</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
               Jejak kebanggaan dan dedikasi talenta-talenta SMAN 4 Bogor di berbagai kompetisi intelektual maupun non-akademik.
            </motion.p>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
         <div className="flex flex-wrap justify-center gap-2 mb-12">
            {levels.map(l => (
               <button 
                 key={l}
                 onClick={() => setFilter(l)}
                 className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${filter === l ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
               >
                  {l}
               </button>
            ))}
         </div>

         <motion.div 
           variants={staggerContainer} initial="hidden" animate="visible"
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
         >
            {filteredAchievements.map((ach, i) => (
               <motion.div 
                 key={ach.id || i} variants={fadeInUp}
                 className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
               >
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 rounded-full group-hover:bg-emerald-100 group-hover:scale-150 transition-all duration-700 -z-10"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                     {ach.imageUrl ? (
                        <div className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden shadow-lg shadow-emerald-500/30 group-hover:rotate-6 transition-transform">
                            <img src={ach.imageUrl} alt={ach.title} className="w-full h-full object-cover" />
                        </div>
                     ) : (
                        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30 group-hover:rotate-12 transition-transform">
                           🏆
                        </div>
                     )}
                     <span className={`px-4 py-1.5 text-xs font-bold rounded-full border ${ach.level.includes('Nasional') || ach.level.includes('Internasional') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {ach.level}
                     </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors leading-snug">{ach.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono mb-4">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                     {new Date(ach.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{ach.desc || 'Prestasi membanggakan dari siswa-siswi terbaik untuk membawa nama baik almamater di kancah ini.'}</p>
               </motion.div>
            ))}
         </motion.div>
         {filteredAchievements.length === 0 && (
            <div className="text-center py-20">
               <div className="text-5xl mb-4">🌪️</div>
               <p className="text-slate-500 text-lg">Belum ada data prestasi untuk kategori ini.</p>
            </div>
         )}
      </section>
    </div>
  );
}
