import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axios.get('/api/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-md">
      {/* Top thin bar removed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            {profile.logoUrl && (
               <img src={profile.logoUrl} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            )}
            <div className="font-extrabold text-xl md:text-2xl text-emerald-800 leading-tight">
              {profile.name ? profile.name : 'SMAN 4'} <br/><span className="text-sm text-gray-500 font-semibold tracking-widest">KOTA BOGOR</span>
            </div>
          </Link>
          <div className="hidden md:flex space-x-6 items-center text-sm font-bold text-gray-600 tracking-wide">
            <Link to="/" className="hover:text-emerald-700 transition pb-1">BERANDA</Link>
            
            <div className="relative group cursor-pointer pb-1">
              <span className="hover:text-emerald-700 transition">TENTANG KAMI</span>
              <div className="absolute left-0 w-56 mt-1 bg-white border border-emerald-100 shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/tentang/visi-misi" className="block px-5 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition border-b border-gray-50">Visi Misi & Motto</Link>
                <Link to="/tentang/pimpinan" className="block px-5 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition border-b border-gray-50">Pimpinan</Link>
                <Link to="/tentang/organisasi" className="block px-5 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition border-b border-gray-50">Organisasi</Link>
                <Link to="/tentang/sejarah" className="block px-5 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition rounded-b-lg">Sejarah Sekolah</Link>
              </div>
            </div>

            <Link to="/layanan" className="hover:text-emerald-700 transition pb-1">LAYANAN</Link>
            <Link to="/info-publikasi" className="hover:text-emerald-700 transition pb-1">INFO PUBLIKASI</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
