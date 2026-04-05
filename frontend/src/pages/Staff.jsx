import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

export default function Staff() {
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const fetchApi = (await import('axios')).default.create({ baseURL: '/api' });
        const res = await fetchApi.get('/staff');
        if (Array.isArray(res.data)) {
          setStaff(res.data.map(item => ({
            id: item.id,
            name: item.name,
            role: item.position,
            img: item.imageUrl || 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80'
          })));
        }
      } catch (err) {
        console.error("Failed to fetch staff", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Dynamic Header Section */}
      <section className="relative pt-16 pb-32 overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-200/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>
         
         <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full lg:w-1/2">
               <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100/50 text-emerald-700 font-bold tracking-widest text-xs uppercase mb-6 shadow-sm border border-emerald-200">
                  OUR TEAM
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                 Penggerak <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Pendidikan</span>
               </h1>
               <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
                 Masa depan pendidikan yang cerah dimulai dari tangan tenaga pendidik yang berdedikasi tinggi, berpengalaman, dan inspiratif di SMAN 4 Kota Bogor.
               </p>
               <div className="flex gap-4">
                 <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-32 border-b-4 border-b-emerald-500">
                    <p className="text-3xl font-black text-slate-800 mb-1">45+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">Pendidik</p>
                 </div>
                 <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-32 border-b-4 border-b-blue-500">
                    <p className="text-3xl font-black text-slate-800 mb-1">20+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">Staf TU</p>
                 </div>
               </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full lg:w-1/2 flex justify-center perspective-1000">
               <Swiper
                  effect={'cards'}
                  grabCursor={true}
                  modules={[EffectCards, Autoplay]}
                  autoplay={{ delay: 3000 }}
                  className="w-72 h-96 staff-cards-carousel drop-shadow-2xl"
               >
                  {staff.slice(0, 4).map((person, idx) => (
                    <SwiperSlide key={idx} className="rounded-3xl bg-white overflow-hidden border border-slate-100 cursor-pointer">
                      <img src={person.img} alt={person.name} className="w-full h-2/3 object-cover" />
                      <div className="h-1/3 bg-slate-900 p-5 flex flex-col justify-center">
                         <h3 className="font-bold text-white text-lg leading-tight mb-1 truncate">{person.name}</h3>
                         <p className="text-emerald-400 text-sm font-semibold truncate">{person.role}</p>
                      </div>
                    </SwiperSlide>
                  ))}
               </Swiper>
            </motion.div>
         </div>
      </section>

      {/* Grid Roster */}
      <section className="max-w-7xl mx-auto px-4 relative z-20">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Meet The Team</h2>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((person, i) => (
              <motion.div 
                 key={person.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white rounded-[2rem] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl border border-slate-100 group transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-32 bg-emerald-50 rounded-t-[2rem] -z-10 group-hover:h-full group-hover:bg-emerald-600 transition-all duration-500"></div>
                 
                 <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 relative group-hover:border-emerald-500 transition-colors z-10">
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
                 
                 <div className="relative z-10">
                    <h3 className="font-extrabold text-xl text-slate-800 mb-2 group-hover:text-white transition-colors">{person.name}</h3>
                    <p className="text-sm font-bold text-emerald-600 group-hover:text-emerald-100 tracking-wider uppercase transition-colors">{person.role}</p>
                 </div>
              </motion.div>
            ))}
         </div>
      </section>

      <style>{`
        .staff-cards-carousel .swiper-slide { border-radius: 24px; }
      `}</style>
    </div>
  );
}
