import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Activity, Pill } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

interface KesehatanItem {
  id: number;
  jenisPenyakit: string;
  kategori: string;
  jumlahKasus: number;
  persentase: number;
  tren: string;
  tindakan: string;
  keterangan: string;
}

const kesehatanManager = new CRUDManager<KesehatanItem>('maba_kesehatan');

const defaultKesehatan: Omit<KesehatanItem, 'id'>[] = [
  { jenisPenyakit: 'ISPA (Infeksi Saluran Pernapasan)', kategori: 'Penyakit Menular', jumlahKasus: 234, persentase: 18.5, tren: 'Menurun', tindakan: 'Pemberian obat dan edukasi', keterangan: 'Infeksi saluran pernapasan atas' },
  { jenisPenyakit: 'Diare', kategori: 'Penyakit Menular', jumlahKasus: 156, persentase: 12.3, tren: 'Stabil', tindakan: 'Rehidrasi dan sanitasi', keterangan: 'Penyakit diare akut' },
  { jenisPenyakit: 'Hipertensi', kategori: 'Penyakit Tidak Menular', jumlahKasus: 189, persentase: 14.9, tren: 'Meningkat', tindakan: 'Pengobatan rutin dan diet', keterangan: 'Tekanan darah tinggi' },
  { jenisPenyakit: 'Diabetes Melitus', kategori: 'Penyakit Tidak Menular', jumlahKasus: 87, persentase: 6.9, tren: 'Meningkat', tindakan: 'Kontrol gula darah dan diet', keterangan: 'Kencing manis' },
  { jenisPenyakit: 'Demam Berdarah (DBD)', kategori: 'Penyakit Menular', jumlahKasus: 45, persentase: 3.6, tren: 'Menurun', tindakan: 'Fogging dan PSN', keterangan: 'Demam berdarah dengue' },
  { jenisPenyakit: 'Malaria', kategori: 'Penyakit Menular', jumlahKasus: 34, persentase: 2.7, tren: 'Menurun', tindakan: 'Pengobatan dan kelambu', keterangan: 'Penyakit malaria' },
  { jenisPenyakit: 'Gizi Buruk', kategori: 'Gizi', jumlahKasus: 23, persentase: 1.8, tren: 'Menurun', tindakan: 'Pemberian PMT dan monitoring', keterangan: 'Kurang gizi pada balita' },
  { jenisPenyakit: 'Gigi dan Mulut', kategori: 'Penyakit Lainnya', jumlahKasus: 178, persentase: 14.1, tren: 'Stabil', tindakan: 'Pencabutan dan penambalan', keterangan: 'Masalah kesehatan gigi' },
  { jenisPenyakit: 'Skin Disease', kategori: 'Penyakit Lainnya', jumlahKasus: 134, persentase: 10.6, tren: 'Stabil', tindakan: 'Pengobatan topikal', keterangan: 'Penyakit kulit' },
  { jenisPenyakit: 'Asma', kategori: 'Penyakit Tidak Menular', jumlahKasus: 67, persentase: 5.3, tren: 'Stabil', tindakan: 'Inhaler dan menghindari pemicu', keterangan: 'Penyakit asma' },
  { jenisPenyakit: 'Tuberculosis (TBC)', kategori: 'Penyakit Menular', jumlahKasus: 28, persentase: 2.2, tren: 'Menurun', tindakan: 'Pengobatan 6 bulan', keterangan: 'Penyakit TBC paru' },
  { jenisPenyakit: 'Kecacingan', kategori: 'Penyakit Menular', jumlahKasus: 89, persentase: 7.0, tren: 'Menurun', tindakan: 'Pemberian obat cacing', keterangan: 'Infeksi cacing pada anak' },
];

const fasilitasKesehatan = [
  { nama: 'Puskesmas Maba', tipe: 'Puskesmas', alamat: 'Dusun 1', status: 'Aktif' },
  { nama: 'Pustu Dusun 2', tipe: 'Puskesmas Pembantu', alamat: 'Dusun 2', status: 'Aktif' },
  { nama: 'Pustu Dusun 3', tipe: 'Puskesmas Pembantu', alamat: 'Dusun 3', status: 'Aktif' },
  { nama: 'Posyandu Melati', tipe: 'Posyandu', alamat: 'Dusun 1', status: 'Aktif' },
  { nama: 'Posyandu Mawar', tipe: 'Posyandu', alamat: 'Dusun 2', status: 'Aktif' },
  { nama: 'Posyandu Dahlia', tipe: 'Posyandu', alamat: 'Dusun 3', status: 'Aktif' },
  { nama: 'Posyandu Kenanga', tipe: 'Posyandu', alamat: 'Dusun 4', status: 'Aktif' },
];

export default function KesehatanPage() {
  const [data, setData] = useState<KesehatanItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'data' | 'fasilitas'>('ringkasan');

  useEffect(() => {
    let stored = kesehatanManager.getAll();
    if (stored.length === 0) {
      kesehatanManager.importData(defaultKesehatan);
      stored = kesehatanManager.getAll();
    }
    setData(stored as KesehatanItem[]);
  }, []);

  const totalKasus = data.reduce((sum, item) => sum + item.jumlahKasus, 0);
  const penyakitMenular = data.filter(d => d.kategori === 'Penyakit Menular').reduce((sum, item) => sum + item.jumlahKasus, 0);
  const penyakitTidakMenular = data.filter(d => d.kategori === 'Penyakit Tidak Menular').reduce((sum, item) => sum + item.jumlahKasus, 0);

  const dataByKategori = data.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.kategori);
    if (existing) {
      existing.value += item.jumlahKasus;
    } else {
      acc.push({ name: item.kategori, value: item.jumlahKasus });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const columns: Column[] = [
    { key: 'jenisPenyakit', label: 'Jenis Penyakit', type: 'text', required: true },
    { key: 'kategori', label: 'Kategori', type: 'select', required: true, options: [
      { value: 'Penyakit Menular', label: 'Penyakit Menular' },
      { value: 'Penyakit Tidak Menular', label: 'Penyakit Tidak Menular' },
      { value: 'Gizi', label: 'Gizi' },
      { value: 'Penyakit Lainnya', label: 'Penyakit Lainnya' },
    ]},
    { key: 'jumlahKasus', label: 'Jumlah Kasus', type: 'number', required: true },
    { key: 'persentase', label: 'Persentase (%)', type: 'number', required: true },
    { key: 'tren', label: 'Tren', type: 'select', required: true, options: [
      { value: 'Meningkat', label: 'Meningkat' },
      { value: 'Stabil', label: 'Stabil' },
      { value: 'Menurun', label: 'Menurun' },
    ], render: (val: string) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'Meningkat' ? 'bg-red-100 text-red-700' : val === 'Stabil' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
        {val}
      </span>
    )},
    { key: 'tindakan', label: 'Tindakan', type: 'textarea', required: true },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-slate-800">Data Kesehatan</h2>
        <p className="text-sm text-slate-500 mt-1">Statistik penyakit dan fasilitas kesehatan desa</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button onClick={() => setActiveTab('ringkasan')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ringkasan' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Ringkasan
        </button>
        <button onClick={() => setActiveTab('data')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Data Penyakit
        </button>
        <button onClick={() => setActiveTab('fasilitas')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'fasilitas' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Fasilitas Kesehatan
        </button>
      </div>

      {/* Ringkasan Tab */}
      {activeTab === 'ringkasan' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Total Kasus</p>
                <Activity className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-2xl font-bold text-sky-600">{totalKasus.toLocaleString('id-ID')}</p>
              <p className="text-xs text-slate-400 mt-1">{data.length} jenis penyakit</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Penyakit Menular</p>
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">{penyakitMenular.toLocaleString('id-ID')}</p>
              <p className="text-xs text-slate-400 mt-1">Kasus penyakit menular</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Penyakit Tidak Menular</p>
                <Pill className="w-5 h-5 text-violet-500" />
              </div>
              <p className="text-2xl font-bold text-violet-600">{penyakitTidakMenular.toLocaleString('id-ID')}</p>
              <p className="text-xs text-slate-400 mt-1">Kasus PTM</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Fasilitas Kesehatan</p>
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{fasilitasKesehatan.length}</p>
              <p className="text-xs text-slate-400 mt-1">Unit layanan kesehatan</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi per Kategori</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={dataByKategori} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {dataByKategori.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">10 Penyakit Terbanyak</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis dataKey="jenisPenyakit" type="category" tick={{ fontSize: 9 }} stroke="#94a3b8" width={150} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="jumlahKasus" fill="#ef4444" radius={[0, 4, 4, 0]} name="Jumlah Kasus" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Data penyakit dapat ditambah, edit, dan dihapus melalui tab Data Penyakit.
          </div>
        </>
      )}

      {/* Data Penyakit Tab */}
      {activeTab === 'data' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data penyakit. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Penyakit"
            columns={columns}
            data={data}
            onCreate={(item) => { kesehatanManager.create(item); setData(kesehatanManager.getAll() as KesehatanItem[]); }}
            onUpdate={(id, item) => { kesehatanManager.update(id, item); setData(kesehatanManager.getAll() as KesehatanItem[]); }}
            onDelete={(id) => { kesehatanManager.delete(id); setData(kesehatanManager.getAll() as KesehatanItem[]); }}
            searchKeys={['jenisPenyakit', 'kategori', 'tindakan', 'keterangan']}
          />
        </>
      )}

      {/* Fasilitas Kesehatan Tab */}
      {activeTab === 'fasilitas' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Fasilitas Kesehatan Desa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Nama Fasilitas</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Tipe</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Alamat</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {fasilitasKesehatan.map((fas, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-700">{fas.nama}</td>
                    <td className="py-3 px-3 text-slate-600">{fas.tipe}</td>
                    <td className="py-3 px-3 text-slate-600">{fas.alamat}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{fas.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200">
            <p className="text-xs text-sky-700">💡 Fasilitas kesehatan dapat dilihat lebih detail di Peta Digital dengan marker kategori "Fasilitas Kesehatan"</p>
          </div>
        </div>
      )}
    </div>
  );
}
