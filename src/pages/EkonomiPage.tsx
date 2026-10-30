import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

interface PendapatanItem {
  id: number;
  sumber: string;
  kategori: string;
  jumlah: number;
  periode: string;
  keterangan: string;
}

interface PengeluaranItem {
  id: number;
  pos: string;
  kategori: string;
  jumlah: number;
  periode: string;
  keterangan: string;
}

const pendapatanManager = new CRUDManager<PendapatanItem>('maba_pendapatan');
const pengeluaranManager = new CRUDManager<PengeluaranItem>('maba_pengeluaran');

const defaultPendapatan: Omit<PendapatanItem, 'id'>[] = [
  { sumber: 'Dana Desa', kategori: 'Transfer', jumlah: 1200000000, periode: '2024', keterangan: 'Dana desa dari APBN' },
  { sumber: 'Alokasi Dana Desa', kategori: 'Transfer', jumlah: 800000000, periode: '2024', keterangan: 'ADD dari Kabupaten' },
  { sumber: 'Pendapatan Asli Desa', kategori: 'PADes', jumlah: 150000000, periode: '2024', keterangan: 'Retribusi dan sewa' },
  { sumber: 'Bagi Hasil Pajak', kategori: 'Transfer', jumlah: 200000000, periode: '2024', keterangan: 'Bagi hasil pajak kabupaten' },
  { sumber: 'Bantuan Keuangan', kategori: 'Bantuan', jumlah: 100000000, periode: '2024', keterangan: 'Bantuan dari provinsi' },
];

const defaultPengeluaran: Omit<PengeluaranItem, 'id'>[] = [
  { pos: 'Penyelenggaraan Pemerintahan', kategori: 'Operasional', jumlah: 450000000, periode: '2024', keterangan: 'Gaji perangkat desa dan operasional' },
  { pos: 'Pembangunan Infrastruktur', kategori: 'Pembangunan', jumlah: 800000000, periode: '2024', keterangan: 'Jalan, jembatan, irigasi' },
  { pos: 'Pemberdayaan Masyarakat', kategori: 'Pemberdayaan', jumlah: 300000000, periode: '2024', keterangan: 'Pelatihan dan kelompok usaha' },
  { pos: 'Pembinaan Kemasyarakatan', kategori: 'Sosial', jumlah: 200000000, periode: '2024', keterangan: 'Kegiatan sosial dan keagamaan' },
  { pos: 'Penanggulangan Bencana', kategori: 'Darurat', jumlah: 100000000, periode: '2024', keterangan: 'Dana darurat dan bantuan' },
];

const trenData = [
  { tahun: '2020', pendapatan: 1800, pengeluaran: 1650 },
  { tahun: '2021', pendapatan: 2100, pengeluaran: 1950 },
  { tahun: '2022', pendapatan: 2300, pengeluaran: 2150 },
  { tahun: '2023', pendapatan: 2400, pengeluaran: 2280 },
  { tahun: '2024', pendapatan: 2450, pengeluaran: 1850 },
];

export default function EkonomiPage() {
  const [pendapatan, setPendapatan] = useState<PendapatanItem[]>([]);
  const [pengeluaran, setPengeluaran] = useState<PengeluaranItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'pendapatan' | 'pengeluaran'>('ringkasan');

  useEffect(() => {
    let storedPendapatan = pendapatanManager.getAll();
    if (storedPendapatan.length === 0) {
      pendapatanManager.importData(defaultPendapatan);
      storedPendapatan = pendapatanManager.getAll();
    }
    setPendapatan(storedPendapatan as PendapatanItem[]);

    let storedPengeluaran = pengeluaranManager.getAll();
    if (storedPengeluaran.length === 0) {
      pengeluaranManager.importData(defaultPengeluaran);
      storedPengeluaran = pengeluaranManager.getAll();
    }
    setPengeluaran(storedPengeluaran as PengeluaranItem[]);
  }, []);

  const totalPendapatan = pendapatan.reduce((sum, item) => sum + item.jumlah, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);
  const saldo = totalPendapatan - totalPengeluaran;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)} M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)} Jt`;
    return formatCurrency(value);
  };

  const pendapatanByKategori = pendapatan.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.kategori);
    if (existing) {
      existing.value += item.jumlah;
    } else {
      acc.push({ name: item.kategori, value: item.jumlah });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const pengeluaranByKategori = pengeluaran.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.kategori);
    if (existing) {
      existing.value += item.jumlah;
    } else {
      acc.push({ name: item.kategori, value: item.jumlah });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const pendapatanColumns: Column[] = [
    { key: 'sumber', label: 'Sumber Pendapatan', type: 'text', required: true },
    { key: 'kategori', label: 'Kategori', type: 'select', required: true, options: [
      { value: 'Transfer', label: 'Transfer' },
      { value: 'PADes', label: 'Pendapatan Asli Desa' },
      { value: 'Bantuan', label: 'Bantuan' },
      { value: 'Lainnya', label: 'Lainnya' },
    ]},
    { key: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true, render: (val: number) => formatShortCurrency(val) },
    { key: 'periode', label: 'Periode', type: 'text', required: true },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ];

  const pengeluaranColumns: Column[] = [
    { key: 'pos', label: 'Pos Pengeluaran', type: 'text', required: true },
    { key: 'kategori', label: 'Kategori', type: 'select', required: true, options: [
      { value: 'Operasional', label: 'Operasional' },
      { value: 'Pembangunan', label: 'Pembangunan' },
      { value: 'Pemberdayaan', label: 'Pemberdayaan' },
      { value: 'Sosial', label: 'Sosial' },
      { value: 'Darurat', label: 'Darurat' },
    ]},
    { key: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true, render: (val: number) => formatShortCurrency(val) },
    { key: 'periode', label: 'Periode', type: 'text', required: true },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-slate-800">Data Ekonomi Desa</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola pendapatan dan pengeluaran desa</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ringkasan' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('pendapatan')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pendapatan' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pendapatan
        </button>
        <button
          onClick={() => setActiveTab('pengeluaran')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pengeluaran' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Ringkasan Tab */}
      {activeTab === 'ringkasan' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Pendapatan</p>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">{formatShortCurrency(totalPendapatan)}</p>
              <p className="text-xs text-slate-400 mt-1">Tahun 2024</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Pengeluaran</p>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">{formatShortCurrency(totalPengeluaran)}</p>
              <p className="text-xs text-slate-400 mt-1">Tahun 2024</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Saldo</p>
                <DollarSign className="w-5 h-5 text-sky-500" />
              </div>
              <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-sky-600' : 'text-red-600'}`}>{formatShortCurrency(saldo)}</p>
              <p className="text-xs text-slate-400 mt-1">Sisa anggaran</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Pendapatan per Kategori</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pendapatanByKategori} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pendapatanByKategori.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatShortCurrency(value)} contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Pengeluaran per Kategori</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pengeluaranByKategori} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pengeluaranByKategori.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatShortCurrency(value)} contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Trend Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tren Keuangan Desa (5 Tahun Terakhir)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tahun" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip formatter={(value: number) => `Rp ${value} Jt`} contentStyle={{ borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="pendapatan" stroke="#10b981" strokeWidth={3} name="Pendapatan (Jt)" />
                <Line type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={3} name="Pengeluaran (Jt)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Data keuangan dapat ditambah, edit, dan dihapus melalui tab Pendapatan dan Pengeluaran.
          </div>
        </>
      )}

      {/* Pendapatan Tab */}
      {activeTab === 'pendapatan' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data pendapatan desa. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Pendapatan Desa"
            columns={pendapatanColumns}
            data={pendapatan}
            onCreate={(item) => { pendapatanManager.create(item); setPendapatan(pendapatanManager.getAll() as PendapatanItem[]); }}
            onUpdate={(id, item) => { pendapatanManager.update(id, item); setPendapatan(pendapatanManager.getAll() as PendapatanItem[]); }}
            onDelete={(id) => { pendapatanManager.delete(id); setPendapatan(pendapatanManager.getAll() as PendapatanItem[]); }}
            searchKeys={['sumber', 'kategori', 'keterangan']}
          />
        </>
      )}

      {/* Pengeluaran Tab */}
      {activeTab === 'pengeluaran' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data pengeluaran desa. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Pengeluaran Desa"
            columns={pengeluaranColumns}
            data={pengeluaran}
            onCreate={(item) => { pengeluaranManager.create(item); setPengeluaran(pengeluaranManager.getAll() as PengeluaranItem[]); }}
            onUpdate={(id, item) => { pengeluaranManager.update(id, item); setPengeluaran(pengeluaranManager.getAll() as PengeluaranItem[]); }}
            onDelete={(id) => { pengeluaranManager.delete(id); setPengeluaran(pengeluaranManager.getAll() as PengeluaranItem[]); }}
            searchKeys={['pos', 'kategori', 'keterangan']}
          />
        </>
      )}
    </div>
  );
}
