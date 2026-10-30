import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Users, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

interface BantuanItem {
  id: number;
  jenisBantuan: string;
  kategori: string;
  jumlahPenerima: number;
  nilaiPerPenerima: number;
  totalNilai: number;
  periode: string;
  sumber: string;
  status: string;
  keterangan: string;
}

const bantuanManager = new CRUDManager<BantuanItem>('maba_bantuan');

const defaultBantuan: Omit<BantuanItem, 'id'>[] = [
  { jenisBantuan: 'Program Keluarga Harapan (PKH)', kategori: 'Tunai', jumlahPenerima: 156, nilaiPerPenerima: 2400000, totalNilai: 374400000, periode: '2024', sumber: 'Kemensos', status: 'Aktif', keterangan: 'Bantuan tunai untuk keluarga miskin' },
  { jenisBantuan: 'Bantuan Pangan Non Tunai (BPNT)', kategori: 'Pangan', jumlahPenerima: 234, nilaiPerPenerima: 600000, totalNilai: 140400000, periode: '2024', sumber: 'Kemensos', status: 'Aktif', keterangan: 'Bantuan pangan via e-warong' },
  { jenisBantuan: 'BLT Dana Desa', kategori: 'Tunai', jumlahPenerima: 189, nilaiPerPenerima: 600000, totalNilai: 113400000, periode: '2024', sumber: 'Dana Desa', status: 'Aktif', keterangan: 'Bantuan langsung tunai dari dana desa' },
  { jenisBantuan: 'Bantuan Sosial Tunai (BST)', kategori: 'Tunai', jumlahPenerima: 312, nilaiPerPenerima: 600000, totalNilai: 187200000, periode: '2024', sumber: 'Kemensos', status: 'Aktif', keterangan: 'Bantuan sosial tunai' },
  { jenisBantuan: 'Bantuan Lansia', kategori: 'Tunai', jumlahPenerima: 78, nilaiPerPenerima: 240000, totalNilai: 18720000, periode: '2024', sumber: 'Pemda', status: 'Aktif', keterangan: 'Bantuan untuk lansia terlantar' },
  { jenisBantuan: 'Bantuan Disabilitas', kategori: 'Tunai', jumlahPenerima: 34, nilaiPerPenerima: 240000, totalNilai: 8160000, periode: '2024', sumber: 'Pemda', status: 'Aktif', keterangan: 'Bantuan untuk penyandang disabilitas' },
  { jenisBantuan: 'Bantuan Pendidikan', kategori: 'Pendidikan', jumlahPenerima: 89, nilaiPerPenerima: 1000000, totalNilai: 89000000, periode: '2024', sumber: 'Dana Desa', status: 'Aktif', keterangan: 'Beasiswa untuk siswa kurang mampu' },
  { jenisBantuan: 'Bantuan Kesehatan', kategori: 'Kesehatan', jumlahPenerima: 45, nilaiPerPenerima: 500000, totalNilai: 22500000, periode: '2024', sumber: 'Dana Desa', status: 'Aktif', keterangan: 'Bantuan biaya pengobatan' },
];

export default function BantuanPage() {
  const [data, setData] = useState<BantuanItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'data'>('ringkasan');

  useEffect(() => {
    let stored = bantuanManager.getAll();
    if (stored.length === 0) {
      bantuanManager.importData(defaultBantuan);
      stored = bantuanManager.getAll();
    }
    setData(stored as BantuanItem[]);
  }, []);

  const totalPenerima = data.reduce((sum, item) => sum + item.jumlahPenerima, 0);
  const totalNilai = data.reduce((sum, item) => sum + item.totalNilai, 0);
  const rataRataPerPenerima = totalPenerima > 0 ? totalNilai / totalPenerima : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)} M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)} Jt`;
    return formatCurrency(value);
  };

  const dataByKategori = data.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.kategori);
    if (existing) {
      existing.value += item.totalNilai;
    } else {
      acc.push({ name: item.kategori, value: item.totalNilai });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const columns: Column[] = [
    { key: 'jenisBantuan', label: 'Jenis Bantuan', type: 'text', required: true },
    { key: 'kategori', label: 'Kategori', type: 'select', required: true, options: [
      { value: 'Tunai', label: 'Tunai' },
      { value: 'Pangan', label: 'Pangan' },
      { value: 'Pendidikan', label: 'Pendidikan' },
      { value: 'Kesehatan', label: 'Kesehatan' },
    ]},
    { key: 'jumlahPenerima', label: 'Jumlah Penerima', type: 'number', required: true },
    { key: 'nilaiPerPenerima', label: 'Nilai per Penerima (Rp)', type: 'number', required: true, render: (val: number) => formatShortCurrency(val) },
    { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'number', required: true, render: (val: number) => formatShortCurrency(val) },
    { key: 'periode', label: 'Periode', type: 'text', required: true },
    { key: 'sumber', label: 'Sumber Dana', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', required: true, options: [
      { value: 'Aktif', label: 'Aktif' },
      { value: 'Selesai', label: 'Selesai' },
      { value: 'Ditunda', label: 'Ditunda' },
    ], render: (val: string) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'Aktif' ? 'bg-green-100 text-green-700' : val === 'Selesai' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
        {val}
      </span>
    )},
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-slate-800">Data Bantuan Sosial</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola data bantuan sosial untuk masyarakat desa</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button onClick={() => setActiveTab('ringkasan')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ringkasan' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Ringkasan
        </button>
        <button onClick={() => setActiveTab('data')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Data Bantuan
        </button>
      </div>

      {/* Ringkasan Tab */}
      {activeTab === 'ringkasan' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Penerima</p>
                <Users className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-2xl font-bold text-sky-600">{totalPenerima.toLocaleString('id-ID')}</p>
              <p className="text-xs text-slate-400 mt-1">{data.length} program bantuan</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Nilai Bantuan</p>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatShortCurrency(totalNilai)}</p>
              <p className="text-xs text-slate-400 mt-1">Tahun 2024</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Rata-rata per Penerima</p>
                <TrendingUp className="w-5 h-5 text-violet-500" />
              </div>
              <p className="text-2xl font-bold text-violet-600">{formatShortCurrency(rataRataPerPenerima)}</p>
              <p className="text-xs text-slate-400 mt-1">Per orang per tahun</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Bantuan Aktif</p>
                <HeartHandshake className="w-5 h-5 text-pink-500" />
              </div>
              <p className="text-2xl font-bold text-pink-600">{data.filter(d => d.status === 'Aktif').length}</p>
              <p className="text-xs text-slate-400 mt-1">Program berjalan</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Bantuan per Kategori</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={dataByKategori} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {dataByKategori.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatShortCurrency(value)} contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Jumlah Penerima per Program</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="jenisBantuan" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-30} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="jumlahPenerima" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Jumlah Penerima" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Data bantuan sosial dapat ditambah, edit, dan dihapus melalui tab Data Bantuan.
          </div>
        </>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data bantuan sosial. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Bantuan Sosial"
            columns={columns}
            data={data}
            onCreate={(item) => { bantuanManager.create(item); setData(bantuanManager.getAll() as BantuanItem[]); }}
            onUpdate={(id, item) => { bantuanManager.update(id, item); setData(bantuanManager.getAll() as BantuanItem[]); }}
            onDelete={(id) => { bantuanManager.delete(id); setData(bantuanManager.getAll() as BantuanItem[]); }}
            searchKeys={['jenisBantuan', 'kategori', 'sumber', 'keterangan']}
          />
        </>
      )}
    </div>
  );
}
