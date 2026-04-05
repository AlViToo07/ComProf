import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Achievements from './pages/Achievements';
import Staff from './pages/Staff';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/admin/Login';
import VisiMisi from './pages/about/VisiMisi';
import Pimpinan from './pages/about/Pimpinan';
import Organisasi from './pages/about/Organisasi';
import Sejarah from './pages/about/Sejarah';
import Layanan from './pages/Layanan';
import InfoPublikasi from './pages/InfoPublikasi';
import BeritaDetail from './pages/BeritaDetail';
import PrestasiDetail from './pages/PrestasiDetail';
import LayananDetail from './pages/LayananDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedAdminRoute = ({ children }) => {
  const token = sessionStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prestasi" element={<Achievements />} />
            <Route path="/prestasi/:id" element={<PrestasiDetail />} />
            <Route path="/berita/:id" element={<BeritaDetail />} />
            <Route path="/layanan/:id" element={<LayananDetail />} />
            <Route path="/jajaran" element={<Staff />} />
            <Route path="/tentang/visi-misi" element={<VisiMisi />} />
            <Route path="/tentang/pimpinan" element={<Pimpinan />} />
            <Route path="/tentang/organisasi" element={<Organisasi />} />
            <Route path="/tentang/sejarah" element={<Sejarah />} />
            <Route path="/layanan" element={<Layanan />} />
            <Route path="/info-publikasi" element={<InfoPublikasi />} />
            <Route path="/admin/login" element={<Login />} />
            <Route 
               path="/admin/*" 
               element={
                 <ProtectedAdminRoute>
                   <AdminDashboard />
                 </ProtectedAdminRoute>
               } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
