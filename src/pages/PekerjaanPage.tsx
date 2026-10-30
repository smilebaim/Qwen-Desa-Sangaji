import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

interface PekerjaanItem {
  id: number;
  jenisPekerjaan: string;
  sektor: string;
  jumlahPenduduk: number;
  persentase: number;
  rataRataPenghasilan: number;
  tren: string;
  keterangan: string;
}

const pekerjaanManager = new CRUDManager<PekerjaanItem>('maba_pekerjaan');

const defaultPekerjaan: Omit<PekerjaanItem, 'id'>[] = [
  { jenisPekerjaan: 'Petani', sektor: 'Pertanian', jumlahPenduduk: 876, persentase: 22.8, rataRataPenghasilan: 2500000, tren: 'Stabil', keterangan: 'Petani padi, jagung, dan sayuran' },
  { jenisPekerjaan: 'Nelayan', sektor: 'Perikanan', jumlahPenduduk: 432, persentase: 11.2, rataRataPenghasilan: 3000000, tren: 'Stabil', keterangan: 'Nelayan tangkap dan budidaya' },
  { jenisPekerjaan: 'PNS', sektor: 'Pemerintahan', jumlahPenduduk: 124, persentase: 3.2, rataRataPenghasilan: 5000000, tren: 'Stabil', keterangan: 'Pegawai negeri sipil' },
  { jenisPekerjaan: 'Wiraswasta', sektor: 'Swasta', jumlahPenduduk: 345, persentase: 9.0, rataRataPenghasilan: 3500000, tren: 'Meningkat', keterangan: 'Pemilik usaha dan pedagang' },
  { jenisPekerjaan: 'Buruh', sektor: 'Swasta', jumlahPenduduk: 289, persentase: 7.5, rataRataPenghasilan: 2000000, tren: 'Stabil', keterangan: 'Buruh tani dan bangunan' },
  { jenisPekerjaan: 'Guru', sektor: 'Pendidikan', jumlahPenduduk: 67, persentase: 1.7, rataRataPenghasilan: 4000000, tren: 'Stabil', keterangan: 'Guru SD, SMP, SMA' },
  { jenisPekerjaan: 'Tenaga Kesehatan', sektor: 'Kesehatan', jumlahPenduduk: 23, persentase: 0.6, rataRataPenghasilan: 4500000, tren: 'Stabil', keterangan: 'Dokter, perawat, bidan' },
  { jenisPekerjaan: 'Pedagang', sektor: 'Perdagangan', jumlahPenduduk: 156, persentase: 4.1, rataRataPenghasilan: 2800000, tren: 'Meningkat', keterangan: 'Pedagang pasar dan warung' },
  { jenisPekerjaan: 'Tukang', sektor: 'Jasa', jumlahPenduduk: 89, persentase: 2.3, rataRataPenghasilan: 2500000, tren: 'Stabil', keterangan: 'Tukang kayu, batu, las' },
  { jenisPekerjaan: 'Ibu Rumah Tangga', sektor: 'Lainnya', jumlahPenduduk: 634, persentase: 16.5, rataRataPenghasilan: 0, tren: 'Stabil', keterangan: 'Tidak bekerja' },
  { jenisPekerjaan: 'Pelajar/Mahasiswa', sektor: 'Pendidikan', jumlahPenduduk: 523, persentase: 13.6, rataRataPenghasilan: 0, tren: 'Stabil', keterangan: 'Masih sekolah' },
  { jenisPekerjaan: 'Pensiunan', sektor: 'Lainnya', jumlahPenduduk: 78, persentase: 2.0, rataRataPenghasilan: 3000000, tren: 'Stabil', keterangan: 'Sudah pensiun' },
  { jenisPekerjaan: 'Belum Bekerja', sektor: 'Lainnya', jumlahPenduduk: 211, persentase: 5.5, rataRataPenghasilan: 0, tren: 'Menurun', keterangan: 'Mencari pekerjaan' },
];

const trenData = [
  { tahun: '2020', pertanian: 920, perikanan: 410, pemerintahan: 115, swasta: 580 },
  { tahun: '2021', pertanian: 905, perikanan: 420, pemerintahan: 118, swasta: 600 },
  { tahun: '2022', pertanian: 890, perikanan: 425, pemerintahan: 120, swasta: 620 },
  { tahun: '2023', pertanian: 885, perikanan: 430, pemerintahan: 122, swasta: 640 },
  { tahun: '2024', pertanian: 876, perikanan: 432, pemerintahan: 124, swasta: 634 },
];

export default function PekerjaanPage() {
  const [data, setData] = useState<PekerjaanItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'data'>('ringkasan');

  useEffect(() => {
    let stored = pekerjaanManager.getAll();
    if (stored.length === 0) {
      pekerjaanManager.importData(defaultPekerjaan);
      stored = pekerjaanManager.getAll();
    }
    setData(stored as PekerjaanItem[]);
  }, []);

  const totalPenduduk = data.reduce((sum, item) => sum + item.jumlahPenduduk, 0);
  const pendudukBekerja = data.filter(d => d.rataRataPenghasilan > 0).reduce((sum, item) => sum + item.jumlahPenduduk, 0);
  const tingkatPengangguran = ((totalPenduduk - pendudukBekerja) / totalPenduduk * 100).toFixed(1);
  const rataRataPenghasilan = data.filter(d => d.rataRataPenghasilan > 0).reduce((sum, item) => sum + item.rataRataPenghasilan * item.jumlahPenduduk, 0) / pendudukBekerja;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const dataBySektor = data.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.sektor);
    if (existing) {
      existing.value += item.jumlahPenduduk;
    } else {
      acc.push({ name: item.sektor, value: item.jumlahPenduduk });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const columns: Column[] = [
    { key: 'jenisPekerjaan', label: 'Jenis Pekerjaan', type: 'text', required: true },
    { key: 'sektor', label: 'Sektor', type: 'select', required: true, options: [
      { value: 'Pertanian', label: 'Pertanian' },
      { value: 'Perikanan', label: 'Perikanan' },
      { value: 'Pemerintahan', label: 'Pemerintahan' },
      { value: 'Swasta', label: 'Swasta' },
      { value: 'Pendidikan', label: 'Pendidikan' },
      { value: 'Kesehatan', label: 'Kesehatan' },
      { value: 'Perdagangan', label: 'Perdagangan' },
      { value: 'Jasa', label: 'Jasa' },
      { value: 'Lainnya', label: 'Lainnya' },
    ]},
    { key: 'jumlahPenduduk', label: 'Jumlah Penduduk', type: 'number', required: true },
    { key: 'persentase', label: 'Persentase (%)', type: 'number', required: true },
    { key: 'rataRataPenghasilan', label: 'Rata-rata Penghasilan (Rp)', type: 'number', required: true, render: (val: number) => val > 0 ? formatCurrency(val) : '-' },
    { key: 'tren', label: 'Tren', type: 'select', required: true, options: [
      { value: 'Meningkat', label: 'Meningkat' },
      { value: 'Stabil', label: 'Stabil' },
      { value: 'Menurun', label: 'Menurun' },
    ], render: (val: string) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'Meningkat' ? 'bg-green-100 text-green-700' : val === 'Stabil' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
        {val}
      </span>
    )},
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-slate-800">Data Pekerjaan</h2>
        <p className="text-sm text-slate-500 mt-1">Statistik jenis pekerjaan dan sektor ekonomi penduduk</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button onClick={() => setActiveTab('ringkasan')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ringkasan' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Ringkasan
        </button>
        <button onClick={() => setActiveTab('data')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Data Pekerjaan
        </button>
      </div>

      {/* Ringkasan Tab */}
      {activeTab === 'ringkasan' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Angkatan Kerja</p>
                <Users className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-2xl font-bold text-sky-600">{pendudukBekerja.toLocaleString('id-ID')}</p>
              <p className="text-xs text-slate-400 mt-1">Penduduk yang bekerja</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Tingkat Pengangguran</p>
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">{tingkatPengangguran}%</p>
              <p className="text-xs text-slate-400 mt-1">Dari total penduduk</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Rata-rata Penghasilan</p>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(rataRataPenghasilan)}</p>
              <p className="text-xs text-slate-400 mt-1">Per bulan</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Jenis Pekerjaan</p>
                <Briefcase className="w-5 h-5 text-violet-500" />
              </div>
              <p className="text-2xl font-bold text-violet-600">{data.length}</p>
              <p className="text-xs text-slate-400 mt-1">Kategori pekerjaan</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi per Sektor</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={dataBySektor} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {dataBySektor.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">10 Pekerjaan Teratas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis dataKey="jenisPekerjaan" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" width={100} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="jumlahPenduduk" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tren Pekerjaan per Sektor (5 Tahun)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tahun" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="pertanian" stroke="#10b981" strokeWidth={2} name="Pertanian" />
                <Line type="monotone" dataKey="perikanan" stroke="#0ea5e9" strokeWidth={2} name="Perikanan" />
                <Line type="monotone" dataKey="pemerintahan" stroke="#8b5cf6" strokeWidth={2} name="Pemerintahan" />
                <Line type="monotone" dataKey="swasta" stroke="#f59e0b" strokeWidth={2} name="Swasta" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Data pekerjaan dapat ditambah, edit, dan dihapus melalui tab Data Pekerjaan.
          </div>
        </>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data pekerjaan. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Pekerjaan"
            columns={columns}
            data={data}
            onCreate={(item) => { pekerjaanManager.create(item); setData(pekerjaanManager.getAll() as PekerjaanItem[]); }}
            onUpdate={(id, item) => { pekerjaanManager.update(id, item); setData(pekerjaanManager.getAll() as PekerjaanItem[]); }}
            onDelete={(id) => { pekerjaanManager.delete(id); setData(pekerjaanManager.getAll() as PekerjaanItem[]); }}
            searchKeys={['jenisPekerjaan', 'sektor', 'keterangan']}
          />
        </>
      )}
    </div>
  );
}
