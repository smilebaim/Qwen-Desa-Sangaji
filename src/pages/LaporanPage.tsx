import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, BarChart3, Users, Home, Store, Building2, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { kpiData, educationData, occupationData, umkmData, bantuanSosial, pembangunanData } from '../data/demoData';
import { CRUDManager, downloadFile } from '../utils/crudManager';

export default function LaporanPage() {
  const [reportType, setReportType] = useState('ringkasan');
  const [pendudukCount, setPendudukCount] = useState(0);
  const [keluargaCount, setKeluargaCount] = useState(0);
  const [umkmCount, setUmkmCount] = useState(0);
  const [infrastrukturCount, setInfrastrukturCount] = useState(0);

  useEffect(() => {
    setPendudukCount(new CRUDManager('maba_penduduk').getAll().length);
    setKeluargaCount(new CRUDManager('maba_keluarga').getAll().length);
    setUmkmCount(new CRUDManager('maba_umkm').getAll().length);
    setInfrastrukturCount(new CRUDManager('maba_infrastruktur').getAll().length);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportReport = () => {
    const report = {
      judul: 'Laporan Data Desa Maba Sangaji',
      tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      ringkasan: {
        totalPenduduk: pendudukCount,
        totalKeluarga: keluargaCount,
        totalUMKM: umkmCount,
        totalInfrastruktur: infrastrukturCount,
      },
      dataPendidikan: educationData,
      dataPekerjaan: occupationData,
      dataUMKM: umkmData,
      dataBantuan: bantuanSosial,
      dataPembangunan: pembangunanData,
    };
    downloadFile(JSON.stringify(report, null, 2), 'laporan-desa-maba-sangaji.json');
  };

  const summaryData = [
    { label: 'Total Penduduk', value: pendudukCount || kpiData.totalPenduduk, icon: Users, color: 'from-sky-500 to-blue-600' },
    { label: 'Total Keluarga', value: keluargaCount || kpiData.jumlahKK, icon: Home, color: 'from-emerald-500 to-teal-600' },
    { label: 'Total UMKM', value: umkmCount || kpiData.jumlahUMKM, icon: Store, color: 'from-cyan-500 to-sky-600' },
    { label: 'Infrastruktur', value: infrastrukturCount || kpiData.infrastrukturDesa, icon: Building2, color: 'from-violet-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Laporan & Grafik</h2>
            <p className="text-sm text-slate-500">Ringkasan data dan statistik Desa Maba Sangaji</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 text-sm font-medium flex items-center gap-2">
              <Printer className="w-4 h-4" /> Cetak
            </button>
            <button onClick={handleExportReport} className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" /> Ekspor Laporan
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {summaryData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">{card.label}</p>
                  <p className="text-sm sm:text-xl font-bold text-slate-800 truncate">{card.value.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
        ⚡ DATA DEMO — Laporan berdasarkan data yang tersimpan di browser. Data dapat berubah jika Anda menambah/edit/hapus data di modul terkait.
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Distribusi Pendidikan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={educationData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {educationData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Distribusi Pekerjaan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={occupationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">UMKM per Kategori</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={umkmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="kategori" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="jumlah" fill="#10b981" radius={[4, 4, 0, 0]} name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-4">Bantuan Sosial</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bantuanSosial} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis dataKey="jenis" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" width={80} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="penerima" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Penerima" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pembangunan Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Progres Pembangunan Desa</h3>
        <div className="space-y-4">
          {pembangunanData.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-700">{item.nama}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>{item.status}</span>
                  <span className="text-sm font-semibold text-slate-600">{item.progres}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.progres}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }} className={`h-full rounded-full ${item.progres === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-sky-400 to-cyan-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
