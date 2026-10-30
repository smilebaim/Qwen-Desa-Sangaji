import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Home, User, UserCheck, GraduationCap, Store, Building2, Heart, Landmark, TrendingUp, Activity, Clock, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { kpiData, populationByYear, educationData, occupationData, anggaranData, recentActivities, pembangunanData } from '../data/demoData';
import { useAuth } from '../context/AuthContext';

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

const kpiCards = [
  { label: 'Total Penduduk', value: kpiData.totalPenduduk, icon: Users, color: 'from-sky-500 to-blue-600', link: 'penduduk' },
  { label: 'Kepala Keluarga', value: kpiData.jumlahKK, icon: Home, color: 'from-emerald-500 to-teal-600', link: 'keluarga' },
  { label: 'Laki-laki', value: kpiData.lakiLaki, icon: User, color: 'from-blue-500 to-indigo-600', link: 'statistik' },
  { label: 'Perempuan', value: kpiData.perempuan, icon: UserCheck, color: 'from-pink-500 to-rose-600', link: 'statistik' },
  { label: 'Usia Produktif', value: kpiData.usiaProduktif, icon: TrendingUp, color: 'from-violet-500 to-purple-600', link: 'statistik' },
  { label: 'Usia Sekolah', value: kpiData.usiaSekolah, icon: GraduationCap, color: 'from-amber-500 to-orange-600', link: 'pendidikan' },
  { label: 'UMKM', value: kpiData.jumlahUMKM, icon: Store, color: 'from-cyan-500 to-sky-600', link: 'umkm' },
  { label: 'Fasilitas Pendidikan', value: kpiData.fasilitasPendidikan, icon: Building2, color: 'from-indigo-500 to-blue-600', link: 'pendidikan' },
  { label: 'Fasilitas Kesehatan', value: kpiData.fasilitasKesehatan, icon: Heart, color: 'from-red-500 to-pink-600', link: 'kesehatan' },
  { label: 'Infrastruktur', value: kpiData.infrastrukturDesa, icon: Landmark, color: 'from-slate-500 to-gray-600', link: 'infrastruktur' },
  { label: 'Program Desa', value: kpiData.jumlahProgram, icon: Activity, color: 'from-teal-500 to-emerald-600', link: 'anggaran' },
  { label: 'Realisasi Anggaran', value: Math.round(kpiData.realisasiAnggaran / 1000000), icon: Landmark, color: 'from-green-500 to-emerald-600', link: 'anggaran', suffix: ' Jt' },
];

export default function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jayapura', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jayapura' });
  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, {user?.name || 'Pengguna'} 👋</h1>
            <p className="text-slate-500 text-sm mt-1">Desa Maba Sangaji — Kabupaten Halmahera Timur, Maluku Utara</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sky-600 font-semibold"><Clock className="w-4 h-4" /><span>{formatTime(currentTime)} WIT</span></div>
            <p className="text-xs text-slate-500 mt-1">{formatDate(currentTime)}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium flex items-center gap-2">
        <span>⚡</span><span>Data yang ditampilkan adalah DATA DEMO untuk keperluan demonstrasi. Bukan data resmi desa.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => onNavigate(card.link)} className="glass-card p-5 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-800"><AnimatedCounter target={card.value} />{card.suffix || ''}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Lihat detail</span><ArrowUpRight className="w-3 h-3 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pertumbuhan Penduduk</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={populationByYear}>
              <defs><linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tahun" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="jumlah" stroke="#0ea5e9" fill="url(#colorPop)" strokeWidth={2} name="Jumlah Penduduk" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tingkat Pendidikan</h3>
          <ResponsiveContainer width="100%" height={250}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Anggaran & Realisasi (Juta Rp)</h3>
          <ResponsiveContainer width="100%" height={250}>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Jenis Pekerjaan</h3>
          <ResponsiveContainer width="100%" height={250}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Progres Pembangunan Desa</h3>
          <div className="space-y-4">
            {pembangunanData.slice(0, 5).map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{item.nama}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>{item.status}</span>
                    <span className="text-sm font-semibold text-slate-600">{item.progres}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.progres}%` }} transition={{ duration: 1, delay: index * 0.1 }} className={`h-full rounded-full ${item.progres === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-sky-400 to-cyan-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.type === 'update' ? 'bg-blue-500' : activity.type === 'create' ? 'bg-green-500' : activity.type === 'report' ? 'bg-purple-500' : activity.type === 'import' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Ringkasan Anggaran Desa 2024</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-sky-50">
            <p className="text-sm text-slate-500">Total Anggaran</p>
            <p className="text-xl font-bold text-sky-700 mt-1">{formatCurrency(kpiData.totalAnggaran)}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-50">
            <p className="text-sm text-slate-500">Realisasi</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(kpiData.realisasiAnggaran)}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-violet-50">
            <p className="text-sm text-slate-500">Persentase Pembangunan</p>
            <p className="text-xl font-bold text-violet-700 mt-1">{kpiData.persentasePembangunan}%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
