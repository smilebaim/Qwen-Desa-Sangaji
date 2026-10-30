import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, BarChart3, Home, GraduationCap,
  Heart, Briefcase, Wallet, Store, Sprout, HeartHandshake, Construction,
  Landmark, Map, MapPin, Layers, FileText, Image, Megaphone,
  Settings, UserCog, ChevronLeft, ChevronRight, LogOut, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  iconOnly: boolean;
  onIconOnlyToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
  { id: 'profil', label: 'Profil Desa', icon: Building2 },
  { id: 'penduduk', label: 'Data Penduduk', icon: Users },
  { id: 'statistik', label: 'Statistik Demografi', icon: BarChart3 },
  { id: 'keluarga', label: 'Data Keluarga', icon: Home },
  { id: 'pendidikan', label: 'Data Pendidikan', icon: GraduationCap },
  { id: 'kesehatan', label: 'Data Kesehatan', icon: Heart },
  { id: 'pekerjaan', label: 'Data Pekerjaan', icon: Briefcase },
  { id: 'ekonomi', label: 'Data Ekonomi', icon: Wallet },
  { id: 'umkm', label: 'Data UMKM', icon: Store },
  { id: 'pertanian', label: 'Pertanian & Perikanan', icon: Sprout },
  { id: 'bantuan', label: 'Bantuan Sosial', icon: HeartHandshake },
  { id: 'infrastruktur', label: 'Infrastruktur Desa', icon: Construction },
  { id: 'anggaran', label: 'Anggaran & Keuangan', icon: Landmark },
  { id: 'peta', label: 'Peta Digital Desa', icon: Map },
  { id: 'marker', label: 'Manajemen Marker', icon: MapPin },
  { id: 'layer', label: 'Manajemen Layer', icon: Layers },
  { id: 'laporan', label: 'Laporan & Grafik', icon: FileText },
  { id: 'galeri', label: 'Galeri Dokumentasi', icon: Image },
  { id: 'pengumuman', label: 'Pengumuman Desa', icon: Megaphone },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  { id: 'pengguna', label: 'Manajemen Pengguna', icon: UserCog },
];

export default function Sidebar({ currentPage, onPageChange, collapsed, onToggle, iconOnly, onIconOnlyToggle }: SidebarProps) {
  const { logout, user } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isCompact = collapsed || iconOnly;

  return (
    <motion.aside
      animate={{ width: isCompact ? 72 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sidebar-glass fixed left-0 top-0 h-full z-40 flex flex-col overflow-hidden"
    >
      <div className="p-4 flex items-center gap-3 border-b border-white/30">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!isCompact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <h1 className="text-sm font-bold text-slate-800 whitespace-nowrap">MABA SANGAJI</h1>
            <p className="text-[10px] text-slate-500 whitespace-nowrap">DIGITAL</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <div key={item.id} className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPageChange(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 ${
                  isActive ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/10 text-sky-700 border border-sky-200/50' : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-sky-600' : ''}`} />
                {!isCompact && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                {isActive && <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-500 rounded-r-full" />}
              </motion.button>
              {isCompact && hoveredItem === item.id && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/30 space-y-2">
        <div className="flex gap-1">
          <button onClick={onIconOnlyToggle} className="flex-1 p-2 rounded-lg hover:bg-white/60 text-slate-500 transition-colors" title={iconOnly ? "Mode Lengkap" : "Mode Ikon"}>
            {iconOnly ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4 mx-auto" />}
          </button>
          {!iconOnly && (
            <button onClick={onToggle} className="flex-1 p-2 rounded-lg hover:bg-white/60 text-slate-500 transition-colors" title={collapsed ? "Buka" : "Tutup"}>
              {collapsed ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4 mx-auto" />}
            </button>
          )}
        </div>
        {!isCompact && user && (
          <div className="px-2 py-2 rounded-xl bg-white/50">
            <p className="text-xs font-semibold text-slate-700 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500">{user.role}</p>
          </div>
        )}
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCompact && <span className="text-sm font-medium">Keluar</span>}
        </button>
      </div>
    </motion.aside>
  );
}
