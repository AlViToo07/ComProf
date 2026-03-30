import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#103020] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold tracking-wider mb-4 border-b border-gray-600 pb-2 inline-block">HUBUNGI KAMI</h3>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="bg-red-600 p-2 rounded hover:bg-red-700 transition"><FaYoutube /></a>
              <a href="#" className="bg-cyan-500 p-2 rounded hover:bg-cyan-600 transition"><FaTwitter /></a>
              <a href="#" className="bg-pink-600 p-2 rounded hover:bg-pink-700 transition"><FaInstagram /></a>
              <a href="#" className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition"><FaFacebookF /></a>
            </div>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-bold tracking-wider mb-4 text-emerald-400">ALAMAT</h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              Jl. Dreded No. 36, Empang, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider mb-4 text-emerald-400">EMAIL</h3>
            <p className="text-sm text-gray-300">
              admin@sman4bogor.sch.id
            </p>
            <h3 className="text-sm font-bold tracking-wider mt-6 mb-2 text-emerald-400">TELP</h3>
            <p className="text-sm text-gray-300">
              Telp. (0251) 8322238
            </p>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8 pt-8 border-t border-gray-700">
          <p>© 2026 SMAN 4 Kota Bogor. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
