import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, School, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

interface PendidikanItem {
  id: number;
  tingkatPendidikan: string;
  jenjang: string;
  jumlahPenduduk: number;
  persentase: number;
  lakiLaki: number;
  perempuan: number;
  tren: string;
  keterangan: string;
}

const pendidikanManager = new CRUDManager<PendidikanItem>('maba_pendidikan');

const defaultPendidikan: Omit<PendidikanItem, 'id'>[] = [
  { tingkatPendidikan: 'Tidak/Belum Sekolah', jenjang: 'Tidak Sekolah', jumlahPenduduk: 234, persentase: 6.1, lakiLaki: 112, perempuan: 122, tren: 'Menurun', keterangan: 'Penduduk yang tidak/belum pernah sekolah' },
  { tingkatPendidikan: 'SD/Sederajat', jenjang: 'Dasar', jumlahPenduduk: 1245, persentase: 32.4, lakiLaki: 634, perempuan: 611, tren: 'Menurun', keterangan: 'Tamat SD/MI/sederajat' },
  { tingkatPendidikan: 'SMP/Sederajat', jenjang: 'Menengah Pertama', jumlahPenduduk: 892, persentase: 23.2, lakiLaki: 445, perempuan: 447, tren: 'Stabil', keterangan: 'Tamat SMP/MTs/sederajat' },
  { tingkatPendidikan: 'SMA/Sederajat', jenjang: 'Menengah Atas', jumlahPenduduk: 987, persentase: 25.7, lakiLaki: 478, perempuan: 509, tren: 'Meningkat', keterangan: 'Tamat SMA/SMK/MA/sederajat' },
  { tingkatPendidikan: 'D1/D2/D3', jenjang: 'Diploma', jumlahPenduduk: 156, persentase: 4.1, lakiLaki: 72, perempuan: 84, tren: 'Meningkat', keterangan: 'Tamat Diploma 1/2/3' },
  { tingkatPendidikan: 'S1', jenjang: 'Sarjana', jumlahPenduduk: 234, persentase: 6.1, lakiLaki: 118, perempuan: 116, tren: 'Meningkat', keterangan: 'Tamat Strata 1' },
  { tingkatPendidikan: 'S2', jenjang: 'Pascasarjana', jumlahPenduduk: 18, persentase: 0.5, lakiLaki: 10, perempuan: 8, tren: 'Meningkat', keterangan: 'Tamat Strata 2' },
  { tingkatPendidikan: 'S3', jenjang: 'Pascasarjana', jumlahPenduduk: 5, persentase: 0.1, lakiLaki: 3, perempuan: 2, tren: 'Stabil', keterangan: 'Tamat Strata 3' },
];

const fasilitasPendidikan = [
  { nama: 'PAUD Tunas Bangsa', tipe: 'PAUD', alamat: 'Dusun 1', status: 'Aktif', siswa: 45 },
  { nama: 'PAUD Bintang Kecil', tipe: 'PAUD', alamat: 'Dusun 2', status: 'Aktif', siswa: 38 },
  { nama: 'PAUD Pelangi', tipe: 'PAUD', alamat: 'Dusun 3', status: 'Aktif', siswa: 42 },
  { nama: 'SD Negeri Maba Sangaji', tipe: 'SD', alamat: 'Dusun 1', status: 'Aktif', siswa: 156 },
  { nama: 'SD Negeri 2 Maba', tipe: 'SD', alamat: 'Dusun 2', status: 'Aktif', siswa: 134 },
  { nama: 'SD Negeri 3 Maba', tipe: 'SD', alamat: 'Dusun 3', status: 'Aktif', siswa: 128 },
  { nama: 'SMP Negeri Maba', tipe: 'SMP', alamat: 'Dusun 1', status: 'Aktif', siswa: 234 },
  { nama: 'SMP Swasta Maba', tipe: 'SMP', alamat: 'Dusun 2', status: 'Aktif', siswa: 89 },
  { nama: 'SMA Negeri Maba', tipe: 'SMA', alamat: 'Dusun 1', status: 'Aktif', siswa: 178 },
  { nama: 'Perpustakaan Desa', tipe: 'Perpustakaan', alamat: 'Kantor Desa', status: 'Aktif', siswa: 0 },
];

const trenData = [
  { tahun: '2020', tidakSekolah: 280, sd: 1320, smp: 820, sma: 890, perguruanTinggi: 280 },
  { tahun: '2021', tidakSekolah: 265, sd: 1290, smp: 850, sma: 920, perguruanTinggi: 310 },
  { tahun: '2022', tidakSekolah: 250, sd: 1270, smp: 870, sma: 950, perguruanTinggi: 340 },
  { tahun: '2023', tidakSekolah: 240, sd: 1255, smp: 880, sma: 970, perguruanTinggi: 370 },
  { tahun: '2024', tidakSekolah: 234, sd: 1245, smp: 892, sma: 987, perguruanTinggi: 413 },
];

export default function PendidikanPage() {
  const [data, setData] = useState<PendidikanItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'data' | 'fasilitas'>('ringkasan');

  useEffect(() => {
    let stored = pendidikanManager.getAll();
    if (stored.length === 0) {
      pendidikanManager.importData(defaultPendidikan);
      stored = pendidikanManager.getAll();
    }
    setData(stored as PendidikanItem[]);
  }, []);

  const totalPenduduk = data.reduce((sum, item) => sum + item.jumlahPenduduk, 0);
  const totalLakiLaki = data.reduce((sum, item) => sum + item.lakiLaki, 0);
  const totalPerempuan = data.reduce((sum, item) => sum + item.perempuan, 0);
  const tidakSekolah = data.find(d => d.jenjang === 'Tidak Sekolah')?.jumlahPenduduk || 0;
  const wajibBelajar = data.filter(d => ['Dasar', 'Menengah Pertama', 'Menengah Atas'].includes(d.jenjang)).reduce((sum, item) => sum + item.jumlahPenduduk, 0);
  const perguruanTinggi = data.filter(d => ['Diploma', 'Sarjana', 'Pascasarjana'].includes(d.jenjang)).reduce((sum, item) => sum + item.jumlahPenduduk, 0);
  const angkaMelekHuruf = ((totalPenduduk - tidakSekolah) / totalPenduduk * 100).toFixed(1);

  const dataByJenjang = data.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.jenjang);
    if (existing) {
      existing.value += item.jumlahPenduduk;
    } else {
      acc.push({ name: item.jenjang, value: item.jumlahPenduduk });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const columns: Column[] = [
    { key: 'tingkatPendidikan', label: 'Tingkat Pendidikan', type: 'text', required: true },
    { key: 'jenjang', label: 'Jenjang', type: 'select', required: true, options: [
      { value: 'Tidak Sekolah', label: 'Tidak Sekolah' },
      { value: 'Dasar', label: 'Dasar' },
      { value: 'Menengah Pertama', label: 'Menengah Pertama' },
      { value: 'Menengah Atas', label: 'Menengah Atas' },
      { value: 'Diploma', label: 'Diploma' },
      { value: 'Sarjana', label: 'Sarjana' },
      { value: 'Pascasarjana', label: 'Pascasarjana' },
    ]},
    { key: 'jumlahPenduduk', label: 'Jumlah Penduduk', type: 'number', required: true },
    { key: 'persentase', label: 'Persentase (%)', type: 'number', required: true },
    { key: 'lakiLaki', label: 'Laki-laki', type: 'number', required: true },
    { key: 'perempuan', label: 'Perempuan', type: 'number', required: true },
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
        <h2 className="text-2xl font-bold text-slate-800">Data Pendidikan</h2>
        <p className="text-sm text-slate-500 mt-1">Statistik tingkat pendidikan dan fasilitas pendidikan desa</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button onClick={() => setActiveTab('ringkasan')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ringkasan' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Ringkasan
        </button>
        <button onClick={() => setActiveTab('data')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Data Pendidikan
        </button>
        <button onClick={() => setActiveTab('fasilitas')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'fasilitas' ? 'border-sky-500 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Fasilitas Pendidikan
        </button>
      </div>

      {/* Ringkasan Tab */}
      {activeTab === 'ringkasan' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Angka Melek Huruf</p>
                <BookOpen className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-2xl font-bold text-sky-600">{angkaMelekHuruf}%</p>
              <p className="text-xs text-slate-400 mt-1">Penduduk yang bisa baca tulis</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Wajib Belajar</p>
                <School className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{wajibBelajar.toLocaleString('id-ID')}</p>
              <p className="text-xs text-slate-400 mt-1">SD, SMP, SMA</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Perguruan Tinggi</p>
                <GraduationCap className="w-5 h-5 text-violet-500" />
              </div>
              <p className="text-2xl font-bold text-violet-600">{perguruanTinggi.toLocaleString('id-ID')}</p>
              <p className="text-xs text-slate-400 mt-1">Diploma, S1, S2, S3</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Fasilitas Pendidikan</p>
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-600">{fasilitasPendidikan.length}</p>
              <p className="text-xs text-slate-400 mt-1">Unit sekolah & perpustakaan</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi per Jenjang</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={dataByJenjang} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {dataByJenjang.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Perbandingan Laki-laki vs Perempuan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="tingkatPendidikan" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-30} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="lakiLaki" fill="#3b82f6" name="Laki-laki" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="perempuan" fill="#ec4899" name="Perempuan" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tren Tingkat Pendidikan (5 Tahun)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tahun" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="tidakSekolah" stroke="#ef4444" strokeWidth={2} name="Tidak Sekolah" />
                <Line type="monotone" dataKey="sd" stroke="#f59e0b" strokeWidth={2} name="SD" />
                <Line type="monotone" dataKey="smp" stroke="#0ea5e9" strokeWidth={2} name="SMP" />
                <Line type="monotone" dataKey="sma" stroke="#10b981" strokeWidth={2} name="SMA" />
                <Line type="monotone" dataKey="perguruanTinggi" stroke="#8b5cf6" strokeWidth={2} name="Perguruan Tinggi" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Data pendidikan dapat ditambah, edit, dan dihapus melalui tab Data Pendidikan.
          </div>
        </>
      )}

      {/* Data Pendidikan Tab */}
      {activeTab === 'data' && (
        <>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            ⚡ DATA DEMO — Kelola data pendidikan. Semua perubahan tersimpan di browser.
          </div>
          <CRUDTable
            title="Data Pendidikan"
            columns={columns}
            data={data}
            onCreate={(item) => { pendidikanManager.create(item); setData(pendidikanManager.getAll() as PendidikanItem[]); }}
            onUpdate={(id, item) => { pendidikanManager.update(id, item); setData(pendidikanManager.getAll() as PendidikanItem[]); }}
            onDelete={(id) => { pendidikanManager.delete(id); setData(pendidikanManager.getAll() as PendidikanItem[]); }}
            searchKeys={['tingkatPendidikan', 'jenjang', 'keterangan']}
          />
        </>
      )}

      {/* Fasilitas Pendidikan Tab */}
      {activeTab === 'fasilitas' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Fasilitas Pendidikan Desa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Nama Sekolah</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Tipe</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Alamat</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Jumlah Siswa</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {fasilitasPendidikan.map((fas, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-700">{fas.nama}</td>
                    <td className="py-3 px-3 text-slate-600">{fas.tipe}</td>
                    <td className="py-3 px-3 text-slate-600">{fas.alamat}</td>
                    <td className="py-3 px-3 text-slate-600">{fas.siswa > 0 ? `${fas.siswa} siswa` : '-'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{fas.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200">
            <p className="text-xs text-sky-700">💡 Fasilitas pendidikan dapat dilihat lebih detail di Peta Digital dengan marker kategori "Sekolah"</p>
          </div>
        </div>
      )}
    </div>
  );
}
