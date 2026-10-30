import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Fish, Plus, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

interface PertanianItem {
  id: number;
  komoditas: string;
  jenis: string;
  luas: number;
  produksi: number;
  produktivitas: number;
  musim: string;
  keterangan: string;
}

interface PerikananItem {
  id: number;
  komoditas: string;
  jenis: string;
  volume: number;
  nilai: number;
  metode: string;
  keterangan: string;
}

const pertanianManager = new CRUDManager<PertanianItem>('maba_pertanian');
const perikananManager = new CRUDManager<PerikananItem>('maba_perikanan');

const defaultPertanian: Omit<PertanianItem, 'id'>[] = [
  { komoditas: 'Padi', jenis: 'Tanaman Pangan', luas: 125, produksi: 625, produktivitas: 5.0, musim: '2024', keterangan: 'Varietas Ciherang' },
  { komoditas: 'Jagung', jenis: 'Tanaman Pangan', luas: 45, produksi: 180, produktivitas: 4.0, musim: '2024', keterangan: 'Varietas Bisiq 2' },
  { komoditas: 'Kelapa', jenis: 'Perkebunan', luas: 89, produksi: 267, produktivitas: 3.0, musim: '2024', keterangan: 'Kelapa dalam' },
  { komoditas: 'Kakao', jenis: 'Perkebunan', luas: 34, produksi: 51, produktivitas: 1.5, musim: '2024', keterangan: 'Kakao fermentasi' },
  { komoditas: 'Sayuran', jenis: 'Hortikultura', luas: 12, produksi: 96, produktivitas: 8.0, musim: '2024', keterangan: 'Cabai, tomat, terong' },
];

const defaultPerikanan: Omit<PerikananItem, 'id'>[] = [
  { komoditas: 'Ikan Tangkap', jenis: 'Perikanan Tangkap', volume: 234, nilai: 4680, metode: 'Tradisional', keterangan: 'Ikan laut berbagai jenis' },
  { komoditas: 'Ikan Budidaya', jenis: 'Perikanan Budidaya', volume: 45, nilai: 1350, metode: 'Tambak', keterangan: 'Ikan bandeng dan nila' },
  { komoditas: 'Rumput Laut', jenis: 'Perikanan Budidaya', volume: 78, nilai: 780, metode: 'Longline', keterangan: 'Cottonii dan Spinosum' },
  { komoditas: 'Udang', jenis: 'Perikanan Budidaya', volume: 12, nilai: 480, metode: 'Tambak', keterangan: 'Udang vaname' },
];

export default function PertanianPage() {
  const [pertanian, setPertanian] = useState<PertanianItem[]>([]);
  const [perikanan, setPerikanan] = useState<PerikananItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'pertanian' | 'perikanan'>('ringkasan');

  useEffect(() => {
    let storedPertanian = pertanianManager.getAll();
    if (storedPertanian.length === 0) {
      pertanianManager.importData(defaultPertanian);
      storedPertanian = pertanianManager.getAll();
    }
    setPertanian(storedPertanian as PertanianItem[]);

    let storedPerikanan = perikananManager.getAll();
    if (storedPerikanan.length === 0) {
      perikananManager.importData(defaultPerikanan);
      storedPerikanan = perikananManager.getAll();
    }
    setPerikanan(storedPerikanan as PerikananItem[]);
  }, []);

  const totalLuasPertanian = pertanian.reduce((sum, item) => sum + item.luas, 0);
  const totalProduksiPertanian = pertanian.reduce((sum, item) => sum + item.produksi, 0);
  const totalVolumePerikanan = perikanan.reduce((sum, item) => sum + item.volume, 0);
  const totalNilaiPerikanan = perikanan.reduce((sum, item) => sum + item.nilai, 0);

  const formatNumber = (value: number) => value.toLocaleString('id-ID');
  const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')} Jt`;

  const pertanianColumns: Column[] = [
    { key: 'komoditas', label: 'Komoditas', type: 'text', required: true },
    { key: 'jenis', label: 'Jenis', type: 'select', required: true, options: [
      { value: 'Tanaman Pangan', label: 'Tanaman Pangan' },
      { value: 'Perkebunan', label: 'Perkebunan' },
      { value: 'Hortikultura', label: 'Hortikultura' },
    ]},
    { key: 'luas', label: 'Luas (Ha)', type: 'number', required: true },
    { key: 'produksi', label: 'Produksi (Ton)', type: 'number', required: true },
    { key: 'produktivitas', label: 'Produktivitas (Ton/Ha)', type: 'number', required: true },
    { key: 'musim', label: 'Musim/Tahun', type: 'text', required: true },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ];

  const perikananColumns: Column[] = [
    { key: 'komoditas', label: 'Komoditas', type: 'text', required: true },
    { key: 'jenis', label: 'Jenis', type: 'select', required: true, options: [
      { value: 'Perikanan Tangkap', label: 'Perikanan Tangkap' },
      { value: 'Perikanan Budidaya', label: 'Perikanan Budidaya' },
    ]},
    { key: 'volume', label: 'Volume (Ton)', type: 'number', required: true },
    { key: 'nilai', label: 'Nilai (Juta Rp)', type: 'number', required: true },
    { key: 'metode', label: 'Metode', type: 'text', required: true },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-slate-800">Data Pertanian & Perikanan</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola data sektor pertanian dan perikanan desa</p>
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
          onClick={() => setActiveTab('pertanian')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pertanian' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pertanian
        </button>
        <button
          onClick={() => setActiveTab('perikanan')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'perikanan' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Perikanan
        </button>
      </div>

      {/* Ringkasan Tab */}
      {activeTab === 'ringkasan' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Luas Pertanian</p>
                <Sprout className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">{formatNumber(totalLuasPertanian)} Ha</p>
              <p className="text-xs text-slate-400 mt-1">{pertanian.length} komoditas</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Produksi Pertanian</p>
                <Sprout className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatNumber(totalProduksiPertanian)} Ton</p>
              <p className="text-xs text-slate-400 mt-1">Tahun 2024</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Volume Perikanan</p>
                <Fish className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(totalVolumePerikanan)} Ton</p>
              <p className="text-xs text-slate-400 mt-1">{perikanan.length} komoditas</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Nilai Ekonomi Perikanan</p>
                <Fish className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-2xl font-bold text-cyan-600">{formatCurrency(totalNilaiPerikanan)}</p>
              <p className="text-xs text-slate-400 mt-1">Tahun 2024</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Produksi Pertanian per Komoditas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pertanian}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="komoditas" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="produksi" fill="#10b981" name="Produksi (Ton)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Volume Perikanan per Komoditas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={perikanan}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="komoditas" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="volume" fill="#0ea5e9" name="Volume (Ton)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Data pertanian dan perikanan dapat ditambah, edit, dan dihapus melalui tab Pertanian dan Perikanan.
          </div>
        </>
      )}

      {/* Pertanian Tab */}
      {activeTab === 'pertanian' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data pertanian. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Pertanian"
            columns={pertanianColumns}
            data={pertanian}
            onCreate={(item) => { pertanianManager.create(item); setPertanian(pertanianManager.getAll() as PertanianItem[]); }}
            onUpdate={(id, item) => { pertanianManager.update(id, item); setPertanian(pertanianManager.getAll() as PertanianItem[]); }}
            onDelete={(id) => { pertanianManager.delete(id); setPertanian(pertanianManager.getAll() as PertanianItem[]); }}
            searchKeys={['komoditas', 'jenis', 'keterangan']}
          />
        </>
      )}

      {/* Perikanan Tab */}
      {activeTab === 'perikanan' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data perikanan. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Perikanan"
            columns={perikananColumns}
            data={perikanan}
            onCreate={(item) => { perikananManager.create(item); setPerikanan(perikananManager.getAll() as PerikananItem[]); }}
            onUpdate={(id, item) => { perikananManager.update(id, item); setPerikanan(perikananManager.getAll() as PerikananItem[]); }}
            onDelete={(id) => { perikananManager.delete(id); setPerikanan(perikananManager.getAll() as PerikananItem[]); }}
            searchKeys={['komoditas', 'jenis', 'metode', 'keterangan']}
          />
        </>
      )}
    </div>
  );
}
