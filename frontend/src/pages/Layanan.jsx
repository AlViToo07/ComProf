import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/pagination';

const api = axios.create({ baseURL: '/api' });

export default function Layanan() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(res => {
        setServices(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setServices([]);
        setLoading(false);
      });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  if(loading) return (
    <div className="min-h-screen pt-40 flex justify-center items-center bg-slate-50">
      <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-16 h-16 border-t-4 border-emerald-600 border-solid rounded-full" />
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Header Section */}
      <section className="text-center mb-16 relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-emerald-200/40 rounded-full blur-[100px] -z-10"></div>
         <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto px-4 pt-16">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Pendidikan</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Fasilitas penunjang terpadu untuk memberikan pengalaman belajar terbaik bagi peserta didik di SMAN 4 Kota Bogor.
            </p>
         </motion.div>
      </section>

      {/* Services Carousel Area */}
      <section className="max-w-7xl mx-auto px-4 relative z-20 pb-20">
         <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative">
            <Swiper
               modules={[Pagination, Autoplay]}
               spaceBetween={30}
               slidesPerView={1}
               breakpoints={{
                 640: { slidesPerView: 1 },
                 768: { slidesPerView: 2 },
                 1024: { slidesPerView: 3 },
               }}
               pagination={{ clickable: true, dynamicBullets: true }}
               autoplay={{ delay: 3500, disableOnInteraction: true }}
               className="pb-16 px-4 -mx-4 services-carousel"
            >
               {services.map((i, idx) => (
                  <SwiperSlide key={i.id || idx} className="h-auto">
                     <motion.div 
                       variants={fadeInUp} 
                       className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-2xl border border-slate-100 hover:border-emerald-200 transition-all duration-500 h-full flex flex-col group relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm relative z-10">
                           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="text-2xl font-black mb-4 text-slate-800 leading-snug group-hover:text-emerald-700 transition relative z-10">
                           {i.id ? (
                              <Link to={`/layanan/${i.id}`} className="hover:underline">
                                 {i.title}
                              </Link>
                           ) : (
                              i.title
                           )}
                        </h3>
                        <p className="text-slate-500 leading-relaxed text-sm flex-grow mb-8 relative z-10 line-clamp-4">
                           {/* Strip HTML tags from description for preview */}
                           {i.description ? i.description.replace(/<[^>]+>/g, '') : ''}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
                           {i.id ? (
                              <Link to={`/layanan/${i.id}`} className="text-emerald-600 font-bold text-sm tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
                                 Jelajahi <span className="text-lg">→</span>
                              </Link>
                           ) : (
                              <button className="text-emerald-600 font-bold text-sm tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
                                 Jelajahi <span className="text-lg">→</span>
                              </button>
                           )}
                        </div>
                     </motion.div>
                  </SwiperSlide>
               ))}
            </Swiper>
         </motion.div>
      </section>

      {/* Decorative Interactive Background Section */}
      <section className="bg-emerald-900 py-24 w-full relative overflow-hidden mb-10">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black text-white mb-6">Butuh Bantuan Lebih Lanjut?</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-emerald-100 text-lg mb-10">Tim Tata Usaha SMAN 4 Kota Bogor siap membantu melayani segala kebutuhan administratif dan layanan pendidikan Anda.</motion.p>
            <motion.button initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="px-8 py-4 bg-white text-emerald-800 font-extrabold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
               Hubungi Kami Sekarang
            </motion.button>
         </div>
      </section>

      <style>{`
        .services-carousel .swiper-pagination-bullet { background: #10b981; opacity: 0.4; width: 10px; height: 10px; }
        .services-carousel .swiper-pagination-bullet-active { background: #059669; opacity: 1; border-radius: 10px; width: 24px; }
      `}</style>
    </div>
  );
}
