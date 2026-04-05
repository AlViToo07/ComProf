import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiAward, FiSettings, FiLogOut, FiMenu, FiX, FiLayers, FiBookOpen } from 'react-icons/fi';

const menuItems = [
  { label: 'PROFIL UTAMA', path: '/admin/profil', icon: FiHome },
  { label: 'JAJARAN PIMPINAN', path: '/admin/pimpinan', icon: FiUsers },
  { label: 'HALAMAN TENTANG', path: '/admin/halaman', icon: FiBookOpen },
  { label: 'SEJARAH SEKOLAH', path: '/admin/sejarah', icon: FiBookOpen },
  { label: 'KELOLA BERITA', path: '/admin/berita', icon: FiFileText },
  { label: 'KELOLA PRESTASI', path: '/admin/prestasi', icon: FiAward },
  { label: 'LAYANAN', path: '/admin/layanan', icon: FiLayers },
  { label: 'PUBLIKASI', path: '/admin/publikasi', icon: FiFileText },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Yakin ingin mengakhiri sesi admin?')) {
      sessionStorage.removeItem('adminToken');
      navigate('/admin/login', { replace: true });
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-[85vh] bg-slate-50 flex mt-16 md:mt-20">
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-20 left-4 z-50 md:hidden bg-emerald-700 text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300
        fixed md:sticky top-0 md:top-20 left-0 z-40
        w-64 h-screen md:h-[calc(100vh-5rem)]
        bg-[#144C33] text-white shadow-xl border-r-4 border-emerald-900
        flex flex-col overflow-y-auto
      `}>
        <div className="p-6 flex-1">
          <h2 className="text-2xl font-black mb-8 border-b-2 border-emerald-700/50 pb-4 tracking-wide">
            Panel Admin
          </h2>
          <nav className="space-y-2 font-bold text-xs tracking-widest">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`w-full text-left px-4 py-3 rounded transition shadow-sm flex items-center gap-3 ${
                  isActive(item.path) ? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            <div className="my-4 border-t border-emerald-800"></div>
            <Link
              to="/admin/akun"
              onClick={() => setMobileOpen(false)}
              className={`w-full text-left px-4 py-3 rounded transition shadow-sm flex items-center gap-3 ${
                isActive('/admin/akun') ? 'bg-emerald-600 shadow-emerald-900/50' : 'hover:bg-emerald-800'
              }`}
            >
              <FiSettings size={16} />
              AKUN SAYA
            </Link>
          </nav>
        </div>
        <div className="p-6 pt-0">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded font-bold text-xs tracking-widest text-red-200 hover:bg-red-900/50 transition flex items-center gap-3"
          >
            <FiLogOut size={16} />
            LOG OUT
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto min-h-screen">
        {children}
      </div>
    </div>
  );
}
