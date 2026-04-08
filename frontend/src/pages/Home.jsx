import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const api = axios.create({ baseURL: '/api' });

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [news, setNews] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, achRes, newsRes, progRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: {} })),
          api.get('/achievements').catch(() => ({ data: [] })),
          api.get('/news').catch(() => ({ data: [] })),
          api.get('/programs').catch(() => ({ data: [] }))
        ]);

        setProfile(profRes.data);
        setAchievements(achRes.data);
        setNews(newsRes.data);
        setPrograms(Array.isArray(progRes.data) ? progRes.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Default fallbacks in case DB is empty
  const schoolName = profile?.name || "";
  const schoolDesc = profile?.description || "Selamat datang di SMAN 4 Kota Bogor.";
  const students = profile?.studentCount || "0";
  const teachers = profile?.teacherCount || "0";
  const staff = profile?.staffCount !== undefined ? profile.staffCount : "0";
  const alumni = profile?.alumniCount || "0";

  const displayAchievements = achievements.length > 0 ? achievements.slice(0, 5) : [];

  const intlAchievements = profile?.achievementInt !== undefined && profile?.achievementInt !== null ? profile.achievementInt : "0";
  const natAchievements = profile?.achievementNat !== undefined && profile?.achievementNat !== null ? profile.achievementNat : "0";

  const displayNews = news.length > 0 ? news.slice(0, 5) : [];

  if (loading) return (
    <div className="min-h-screen pt-40 flex justify-center items-center font-bold text-gray-500 bg-slate-50">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-16 h-16 border-t-4 border-emerald-600 border-solid rounded-full"
      />
    </div>
  );

  const heroImages = profile?.backgroundUrl ? [profile.backgroundUrl] : [];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="w-full relative mt-20 pt-4 bg-slate-50 font-sans overflow-hidden"
    >
      {/* 1. Hero Section Carousel */}
      <section className="relative w-full h-[85vh] bg-slate-900 group">
        <Swiper
          modules={[EffectFade, Autoplay, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="w-full h-full"
        >
          {heroImages.map((img, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              <div className="absolute inset-0">
                <motion.img
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                  src={img}
                  alt="Hero Slide"
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent"></div>
              <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full h-full flex items-center text-white">
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>

                  <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight whitespace-pre-wrap max-w-4xl drop-shadow-2xl">
                    {profile?.headerText || `Membangun Generasi\nCerdas & Berkarakter\ndi ${schoolName}`}
                  </h1>
                  <p className="text-lg md:text-xl max-w-2xl font-light text-slate-200 mb-10 leading-relaxed border-l-4 border-emerald-500 pl-6">
                    SMA Negeri 4 Bogor berkomitmen menjadi sekolah unggul akademik dengan penanaman karakter kuat, moralitas, serta kepedulian sosial tinggi.
                  </p>
                  <div className="flex gap-4">
                    <Link to="/layanan" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-1">
                      Jelajahi Program
                    </Link>
                    <Link to="/tentang/sejarah" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg backdrop-blur-sm transition-all transform hover:-translate-y-1">
                      Mengenal Kami
                    </Link>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. Floating Statistics Bar */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 mb-20">
        <motion.div
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
            <div className="group hover:-translate-y-2 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-black text-emerald-700 mb-2 drop-shadow-sm">{students}</p>
              <p className="text-slate-500 text-sm font-bold tracking-wider uppercase group-hover:text-emerald-700 transition-colors">Peserta Didik</p>
            </div>
            <div className="group hover:-translate-y-2 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-black text-emerald-700 mb-2 drop-shadow-sm">{teachers}</p>
              <p className="text-slate-500 text-sm font-bold tracking-wider uppercase group-hover:text-emerald-700 transition-colors">Tenaga Pendidik</p>
            </div>
            <div className="group hover:-translate-y-2 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-black text-emerald-700 mb-2 drop-shadow-sm">{staff}</p>
              <p className="text-slate-500 text-sm font-bold tracking-wider uppercase group-hover:text-emerald-700 transition-colors">Staf Kependidikan</p>
            </div>
            <div className="group hover:-translate-y-2 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-black text-emerald-700 mb-2 drop-shadow-sm">{alumni}</p>
              <p className="text-slate-500 text-sm font-bold tracking-wider uppercase group-hover:text-emerald-700 transition-colors">Akumulasi Alumni</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Sambutan Kepala Sekolah */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center gap-16"
          >
            <div className="w-full md:w-5/12 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-300 rounded-[3rem] rotate-3 scale-105 -z-10 blur-[2px]"></div>
              <img src={profile?.headmasterPhotoUrl || "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=600&q=80"} alt="Kepala Sekolah" className="w-full max-w-sm aspect-[4/5] object-cover rounded-[2.5rem] shadow-2xl z-10" />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20">
                <p className="font-bold text-slate-800 text-lg">{profile?.headmasterName || "Hj. Emi Suhaemi, S.Pd"}</p>
                <p className="text-emerald-600 text-sm font-semibold">Kepala Sekolah</p>
              </div>
            </div>
            <div className="w-full md:w-7/12">
              <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs tracking-widest uppercase mb-4">
                Sambutan Pimpinan
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.15]">
                Membangun Generasi Emas <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Masa Depan Bangsa
                </span>
              </h2>
              <div className="text-slate-600 text-lg leading-relaxed space-y-4 text-justify relative">
                <span className="absolute -top-6 -left-8 text-8xl text-emerald-100 font-serif leading-none select-none -z-10">"</span>
                {schoolDesc.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Programs Array Carousel */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800/50"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-wide mb-4">Pioneering Programs</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Inovasi pendidikan yang disiapkan untuk menunjang kebutuhan siswa di era modern.</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 3000, disableOnInteraction: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="pb-16"
            >
              {programs.map((prog, idx) => (
                <SwiperSlide key={idx}>
                  <motion.div
                    variants={fadeInUp}
                    className="bg-slate-800/50 backdrop-blur-md p-10 rounded-3xl border border-slate-700/50 hover:bg-slate-800 hover:border-emerald-500/50 transition-all duration-300 group h-full flex flex-col"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300 shadow-lg">
                      {prog.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-slate-100 leading-snug">{prog.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-grow">{prog.description}</p>
                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                      <Link to="/layanan" className="text-emerald-400 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                        Pelajari lebih lanjut <span className="text-lg">→</span>
                      </Link>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* 5. Achievements with Modern Swiper */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-1/3">
              <div className="inline-flex divide-x divide-slate-200 bg-slate-50 border border-slate-200 rounded-lg p-1 mb-8 shadow-sm">
                <Link to="/prestasi" className="px-6 py-2 text-sm font-bold bg-white text-emerald-700 shadow rounded-md">Prestasi</Link>
                <Link to="/prestasi" className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Penghargaan</Link>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1]">Raih Puncak <br />Prestasi</h2>
              <p className="text-slate-600 mb-10 text-lg">Catatan kebanggaan dari semangat juang dan dedikasi talenta-talenta terbaik SMAN 4 Kota Bogor.</p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <p className="text-4xl font-black text-emerald-700 mb-1">{natAchievements}</p>
                  <p className="text-xs font-bold text-emerald-900/60 uppercase tracking-widest">Tingkat Nasional</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <p className="text-4xl font-black text-blue-700 mb-1">{intlAchievements}</p>
                  <p className="text-xs font-bold text-blue-900/60 uppercase tracking-widest">Tingkat Internasional</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-2/3">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{ 640: { slidesPerView: 2 } }}
                navigation
                autoplay={{ delay: 4000 }}
                className="pb-12 !px-4 -mx-4 achievements-carousel"
              >
                {displayAchievements.map((ach, i) => (
                  <SwiperSlide key={i}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 h-full flex flex-col group">
                      <div className="h-48 relative overflow-hidden">
                        <img src={ach.imageUrl || `https://images.unsplash.com/photo-${i % 2 === 0 ? '1523580494863-6f3031224c94' : '1543269865-cbf427effbad'}?auto=format&fit=crop&w=500&q=80`} alt="Achievement" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {ach.level || "Regional"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <p className="text-slate-400 text-xs font-bold font-mono mb-3">{new Date(ach.date).toLocaleDateString()}</p>
                        <h3 className="font-bold text-lg text-slate-800 leading-snug mb-4 group-hover:text-emerald-600 transition-colors line-clamp-3">
                          <Link to={`/prestasi/${ach.slug || ach.id}`} className="hover:underline">
                            {ach.title}
                          </Link>
                        </h3>
                        <div className="mt-auto">
                          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. News Masonry / Carousel */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Berita Terkini</h2>
              <p className="text-slate-500 text-lg">Ikuti perkembangan dan informasi terbaru dari sekolah.</p>
            </motion.div>
            <Link to="/info-publikasi" className="hidden md:flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-800 transition">
              Lihat Semua Berita <span className="text-xl">→</span>
            </Link>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Swiper
              modules={[Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              pagination={{ clickable: true }}
              className="pb-16"
            >
              {displayNews.map((newsItem, i) => (
                <SwiperSlide key={i} className="h-auto">
                  <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-2xl transition duration-500 border border-slate-100 group h-full flex flex-col">
                    <div className="h-56 rounded-2xl overflow-hidden mb-6 relative">
                      <img src={newsItem.imageUrl || `https://images.unsplash.com/photo-${1551000000000 + i * 1000}?auto=format&fit=crop&w=500&q=80`} alt="News" className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=80' }} />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> News
                      </div>
                    </div>
                    <Link to={newsItem.id ? `/berita/${newsItem.slug || newsItem.id}` : "/info-publikasi"}>
                      <h3 className="font-bold text-xl mb-3 text-slate-800 leading-snug group-hover:text-emerald-700 transition line-clamp-2">
                        {newsItem.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
                      {newsItem.content ? newsItem.content.replace(/<[^>]+>/g, '') : ''}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                      <p className="text-slate-400 text-sm font-medium">{new Date(newsItem.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <Link to={newsItem.id ? `/berita/${newsItem.slug || newsItem.id}` : "/info-publikasi"} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </Link>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* 7. Location (Modern Map View) */}
      <section className="relative w-full py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="w-full lg:w-5/12 bg-slate-900 p-10 lg:p-12 relative flex flex-col justify-center">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1526040652367-ac003a0475fd?auto=format&fit=crop&w=1000&q=80" alt="Building Pattern" className="w-full h-full object-cover opacity-10" />
              </div>
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative z-10 w-full">
                <div className="w-12 h-1 bg-emerald-500 mb-6 rounded"></div>
                <h3 className="text-white font-black text-4xl tracking-tight mb-2">Visit Us</h3>
                <p className="text-emerald-400 font-bold text-lg uppercase tracking-widest mb-8">SMA Negeri 4 Bogor</p>

                <div className="space-y-6 text-slate-300 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">Alamat</p>
                      <p className="leading-relaxed">Jl. Dreded No.36, Empang, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">Kontak</p>
                      <p>(0251) 8322238</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="w-full lg:w-7/12 min-h-[350px] relative bg-slate-200">
              <iframe
                title="Google Map SMAN 4 Bogor"
                src="https://maps.google.com/maps?q=SMA%20Negeri%204%20Bogor,%20Jl.%20Dreded&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy">
              </iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Global overrides for Swiper styling injected here for localized feel */}
      <style>{`
        .swiper-pagination-bullet { background: #10b981; opacity: 0.4; }
        .swiper-pagination-bullet-active { background: #059669; opacity: 1; }
        .achievements-carousel .swiper-button-next,
        .achievements-carousel .swiper-button-prev {
           background: white; width: 40px; height: 40px; border-radius: 50%;
           box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); color: #059669;
        }
        .achievements-carousel .swiper-button-next:after,
        .achievements-carousel .swiper-button-prev:after { font-size: 16px; font-weight: bold; }
      `}</style>
    </motion.div>
  );
}
