import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function VisiMisi() {
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
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold text-emerald-900 mb-8 border-b-4 border-emerald-700 pb-4 inline-block">Visi Misi & Motto</h1>
        <div className="bg-emerald-50 rounded-xl p-8 shadow-sm text-left">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Visi</h2>
          <p className="text-gray-700 mb-8 leading-relaxed whitespace-pre-wrap">{data.vision || "Belum ada data Visi"}</p>
          
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Misi</h2>
          <div className="text-gray-700 mb-8 leading-relaxed whitespace-pre-wrap">
             {data.mission || "Belum ada data Misi"}
          </div>

          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Motto</h2>
          <p className="text-xl font-medium italic text-gray-600">"{data.motto || "Belum ada data Motto"}"</p>
        </div>
      </div>
    </div>
  );
}
