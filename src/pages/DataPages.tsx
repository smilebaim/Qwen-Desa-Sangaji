import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Home, Search, Download, Upload, ChevronLeft, ChevronRight, FileText, Trash2, Layers, Plus, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { villageInfo, kpiData, populationByYear, ageGroups, educationData, occupationData, umkmData, bantuanSosial, fasilitasData, pembangunanData, announcements, anggaranData, infrastructureData, agricultureData, fisheryData, markerCategories } from '../data/demoData';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

// Initialize CRUD managers
const pendudukManager = new CRUDManager('maba_penduduk');
const keluargaManager = new CRUDManager('maba_keluarga');
const umkmManager = new CRUDManager('maba_umkm');
const infrastrukturManager = new CRUDManager('maba_infrastruktur');
const pengumumanManager = new CRUDManager('maba_pengumuman');

// ============ PROFIL DESA ============
export function ProfilDesaPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><Building2 className="w-6 h-6 text-white" /></div>
          <div><h2 className="text-xl font-bold text-slate-800">Profil Desa Maba Sangaji</h2><p className="text-sm text-slate-500">Informasi umum desa</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ label: 'Nama Desa', value: villageInfo.name }, { label: 'Kecamatan', value: 'Maba' }, { label: 'Kabupaten', value: villageInfo.kabupaten }, { label: 'Provinsi', value: villageInfo.provinsi }, { label: 'Kode Wilayah', value: villageInfo.kodeWilayah }, { label: 'Luas Wilayah', value: villageInfo.luasWilayah }, { label: 'Kepala Desa', value: villageInfo.kepalaDesa }, { label: 'Sekretaris Desa', value: villageInfo.sekretaris }, { label: 'Jumlah Penduduk', value: kpiData.totalPenduduk.toLocaleString('id-ID') + ' jiwa' }, { label: 'Jumlah KK', value: kpiData.jumlahKK.toLocaleString('id-ID') + ' KK' }, { label: 'Zona Waktu', value: villageInfo.zonaWaktu }, { label: 'Kontak', value: 'Belum tersedia' }].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100"><p className="text-xs font-medium text-slate-500">{item.label}</p><p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p></div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Visi & Misi</h3>
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-100"><p className="text-sm text-slate-600 italic">"Mewujudkan Desa Maba Sangaji yang maju, mandiri, dan sejahtera berbasis potensi lokal dengan tata kelola pemerintahan yang baik."</p></div>
        <div className="mt-4 space-y-2">{['Meningkatkan kualitas pelayanan publik', 'Mengembangkan potensi ekonomi lokal', 'Membangun infrastruktur desa yang merata', 'Meningkatkan kualitas SDM'].map((misi, idx) => (<div key={idx} className="flex items-center gap-2 text-sm text-slate-600"><span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">{idx + 1}</span>{misi}</div>))}</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Struktur Pemerintahan Desa</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{[{ jabatan: 'Kepala Desa', nama: 'Bpk. Ahmad Sanusi' }, { jabatan: 'Sekretaris Desa', nama: 'Ibu Fatimah Hasan' }, { jabatan: 'Kaur Pemerintahan', nama: 'Bpk. Ibrahim' }, { jabatan: 'Kaur Keuangan', nama: 'Ibu Siti Aminah' }, { jabatan: 'Kaur Kesejahteraan', nama: 'Bpk. Yusuf' }, { jabatan: 'Kadus 1', nama: 'Bpk. Hasan' }, { jabatan: 'Kadus 2', nama: 'Bpk. Omar' }, { jabatan: 'Kadus 3', nama: 'Bpk. Ali' }].map((item, idx) => (<div key={idx} className="p-3 rounded-xl bg-white/60 border border-slate-100"><p className="text-xs text-slate-500">{item.jabatan}</p><p className="text-sm font-medium text-slate-700 mt-0.5">{item.nama}</p></div>))}</div>
      </motion.div>
    </div>
  );
}

// ============ PENDUDUK WITH CRUD ============
export function PendudukPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let stored = pendudukManager.getAll();
    if (stored.length === 0) {
      // Initialize with demo data
      const demoData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        nik: `8203${String(2001 + i).padStart(4, '0')}${String(190000 + i * 100).padStart(6, '0')}`,
        nama: ['Ahmad', 'Fatimah', 'Ibrahim', 'Siti', 'Yusuf', 'Aminah', 'Hasan', 'Khadijah', 'Omar', 'Zainab'][i % 10] + ' ' + ['Sanusi', 'Hasan', 'Ali', 'Musa', 'Binti', 'Putri', 'Rahman', 'Daud'][i % 8],
        jk: i % 2 === 0 ? 'L' : 'P',
        ttl: `Maba Sangaji, ${1960 + (i * 3) % 50}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        pendidikan: ['SD', 'SMP', 'SMA', 'S1', 'Tidak Sekolah'][i % 5],
        pekerjaan: ['Petani', 'Nelayan', 'PNS', 'Wiraswasta', 'Ibu Rumah Tangga'][i % 5],
        status: i % 5 === 0 ? 'Belum Kawin' : 'Kawin',
      }));
      pendudukManager.importData(demoData);
      stored = pendudukManager.getAll();
    }
    setData(stored);
  }, []);

  const columns: Column[] = [
    { key: 'nik', label: 'NIK', type: 'text', required: true },
    { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
    { key: 'jk', label: 'Jenis Kelamin', type: 'select', required: true, options: [{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }], render: (val: string) => (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{val}</span>) },
    { key: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { key: 'pendidikan', label: 'Pendidikan', type: 'select', options: [{ value: 'Tidak Sekolah', label: 'Tidak Sekolah' }, { value: 'SD', label: 'SD' }, { value: 'SMP', label: 'SMP' }, { value: 'SMA', label: 'SMA' }, { value: 'S1', label: 'S1' }] },
    { key: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'Belum Kawin', label: 'Belum Kawin' }, { value: 'Kawin', label: 'Kawin' }, { value: 'Cerai', label: 'Cerai' }] },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: 'Total Penduduk', value: kpiData.totalPenduduk }, { label: 'Laki-laki', value: kpiData.lakiLaki }, { label: 'Perempuan', value: kpiData.perempuan }, { label: 'Kepala Keluarga', value: kpiData.jumlahKK }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value.toLocaleString('id-ID')}</p></motion.div>))}</div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data dapat ditambah, edit, dan dihapus. Perubahan tersimpan di browser.</div>
      <CRUDTable
        title="Data Penduduk"
        columns={columns}
        data={data}
        onCreate={(item) => { const newItem = pendudukManager.create(item); setData(pendudukManager.getAll()); }}
        onUpdate={(id, item) => { pendudukManager.update(id, item); setData(pendudukManager.getAll()); }}
        onDelete={(id) => { pendudukManager.delete(id); setData(pendudukManager.getAll()); }}
        searchKeys={['nik', 'nama', 'pekerjaan']}
      />
    </div>
  );
}

// ============ KELUARGA WITH CRUD ============
export function KeluargaPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let stored = keluargaManager.getAll();
    if (stored.length === 0) {
      const demoData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        noKK: `8203${String(2001 + i).padStart(4, '0')}`,
        kepalaKeluarga: ['Ahmad Sanusi', 'Ibrahim Hasan', 'Yusuf Ali', 'Omar Musa', 'Hasan Daud'][i % 5],
        alamat: `Dusun ${Math.floor(i / 7) + 1}, RT ${String((i % 5) + 1).padStart(2, '0')}/RW 01`,
        jumlahAnggota: Math.floor(Math.random() * 4) + 2,
        status: ['K sejahtera 1', 'K sejahtera 2', 'K sejahtera 3'][i % 3],
      }));
      keluargaManager.importData(demoData);
      stored = keluargaManager.getAll();
    }
    setData(stored);
  }, []);

  const columns: Column[] = [
    { key: 'noKK', label: 'No. KK', type: 'text', required: true },
    { key: 'kepalaKeluarga', label: 'Kepala Keluarga', type: 'text', required: true },
    { key: 'alamat', label: 'Alamat', type: 'textarea' },
    { key: 'jumlahAnggota', label: 'Jumlah Anggota', type: 'number', required: true },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'K sejahtera 1', label: 'Keluarga Sejahtera 1' }, { value: 'K sejahtera 2', label: 'Keluarga Sejahtera 2' }, { value: 'K sejahtera 3', label: 'Keluarga Sejahtera 3' }] },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[{ label: 'Total KK', value: kpiData.jumlahKK }, { label: 'Rata-rata Anggota', value: '3.8' }, { label: 'KK Sejahtera', value: '89%' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>))}</div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data keluarga dapat ditambah, edit, dan dihapus.</div>
      <CRUDTable title="Data Keluarga" columns={columns} data={data} onCreate={(item) => { keluargaManager.create(item); setData(keluargaManager.getAll()); }} onUpdate={(id, item) => { keluargaManager.update(id, item); setData(keluargaManager.getAll()); }} onDelete={(id) => { keluargaManager.delete(id); setData(keluargaManager.getAll()); }} searchKeys={['noKK', 'kepalaKeluarga', 'alamat']} />
    </div>
  );
}

// ============ STATISTIK DEMOGRAFI ============
export function StatistikPage() {
  return (
    <div className="space-y-6">
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Visualisasi berdasarkan data contoh.</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Piramida Penduduk</h3><ResponsiveContainer width="100%" height={350}><BarChart data={ageGroups} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis dataKey="group" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" width={40} /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Legend wrapperStyle={{ fontSize: '12px' }} /><Bar dataKey="laki" fill="#3b82f6" name="Laki-laki" radius={[0, 4, 4, 0]} /><Bar dataKey="perempuan" fill="#ec4899" name="Perempuan" radius={[4, 0, 0, 4]} /></BarChart></ResponsiveContainer></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Pendidikan</h3><ResponsiveContainer width="100%" height={350}><PieChart><Pie data={educationData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{educationData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{ borderRadius: '12px' }} /></PieChart></ResponsiveContainer></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Pertumbuhan Penduduk</h3><ResponsiveContainer width="100%" height={300}><LineChart data={populationByYear}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="tahun" tick={{ fontSize: 12 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Line type="monotone" dataKey="jumlah" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', r: 5 }} name="Jumlah" /></LineChart></ResponsiveContainer></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Pekerjaan</h3><ResponsiveContainer width="100%" height={300}><BarChart data={occupationData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Jumlah" /></BarChart></ResponsiveContainer></motion.div>
      </div>
    </div>
  );
}









// ============ UMKM WITH CRUD ============
export function UMKMPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let stored = umkmManager.getAll();
    if (stored.length === 0) {
      const demoData = [
        { id: 1, nama: 'Warung Makan Bu Siti', kategori: 'Kuliner', alamat: 'Dusun 1, RT 01', pemilik: 'Siti Aminah', telepon: '081234567890', status: 'Aktif' },
        { id: 2, nama: 'Kerajinan Anyaman', kategori: 'Kerajinan', alamat: 'Dusun 2, RT 03', pemilik: 'Fatimah', telepon: '081234567891', status: 'Aktif' },
        { id: 3, nama: 'Tambak Ikan Pak Omar', kategori: 'Perikanan', alamat: 'Dusun 3, RT 02', pemilik: 'Omar', telepon: '081234567892', status: 'Aktif' },
        { id: 4, nama: 'Toko Kelontong Pak Hasan', kategori: 'Perdagangan', alamat: 'Dusun 1, RT 02', pemilik: 'Hasan', telepon: '081234567893', status: 'Aktif' },
        { id: 5, nama: 'Bengkel Motor Pak Ali', kategori: 'Jasa', alamat: 'Dusun 2, RT 01', pemilik: 'Ali', telepon: '081234567894', status: 'Aktif' },
      ];
      umkmManager.importData(demoData);
      stored = umkmManager.getAll();
    }
    setData(stored);
  }, []);

  const columns: Column[] = [
    { key: 'nama', label: 'Nama UMKM', type: 'text', required: true },
    { key: 'kategori', label: 'Kategori', type: 'select', required: true, options: [{ value: 'Kuliner', label: 'Kuliner' }, { value: 'Kerajinan', label: 'Kerajinan' }, { value: 'Perikanan', label: 'Perikanan' }, { value: 'Pertanian', label: 'Pertanian' }, { value: 'Jasa', label: 'Jasa' }, { value: 'Perdagangan', label: 'Perdagangan' }] },
    { key: 'alamat', label: 'Alamat', type: 'textarea' },
    { key: 'pemilik', label: 'Pemilik', type: 'text', required: true },
    { key: 'telepon', label: 'Telepon', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'Aktif', label: 'Aktif' }, { value: 'Tidak Aktif', label: 'Tidak Aktif' }] },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[{ label: 'Total UMKM', value: data.length }, { label: 'Kategori Terbanyak', value: 'Kuliner' }, { label: 'Pertumbuhan YoY', value: '+12%' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>))}</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">UMKM Berdasarkan Kategori</h3><ResponsiveContainer width="100%" height={300}><BarChart data={umkmData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="kategori" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="jumlah" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Jumlah UMKM" /></BarChart></ResponsiveContainer></motion.div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data UMKM dapat ditambah, edit, dan dihapus.</div>
      <CRUDTable title="Data UMKM" columns={columns} data={data} onCreate={(item) => { umkmManager.create(item); setData(umkmManager.getAll()); }} onUpdate={(id, item) => { umkmManager.update(id, item); setData(umkmManager.getAll()); }} onDelete={(id) => { umkmManager.delete(id); setData(umkmManager.getAll()); }} searchKeys={['nama', 'kategori', 'pemilik']} />
    </div>
  );
}





// ============ INFRASTRUKTUR WITH CRUD ============
export function InfrastrukturPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let stored = infrastrukturManager.getAll();
    if (stored.length === 0) {
      infrastrukturManager.importData(infrastructureData.map((item, idx) => ({ ...item, id: idx + 1 })));
      stored = infrastrukturManager.getAll();
    }
    setData(stored);
  }, []);

  const columns: Column[] = [
    { key: 'nama', label: 'Nama Infrastruktur', type: 'text', required: true },
    { key: 'panjang', label: 'Panjang/Jumlah', type: 'text', required: true },
    { key: 'kondisi', label: 'Kondisi', type: 'select', required: true, options: [{ value: 'Baik', label: 'Baik' }, { value: 'Sedang', label: 'Sedang' }, { value: 'Rusak', label: 'Rusak' }], render: (val: string) => (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'Baik' ? 'bg-green-100 text-green-700' : val === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{val}</span>) },
    { key: 'tahun', label: 'Tahun', type: 'text' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[{ label: 'Total Infrastruktur', value: data.length }, { label: 'Kondisi Baik', value: `${Math.round((data.filter(d => d.kondisi === 'Baik').length / data.length) * 100)}%` }, { label: 'Pembangunan Baru', value: data.filter(d => d.tahun === '2023').length + ' unit' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>))}</div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data infrastruktur dapat ditambah, edit, dan dihapus.</div>
      <CRUDTable title="Data Infrastruktur Desa" columns={columns} data={data} onCreate={(item) => { infrastrukturManager.create(item); setData(infrastrukturManager.getAll()); }} onUpdate={(id, item) => { infrastrukturManager.update(id, item); setData(infrastrukturManager.getAll()); }} onDelete={(id) => { infrastrukturManager.delete(id); setData(infrastrukturManager.getAll()); }} searchKeys={['nama', 'kondisi']} />
    </div>
  );
}

// ============ ANGGARAN ============
export function AnggaranPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5"><p className="text-xs text-slate-500">Total Anggaran 2024</p><p className="text-lg font-bold text-sky-700 mt-1">Rp 3.500.000.000</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5"><p className="text-xs text-slate-500">Realisasi</p><p className="text-lg font-bold text-emerald-700 mt-1">Rp 2.847.000.000</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5"><p className="text-xs text-slate-500">Persentase</p><p className="text-lg font-bold text-violet-700 mt-1">81.3%</p><div className="w-full h-2 bg-slate-100 rounded-full mt-2"><div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" style={{ width: '81.3%' }} /></div></motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Target vs Realisasi Anggaran Bulanan</h3><ResponsiveContainer width="100%" height={300}><BarChart data={anggaranData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Legend wrapperStyle={{ fontSize: '12px' }} /><Bar dataKey="target" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Target (Juta)" /><Bar dataKey="realisasi" fill="#10b981" radius={[4, 4, 0, 0]} name="Realisasi (Juta)" /></BarChart></ResponsiveContainer></motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Progres Pembangunan</h3><div className="space-y-4">{pembangunanData.map((item, idx) => (<div key={idx}><div className="flex items-center justify-between mb-1"><span className="text-sm text-slate-700">{item.nama}</span><span className="text-sm font-semibold text-slate-600">{item.progres}%</span></div><div className="w-full h-2 bg-slate-100 rounded-full"><motion.div initial={{ width: 0 }} animate={{ width: `${item.progres}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }} className={`h-full rounded-full ${item.progres === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-sky-400 to-cyan-500'}`} /></div></div>))}</div></motion.div>
    </div>
  );
}

// ============ PENGUMUMAN WITH CRUD ============
export function PengumumanPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let stored = pengumumanManager.getAll();
    if (stored.length === 0) {
      pengumumanManager.importData(announcements);
      stored = pengumumanManager.getAll();
    }
    setData(stored);
  }, []);

  const columns: Column[] = [
    { key: 'title', label: 'Judul', type: 'text', required: true },
    { key: 'content', label: 'Isi Pengumuman', type: 'textarea', required: true },
    { key: 'date', label: 'Tanggal', type: 'date', required: true },
    { key: 'priority', label: 'Prioritas', type: 'select', required: true, options: [{ value: 'tinggi', label: 'Tinggi' }, { value: 'sedang', label: 'Sedang' }, { value: 'rendah', label: 'Rendah' }], render: (val: string) => (<span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${val === 'tinggi' ? 'bg-red-100 text-red-700' : val === 'sedang' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{val.toUpperCase()}</span>) },
  ];

  return (
    <div className="space-y-6">
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Pengumuman dapat ditambah, edit, dan dihapus.</div>
      <CRUDTable title="Pengumuman Desa" columns={columns} data={data} onCreate={(item) => { pengumumanManager.create(item); setData(pengumumanManager.getAll()); }} onUpdate={(id, item) => { pengumumanManager.update(id, item); setData(pengumumanManager.getAll()); }} onDelete={(id) => { pengumumanManager.delete(id); setData(pengumumanManager.getAll()); }} searchKeys={['title', 'content']} />
    </div>
  );
}





// ============ GENERIC DATA PAGE ============
export function GenericDataPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h2 className="text-xl font-bold text-slate-800">{title}</h2><p className="text-sm text-slate-500 mt-1">{description}</p></motion.div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Modul ini dalam pengembangan.</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 text-center"><div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-sky-600" /></div><h3 className="text-lg font-semibold text-slate-700">Modul {title}</h3><p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">Modul ini siap untuk menerima data resmi dari Desa Maba Sangaji.</p></motion.div>
    </div>
  );
}
