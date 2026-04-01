import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Pimpinan() {
  const [pimpinan, setPimpinan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/staff')
      .then(res => {
         const filterData = res.data.filter(item => item.category === 'Pimpinan');
         setPimpinan(filterData);
         setLoading(false);
      })
      .catch(err => {
         console.error('Error fetching pimpinan:', err);
         setLoading(false);
      });
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold text-emerald-900 mb-12 border-b-4 border-emerald-600 pb-4 inline-block tracking-tight">Profil Jajaran Pimpinan</h1>
        
        {loading ? (
           <p className="text-emerald-600 font-bold animate-pulse mt-10">Memuat data pimpinan...</p>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
             {pimpinan.length === 0 && (
                <p className="col-span-1 md:col-span-2 lg:col-span-3 text-gray-500 italic">Data pimpinan belum ditambahkan.</p>
             )}
             {pimpinan.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-slate-100 flex flex-col">
                   <div className="h-72 bg-emerald-50 flex items-center justify-center overflow-hidden">
                       {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-emerald-800 font-bold opacity-30 uppercase tracking-widest text-sm">Tidak ada foto</span>
                       )}
                   </div>
                   <div className="p-8 flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-extrabold text-gray-900 mb-1 uppercase tracking-wide">{item.name}</h3>
                      <p className="text-emerald-700 text-sm font-bold tracking-widest uppercase mb-4">{item.position}</p>
                      {item.bio && (
                         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block mx-auto">
                            <p className="text-xs text-slate-600 font-mono tracking-tight">{item.bio}</p>
                         </div>
                      )}
                   </div>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
