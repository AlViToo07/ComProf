import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const api = axios.create({ baseURL: '/api' });

export default function Sejarah() {
   const [data, setData] = useState({});
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      api.get('/profile').then(res => {
         setData(res.data);
         setLoading(false);
      });
   }, []);

   if (loading) return (
      <div className="min-h-screen pt-40 flex justify-center items-center">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full"></motion.div>
      </div>
   );

   return (
      <div className="bg-slate-50 font-sans pb-24 overflow-x-hidden">

         {/* 1. Elegant Hero Banner */}
         <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-emerald-900 overflow-hidden flex items-center justify-center">
            {/* Decorative Blur Backgrounds */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <span className="inline-block py-1 px-4 rounded-full bg-emerald-800 border border-emerald-600 text-emerald-200 text-sm font-bold tracking-widest uppercase mb-6 shadow-xl">
                     Kilas Balik {data.name || 'SMAN 4 Bogor'}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-md">
                     Sejarah Sekolah
                  </h1>
                  <p className="text-emerald-100 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                     Sebuah perjalanan panjang merajut mimpi, mendidik karakter, dan melahirkan generasi-generasi emas bangsa.
                  </p>
               </motion.div>
            </div>
         </div>

         {/* 2. Main Body (Image & Story) */}
         <div className="max-w-6xl mx-auto px-4 -mt-16 md:-mt-24 relative z-20">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-12 lg:p-16 border border-slate-100/50 w-full overflow-hidden shrink-0"
            >

               {/* Split Layout for Desktop using Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start w-full">

                  {/* Left: Sticky Image Gallery Column */}
                  <div className="lg:col-span-5 lg:sticky top-32 w-full">
                     {data.historyImageUrl ? (
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] group w-full">
                           <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition duration-500 z-10 w-full"></div>
                           <img
                              src={data.historyImageUrl}
                              alt="Sejarah Sekolah"
                              className="w-full h-auto aspect-[4/5] object-cover transform scale-100 group-hover:scale-105 transition duration-700 ease-out"
                           />
                           <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                              <p className="text-white font-bold text-lg">Gedung Kenangan</p>
                              <p className="text-emerald-300 text-sm font-medium tracking-wide">Arsip Sejarah Utama</p>
                           </div>
                        </div>
                     ) : (
                        <div className="w-full aspect-square bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                           <p className="text-slate-400 font-medium">Belum Ada Gambar Utama</p>
                        </div>
                     )}
                  </div>

                  {/* Right: Rich Text Story Content */}
                  <div className="lg:col-span-7 w-full min-w-0">
                     {data.historyText ? (
                        <div
                           className="prose prose-emerald lg:prose-lg max-w-none text-slate-700 prose-headings:text-emerald-900 marker:text-emerald-600 prose-img:rounded-2xl prose-a:text-emerald-600 w-full overflow-hidden break-words [&_*]:!whitespace-pre-wrap [&_*]:!break-words"
                           dangerouslySetInnerHTML={{ __html: data.historyText }}
                        />
                     ) : (
                        <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 w-full px-4">
                           <span className="text-6xl text-slate-300 mb-4">📜</span>
                           <h3 className="text-xl font-bold text-slate-400 mb-2">Sejarah Belum Tersedia</h3>
                           <p className="text-slate-400 max-w-sm">Hubungi administrator untuk mengisi konten riwayat dan sejarah sekolah di halaman panel admin.</p>
                        </div>
                     )}

                     {/* Closing signature or divider */}
                     {data.historyText && (
                        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between w-full">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex shadow-sm items-center justify-center shrink-0">
                                 <span className="text-emerald-600 font-bold">SM</span>
                              </div>
                              <div className="min-w-0">
                                 <p className="text-sm font-bold text-slate-800 uppercase tracking-widest truncate">Admin {data.name || 'SMAN 4'}</p>
                                 <p className="text-xs text-slate-500 truncate">Tim Hubungan Masyarakat</p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

               </div>
            </motion.div>
         </div>

      </div>
   );
}
