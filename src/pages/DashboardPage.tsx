import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Home, User, UserCheck, GraduationCap, Store, Building2, Heart, 
  Landmark, TrendingUp, Activity, Clock, ArrowUpRight, Edit, Plus, 
  Trash2, Save, X, CheckCircle, AlertCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { kpiData, populationByYear, educationData, occupationData, anggaranData, recentActivities, pembangunanData } from '../data/demoData';
import { useAuth } from '../context/AuthContext';
import { CRUDManager } from '../utils/crudManager';
import { Modal, FormField } from '../components/Modal';

// Initialize KPI manager
const kpiManager = new CRUDManager('maba_kpi_data');

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString('id-ID')}</span>;
}

interface KPICardProps {
  label: string;
  value: number;
  icon: any;
  color: string;
  link: string;
  suffix?: string;
  onEdit: () => void;
  variant?: 'default' | 'icon-right' | 'icon-large';
}

// Variant 1: Default (icon di kanan, compact)
function KPICard({ label, value, icon: Icon, color, link, suffix, onEdit, variant = 'default' }: KPICardProps) {
  if (variant === 'icon-right') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-3 sm:p-5 group relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 mb-1 truncate">{label}</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-800 truncate">
              <AnimatedCounter target={value} />
              {suffix || ''}
            </p>
          </div>
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-[10px] sm:text-xs text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Lihat detail</span>
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </div>
          <button
            onClick={onEdit}
            className="p-1 sm:p-1.5 rounded-lg bg-white/80 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
            title="Edit nilai"
          >
            <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  if (variant === 'icon-large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-6 group relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
              title="Edit nilai"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-2xl sm:text-4xl font-bold text-slate-800">
            <AnimatedCounter target={value} />
            {suffix || ''}
          </p>
          <div className="mt-3 flex items-center text-xs text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Lihat detail</span>
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-3 sm:p-5 group relative"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-medium text-slate-500 mb-0.5 sm:mb-1 truncate">{label}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
            <AnimatedCounter target={value} />
            {suffix || ''}
          </p>
        </div>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
      <div className="mt-2 sm:mt-3 flex items-center justify-between">
        <div className="flex items-center text-[10px] sm:text-xs text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Lihat detail</span>
          <ArrowUpRight className="w-3 h-3 ml-1" />
        </div>
        <button
          onClick={onEdit}
          className="p-1 sm:p-1.5 rounded-lg bg-white/80 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
          title="Edit nilai"
        >
          <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [kpiValues, setKpiValues] = useState(kpiData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKPI, setEditingKPI] = useState<{ key: string; label: string; value: number } | null>(null);
  const [editValue, setEditValue] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load KPI values from localStorage
  useEffect(() => {
    const saved = kpiManager.getAll();
    if (saved.length > 0) {
      const kpiObj = saved[0] as unknown as typeof kpiData;
      setKpiValues(kpiObj);
    } else {
      // Initialize with default data
      kpiManager.create(kpiData);
    }
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditKPI = (key: string, label: string, currentValue: number) => {
    setEditingKPI({ key, label, value: currentValue });
    setEditValue(currentValue);
    setIsEditModalOpen(true);
  };

  const handleSaveKPI = () => {
    if (!editingKPI) return;
    
    const updated = { ...kpiValues, [editingKPI.key]: editValue };
    setKpiValues(updated);
    
    // Save to localStorage
    const existing = kpiManager.getAll();
    if (existing.length > 0) {
      kpiManager.update(existing[0].id, updated);
    } else {
      kpiManager.create(updated);
    }
    
    setIsEditModalOpen(false);
    setEditingKPI(null);
    showNotification('success', `${editingKPI.label} berhasil diperbarui!`);
  };

  const handleResetKPI = () => {
    if (confirm('Reset semua data KPI ke nilai awal?')) {
      kpiManager.clear();
      kpiManager.create(kpiData);
      setKpiValues(kpiData);
      showNotification('success', 'Data KPI berhasil direset ke nilai awal!');
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jayapura', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jayapura' });
  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  const kpiCards = [
    { key: 'totalPenduduk', label: 'Total Penduduk', value: kpiValues.totalPenduduk, icon: Users, color: 'from-sky-500 to-blue-600', link: 'penduduk', variant: 'icon-large' as const },
    { key: 'jumlahKK', label: 'Kepala Keluarga', value: kpiValues.jumlahKK, icon: Home, color: 'from-emerald-500 to-teal-600', link: 'keluarga', variant: 'icon-right' as const },
    { key: 'lakiLaki', label: 'Laki-laki', value: kpiValues.lakiLaki, icon: User, color: 'from-blue-500 to-indigo-600', link: 'statistik', variant: 'icon-right' as const },
    { key: 'perempuan', label: 'Perempuan', value: kpiValues.perempuan, icon: UserCheck, color: 'from-pink-500 to-rose-600', link: 'statistik', variant: 'default' as const },
    { key: 'usiaProduktif', label: 'Usia Produktif', value: kpiValues.usiaProduktif, icon: TrendingUp, color: 'from-violet-500 to-purple-600', link: 'statistik', variant: 'icon-right' as const },
    { key: 'usiaSekolah', label: 'Usia Sekolah', value: kpiValues.usiaSekolah, icon: GraduationCap, color: 'from-amber-500 to-orange-600', link: 'pendidikan', variant: 'default' as const },
    { key: 'jumlahUMKM', label: 'UMKM', value: kpiValues.jumlahUMKM, icon: Store, color: 'from-cyan-500 to-sky-600', link: 'umkm', variant: 'icon-large' as const },
    { key: 'fasilitasPendidikan', label: 'Fasilitas Pendidikan', value: kpiValues.fasilitasPendidikan, icon: Building2, color: 'from-indigo-500 to-blue-600', link: 'pendidikan', variant: 'default' as const },
    { key: 'fasilitasKesehatan', label: 'Fasilitas Kesehatan', value: kpiValues.fasilitasKesehatan, icon: Heart, color: 'from-red-500 to-pink-600', link: 'kesehatan', variant: 'icon-right' as const },
    { key: 'infrastrukturDesa', label: 'Infrastruktur', value: kpiValues.infrastrukturDesa, icon: Landmark, color: 'from-slate-500 to-gray-600', link: 'infrastruktur', variant: 'default' as const },
    { key: 'jumlahProgram', label: 'Program Desa', value: kpiValues.jumlahProgram, icon: Activity, color: 'from-teal-500 to-emerald-600', link: 'anggaran', variant: 'icon-right' as const },
    { key: 'realisasiAnggaran', label: 'Realisasi Anggaran', value: Math.round(kpiValues.realisasiAnggaran / 1000000), icon: Landmark, color: 'from-green-500 to-emerald-600', link: 'anggaran', suffix: ' Jt', variant: 'icon-large' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, {user?.name || 'Pengguna'} 👋</h1>
            <p className="text-slate-500 text-sm mt-1">Desa Maba Sangaji — Kabupaten Halmahera Timur, Maluku Utara</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2 text-sky-600 font-semibold">
                <Clock className="w-4 h-4" />
                <span>{formatTime(currentTime)} WIT</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{formatDate(currentTime)}</p>
            </div>
            <button
              onClick={handleResetKPI}
              className="px-3 py-2 rounded-xl bg-amber-100 text-amber-700 text-xs font-medium hover:bg-amber-200 transition-colors"
              title="Reset ke data awal"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* DEMO Badge */}
      <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium flex items-center gap-2">
        <span>⚡</span>
        <span>Data KPI dapat diedit langsung. Hover pada kartu dan klik ikon edit untuk mengubah nilai.</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((card) => (
          <KPICard
            key={card.key}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            link={card.link}
            suffix={card.suffix}
            variant={card.variant}
            onEdit={() => handleEditKPI(card.key, card.label, card.value)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('penduduk')}
            className="p-4 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors text-center"
          >
            <Users className="w-6 h-6 text-sky-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-sky-700">Tambah Penduduk</p>
          </button>
          <button
            onClick={() => onNavigate('umkm')}
            className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors text-center"
          >
            <Store className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-emerald-700">Tambah UMKM</p>
          </button>
          <button
            onClick={() => onNavigate('pengumuman')}
            className="p-4 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors text-center"
          >
            <Activity className="w-6 h-6 text-violet-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-violet-700">Buat Pengumuman</p>
          </button>
          <button
            onClick={() => onNavigate('peta')}
            className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors text-center"
          >
            <Building2 className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-amber-700">Tambah Marker</p>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Pertumbuhan Penduduk</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={populationByYear}>
              <defs>
                <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tahun" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="jumlah" stroke="#0ea5e9" fill="url(#colorPop)" strokeWidth={2} name="Jumlah Penduduk" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Tingkat Pendidikan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={educationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {educationData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Anggaran & Realisasi (Juta Rp)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={anggaranData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="target" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="realisasi" fill="#10b981" radius={[4, 4, 0, 0]} name="Realisasi" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Jenis Pekerjaan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={occupationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={80} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-3 sm:p-6 lg:col-span-2">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Progres Pembangunan Desa</h3>
          <div className="space-y-3 sm:space-y-4">
            {pembangunanData.slice(0, 5).map((item, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1 sm:mb-1.5">
                  <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">{item.nama}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>
                      {item.status}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-600">{item.progres}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progres}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full ${item.progres === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-sky-400 to-cyan-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  activity.type === 'update' ? 'bg-blue-500' :
                  activity.type === 'create' ? 'bg-green-500' :
                  activity.type === 'report' ? 'bg-purple-500' :
                  activity.type === 'import' ? 'bg-amber-500' : 'bg-sky-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Budget Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="glass-card p-3 sm:p-6">
        <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Ringkasan Anggaran Desa 2024</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="text-center p-3 sm:p-4 rounded-xl bg-sky-50">
            <p className="text-[10px] sm:text-sm text-slate-500">Total Anggaran</p>
            <p className="text-sm sm:text-xl font-bold text-sky-700 mt-1 truncate">{formatCurrency(kpiValues.totalAnggaran)}</p>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-emerald-50">
            <p className="text-[10px] sm:text-sm text-slate-500">Realisasi</p>
            <p className="text-sm sm:text-xl font-bold text-emerald-700 mt-1 truncate">{formatCurrency(kpiValues.realisasiAnggaran)}</p>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-violet-50">
            <p className="text-[10px] sm:text-sm text-slate-500">Persentase Pembangunan</p>
            <p className="text-sm sm:text-xl font-bold text-violet-700 mt-1">{kpiValues.persentasePembangunan}%</p>
          </div>
        </div>
      </motion.div>

      {/* Edit KPI Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit ${editingKPI?.label || ''}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nilai Baru</label>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
              Batal
            </button>
            <button onClick={handleSaveKPI} className="flex-1 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Simpan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
