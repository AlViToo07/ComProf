import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export default function Organisasi() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile').then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if(loading) return <div className="pt-40 text-center text-gray-400">Loading...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold text-emerald-900 mb-8 border-b-4 border-emerald-700 pb-4 inline-block">Struktur Organisasi</h1>
        <div className="bg-white rounded-xl px-12 py-16 shadow-md border border-gray-100 mt-8">
            <h2 className="text-xl text-gray-500 mb-6 font-medium">Bagan Struktur Organisasi {data.name || 'SMAN 4 BOGOR'}</h2>
            {data.orgStructureUrl ? (
               <img src={data.orgStructureUrl} alt="Struktur Organisasi" className="w-full h-auto rounded border-2 border-gray-100 shadow-sm mx-auto" />
            ) : (
               <div className="w-full h-80 bg-gray-200 rounded flex items-center justify-center border-dashed border-2 border-gray-300">
                  <span className="text-gray-500 font-semibold">[ Area Gambar Struktur Organisasi Kosong ]</span>
               </div>
            )}
            <div className="text-left mt-8 text-gray-600 leading-relaxed text-sm prose prose-emerald max-w-none" dangerouslySetInnerHTML={{ __html: data.orgDesc || "" }}>
            </div>
        </div>
      </div>
    </div>
  );
}
