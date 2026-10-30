import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import Sidebar from './components/Sidebar';
import {
  ProfilDesaPage, PendudukPage, StatistikPage, KeluargaPage, UMKMPage,
  AnggaranPage, InfrastrukturPage, PengumumanPage, GenericDataPage
} from './pages/DataPages';
import PendidikanPage from './pages/PendidikanPage';
import KesehatanPage from './pages/KesehatanPage';
import PekerjaanPage from './pages/PekerjaanPage';
import BantuanPage from './pages/BantuanPage';
import MarkerManagementPage from './pages/MarkerManagementPage';
import LayerManagementPage from './pages/LayerManagementPage';
import LaporanPage from './pages/LaporanPage';
import PengaturanPage from './pages/PengaturanPage';
import PenggunaPage from './pages/PenggunaPage';
import GaleriPage from './pages/GaleriPage';
import EkonomiPage from './pages/EkonomiPage';
import PertanianPage from './pages/PertanianPage';
import { Bell, Search, User, Menu, X } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [iconOnly, setIconOnly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('maba_sidebar_prefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        setSidebarCollapsed(prefs.collapsed || false);
        setIconOnly(prefs.iconOnly || false);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('maba_sidebar_prefs', JSON.stringify({ collapsed: sidebarCollapsed, iconOnly }));
  }, [sidebarCollapsed, iconOnly]);

  if (!isAuthenticated) return <LoginPage />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} />;
      case 'profil': return <ProfilDesaPage />;
      case 'penduduk': return <PendudukPage />;
      case 'statistik': return <StatistikPage />;
      case 'keluarga': return <KeluargaPage />;
      case 'pendidikan': return <PendidikanPage />;
      case 'kesehatan': return <KesehatanPage />;
      case 'pekerjaan': return <PekerjaanPage />;
      case 'ekonomi': return <EkonomiPage />;
      case 'umkm': return <UMKMPage />;
      case 'pertanian': return <PertanianPage />;
      case 'bantuan': return <BantuanPage />;
      case 'infrastruktur': return <InfrastrukturPage />;
      case 'anggaran': return <AnggaranPage />;
      case 'peta': return <MapPage />;
      case 'marker': return <MarkerManagementPage onNavigate={setCurrentPage} />;
      case 'layer': return <LayerManagementPage onNavigate={setCurrentPage} />;
      case 'pengumuman': return <PengumumanPage />;
      case 'laporan': return <LaporanPage />;
      case 'galeri': return <GaleriPage />;
      case 'pengaturan': return <PengaturanPage />;
      case 'pengguna': return <PenggunaPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard Utama', profil: 'Profil Desa', penduduk: 'Data Penduduk', statistik: 'Statistik Demografi',
      keluarga: 'Data Keluarga', pendidikan: 'Data Pendidikan', kesehatan: 'Data Kesehatan', pekerjaan: 'Data Pekerjaan',
      ekonomi: 'Data Ekonomi', umkm: 'Data UMKM', pertanian: 'Pertanian & Perikanan', bantuan: 'Bantuan Sosial',
      infrastruktur: 'Infrastruktur Desa', anggaran: 'Anggaran & Keuangan', peta: 'Peta Digital Desa',
      marker: 'Manajemen Marker', layer: 'Manajemen Layer', laporan: 'Laporan & Grafik', galeri: 'Galeri Dokumentasi',
      pengumuman: 'Pengumuman Desa', pengaturan: 'Pengaturan', pengguna: 'Manajemen Pengguna',
    };
    return titles[currentPage] || 'Dashboard';
  };

  const sidebarWidth = sidebarCollapsed || iconOnly ? 72 : 280;

  return (
    <div className="min-h-screen relative">
      <div className="bg-decoration bg-decoration-1" />
      <div className="bg-decoration bg-decoration-2" />

      {mobileMenuOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

      <div className="hidden lg:block">
        <Sidebar currentPage={currentPage} onPageChange={(page) => { setCurrentPage(page); setMobileMenuOpen(false); }} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} iconOnly={iconOnly} onIconOnlyToggle={() => setIconOnly(!iconOnly)} />
      </div>

      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentPage={currentPage} onPageChange={(page) => { setCurrentPage(page); setMobileMenuOpen(false); }} collapsed={false} onToggle={() => setMobileMenuOpen(false)} iconOnly={false} onIconOnlyToggle={() => {}} />
      </div>

      <div className="transition-all duration-300" style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : '0px' }}>
        <header className="sticky top-0 z-20 glass border-b border-white/30 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-white/60">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{getPageTitle()}</h2>
                <p className="text-xs text-slate-500 hidden sm:block">Desa Maba Sangaji — Halmahera Timur</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 w-48 lg:w-64 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
                </div>
              </div>
              <button className="relative p-2 rounded-xl hover:bg-white/60 transition-colors"><Bell className="w-5 h-5 text-slate-600" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                <div className="hidden sm:block"><p className="text-xs font-semibold text-slate-700">{user?.name}</p><p className="text-[10px] text-slate-400">{user?.role}</p></div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
