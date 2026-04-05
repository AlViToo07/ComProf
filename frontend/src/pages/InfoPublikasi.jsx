import React from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function InfoPublikasi() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const [documents, setDocuments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get('/api/publications');
        if (Array.isArray(res.data)) {
          setDocuments(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch publications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Header Section */}
      <section className="relative w-full py-20 bg-slate-900 flex items-center justify-center overflow-hidden mb-16">
         <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1920&q=80" alt="Documents" className="w-full h-full object-cover" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
         <motion.div 
           initial="hidden" animate="visible" variants={fadeInUp} 
           className="relative z-10 text-center max-w-3xl mx-auto px-4 text-white"
         >
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold tracking-widest text-xs mb-6 backdrop-blur-sm shadow-lg">
               DOKUMEN & INFORMASI RESMI
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-md">Info & Publikasi</h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
               Pusat unduhan dokumen resmi, rilis berita, jadwal ujian, dan tata tertib yang berlaku di SMAN 4 Kota Bogor.
            </p>
         </motion.div>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-4 relative z-20">
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-slate-100 p-8 md:p-12 -mt-24"
        >
           <motion.div variants={fadeInUp} className="flex justify-between items-end border-b-2 border-slate-100 pb-6 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Dokumen Publik</h2>
                <p className="text-slate-500 text-sm">Unduh dokumen yang Anda butuhkan untuk keperluan akademik.</p>
              </div>
              <div className="hidden sm:block">
                 <div className="relative">
                   <input type="text" placeholder="Cari dokumen..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all w-64" />
                   <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>
              </div>
           </motion.div>

           <div className="space-y-4">
              {documents.map((doc, idx) => (
                 <motion.div 
                   key={idx} variants={fadeInUp}
                   className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                 >
                    <div className="flex items-center gap-5 mb-4 sm:mb-0">
                       <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{doc.title}</h3>
                          <div className="flex gap-4 mt-2 text-xs font-semibold text-slate-500">
                             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>File</span>
                             {doc.publishedAt && (
                               <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{new Date(doc.publishedAt).toLocaleDateString()}</span>
                             )}
                          </div>
                       </div>
                    </div>
                    {doc.fileUrl ? (
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                         Unduh
                      </a>
                    ) : (
                      <button disabled className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 font-bold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                         Tidak Ada File
                      </button>
                    )}
                 </motion.div>
              ))}
           </div>
           
           <motion.div variants={fadeInUp} className="mt-10 flex justify-center">
              <button className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200 transition-colors text-sm flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                 Muat Lebih Banyak
              </button>
           </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
