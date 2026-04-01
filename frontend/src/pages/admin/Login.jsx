import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Jika sudah login, tendang ke /admin
  if (sessionStorage.getItem('adminToken')) {
     return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      sessionStorage.setItem('adminToken', res.data.token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Koneksi ke server gagal. Coba lagi.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-emerald-900 flex items-center justify-center px-4 py-20 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-blend-overlay">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-emerald-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Login Admin</h1>
          <p className="text-gray-500 font-medium">Masuk menggunakan kredensial Anda</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold text-center border border-red-200 animate-pulse">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-extrabold tracking-wide text-gray-700 mb-2">USERNAME / ID</label>
            <input type="text" required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-xl p-4 outline-none transition font-semibold text-gray-800" value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan username" />
          </div>
          <div>
            <label className="block text-sm font-extrabold tracking-wide text-gray-700 mb-2">PASSWORD</label>
            <input type="password" required className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-xl p-4 outline-none transition font-semibold text-gray-800" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-widest py-4 px-4 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition hover:-translate-y-1 mt-4">
            LOGIN SEKARANG
          </button>
        </form>
      </div>
    </div>
  );
}
