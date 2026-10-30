import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Home, Search, Download, Upload, ChevronLeft, ChevronRight, FileText, Trash2, Layers, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { villageInfo, kpiData, populationByYear, ageGroups, educationData, occupationData, umkmData, bantuanSosial, fasilitasData, pembangunanData, announcements, anggaranData, infrastructureData, agricultureData, fisheryData, familyData, demoMarkers, markerCategories } from '../data/demoData';

function DataTable({ columns, data, title }: { columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[]; data: any[]; title: string }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const filtered = data.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(search.toLowerCase())));
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
          </div>
          <button className="px-3 py-2 rounded-lg bg-sky-100 text-sky-700 text-sm font-medium flex items-center gap-1"><Download className="w-4 h-4" /> Ekspor</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200">{columns.map(col => (<th key={col.key} className="text-left py-3 px-3 font-semibold text-slate-600">{col.label}</th>))}</tr></thead>
          <tbody>{paginated.map((row, idx) => (<tr key={idx} className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors">{columns.map(col => (<td key={col.key} className="py-3 px-3 text-slate-700">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>))}</tr>))}</tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-500">Menampilkan {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 py-1.5 text-xs text-slate-600">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

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

export function PendudukPage() {
  const sampleResidents = Array.from({ length: 25 }, (_, i) => ({ no: i + 1, nik: `8203${String(2001 + i).padStart(4, '0')}${String(190000 + i * 100).padStart(6, '0')}`, nama: ['Ahmad', 'Fatimah', 'Ibrahim', 'Siti', 'Yusuf', 'Aminah', 'Hasan', 'Khadijah', 'Omar', 'Zainab'][i % 10] + ' ' + ['Sanusi', 'Hasan', 'Ali', 'Musa', 'Binti', 'Putri', 'Rahman', 'Daud'][i % 8], jk: i % 2 === 0 ? 'L' : 'P', ttl: `Maba Sangaji, ${1960 + (i * 3) % 50}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`, pendidikan: ['SD', 'SMP', 'SMA', 'S1', 'Tidak Sekolah'][i % 5], pekerjaan: ['Petani', 'Nelayan', 'PNS', 'Wiraswasta', 'Ibu Rumah Tangga'][i % 5], status: i % 5 === 0 ? 'Belum Kawin' : 'Kawin' }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: 'Total Penduduk', value: kpiData.totalPenduduk, color: 'from-sky-500 to-blue-600' }, { label: 'Laki-laki', value: kpiData.lakiLaki, color: 'from-blue-500 to-indigo-600' }, { label: 'Perempuan', value: kpiData.perempuan, color: 'from-pink-500 to-rose-600' }, { label: 'Kepala Keluarga', value: kpiData.jumlahKK, color: 'from-emerald-500 to-teal-600' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value.toLocaleString('id-ID')}</p></motion.div>))}</div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data penduduk di bawah ini adalah contoh. Bukan data resmi.</div>
      <DataTable title="Data Penduduk" columns={[{ key: 'no', label: 'No' }, { key: 'nik', label: 'NIK' }, { key: 'nama', label: 'Nama Lengkap' }, { key: 'jk', label: 'L/P', render: (val: string) => (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{val}</span>) }, { key: 'ttl', label: 'TTL' }, { key: 'pendidikan', label: 'Pendidikan' }, { key: 'pekerjaan', label: 'Pekerjaan' }]} data={sampleResidents} />
    </div>
  );
}

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

export function KeluargaPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label: 'Total KK', value: kpiData.jumlahKK }, { label: 'Rata-rata Anggota', value: '3.8' }, { label: 'KK Sejahtera', value: '89%' }].map((card, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>
        ))}
      </div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data keluarga di bawah ini adalah contoh.</div>
      <DataTable title="Data Keluarga" columns={[{ key: 'no', label: 'No' }, { key: 'noKK', label: 'No. KK' }, { key: 'kepalaKeluarga', label: 'Kepala Keluarga' }, { key: 'alamat', label: 'Alamat' }, { key: 'jumlahAnggota', label: 'Anggota' }, { key: 'status', label: 'Status' }]} data={familyData} />
    </div>
  );
}

export function PendidikanPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: 'SD', value: kpiData.sd }, { label: 'SMP', value: kpiData.smp }, { label: 'SMA/SMK', value: kpiData.sma }, { label: 'Sarjana', value: kpiData.sarjana }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value.toLocaleString('id-ID')}</p></motion.div>))}</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Tingkat Pendidikan Penduduk</h3><ResponsiveContainer width="100%" height={300}><BarChart data={educationData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="value" radius={[4, 4, 0, 0]} name="Jumlah">{educationData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar></BarChart></ResponsiveContainer></motion.div>
      <DataTable title="Fasilitas Pendidikan" columns={[{ key: 'jenis', label: 'Jenis Fasilitas' }, { key: 'jumlah', label: 'Jumlah' }]} data={fasilitasData.filter(f => ['SD', 'SMP', 'SMA', 'PAUD', 'Perpustakaan'].includes(f.jenis))} />
    </div>
  );
}

export function KesehatanPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[{ label: 'Puskesmas', value: 1, icon: '🏥' }, { label: 'Pustu', value: 2, icon: '🏨' }, { label: 'Posyandu', value: 4, icon: '💊' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5"><span className="text-2xl">{card.icon}</span><p className="text-xs text-slate-500 mt-2">{card.label}</p><p className="text-2xl font-bold text-slate-800">{card.value}</p></motion.div>))}</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Fasilitas Kesehatan Desa</h3><DataTable title="" columns={[{ key: 'jenis', label: 'Jenis Fasilitas' }, { key: 'jumlah', label: 'Jumlah' }]} data={fasilitasData.filter(f => ['Puskesmas', 'Pustu', 'Posyandu'].includes(f.jenis))} /></motion.div>
    </div>
  );
}

export function PekerjaanPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: 'Total Angkatan Kerja', value: '2,456' }, { label: 'Tingkat Pengangguran', value: '3.2%' }, { label: 'Sektor Dominan', value: 'Pertanian' }, { label: 'Pendapatan Rata-rata', value: 'Rp 2.5 Jt/bln' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>))}</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Pekerjaan</h3><ResponsiveContainer width="100%" height={300}><BarChart data={occupationData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Jumlah" /></BarChart></ResponsiveContainer></motion.div>
    </div>
  );
}

export function EkonomiPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: 'PDRB Desa', value: 'Rp 45.6 M' }, { label: 'Pertumbuhan', value: '+5.8%' }, { label: 'UMKM Aktif', value: kpiData.jumlahUMKM }, { label: 'Investasi Desa', value: 'Rp 1.2 M' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>))}</div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data ekonomi di bawah ini adalah contoh.</div>
    </div>
  );
}

export function UMKMPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[{ label: 'Total UMKM', value: kpiData.jumlahUMKM }, { label: 'Kategori Terbanyak', value: 'Kuliner' }, { label: 'Pertumbuhan YoY', value: '+12%' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>))}</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">UMKM Berdasarkan Kategori</h3><ResponsiveContainer width="100%" height={300}><BarChart data={umkmData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="kategori" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="jumlah" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Jumlah UMKM" /></BarChart></ResponsiveContainer></motion.div>
    </div>
  );
}

export function PertanianPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Data Pertanian</h3><DataTable title="" columns={[{ key: 'komoditas', label: 'Komoditas' }, { key: 'luas', label: 'Luas' }, { key: 'produksi', label: 'Produksi' }, { key: 'produktivitas', label: 'Produktivitas' }]} data={agricultureData} /></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Data Perikanan</h3><DataTable title="" columns={[{ key: 'komoditas', label: 'Komoditas' }, { key: 'produksi', label: 'Produksi' }, { key: 'nilai', label: 'Nilai Ekonomi' }]} data={fisheryData} /></motion.div>
      </div>
    </div>
  );
}

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

export function BantuanPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Bantuan Sosial</h3><ResponsiveContainer width="100%" height={300}><BarChart data={bantuanSosial}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="jenis" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="penerima" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Jumlah Penerima" /></BarChart></ResponsiveContainer></motion.div>
      <DataTable title="Data Penerima Bantuan Sosial" columns={[{ key: 'jenis', label: 'Jenis Bantuan' }, { key: 'penerima', label: 'Jumlah Penerima' }]} data={bantuanSosial} />
    </div>
  );
}

export function InfrastrukturPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[{ label: 'Total Infrastruktur', value: kpiData.infrastrukturDesa }, { label: 'Kondisi Baik', value: '78%' }, { label: 'Pembangunan Baru', value: '5 unit' }].map((card, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4"><p className="text-xs text-slate-500">{card.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p></motion.div>))}</div>
      <DataTable title="Data Infrastruktur Desa" columns={[{ key: 'nama', label: 'Nama Infrastruktur' }, { key: 'panjang', label: 'Panjang/Jumlah' }, { key: 'kondisi', label: 'Kondisi', render: (val: string) => (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{val}</span>) }, { key: 'tahun', label: 'Tahun' }]} data={infrastructureData} />
    </div>
  );
}

export function PengumumanPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-800">Pengumuman Desa</h2><button className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Buat Pengumuman</button></div>
      {announcements.map((ann, idx) => (<motion.div key={ann.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 mb-1"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ann.priority === 'tinggi' ? 'bg-red-100 text-red-700' : ann.priority === 'sedang' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{ann.priority.toUpperCase()}</span><span className="text-xs text-slate-400">{ann.date}</span></div><h3 className="text-sm font-semibold text-slate-800">{ann.title}</h3><p className="text-sm text-slate-600 mt-1">{ann.content}</p></div></div></motion.div>))}
    </div>
  );
}

export function MarkerManagementPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [markers, setMarkers] = useState(demoMarkers);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const filtered = markers.filter(m => { const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()); const matchCat = filterCat === 'all' || m.category === filterCat; return matchSearch && matchCat; });
  const deleteMarker = (id: number) => { if (confirm('Hapus marker ini?')) { setMarkers(prev => prev.filter(m => m.id !== id)); } };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-800">Manajemen Marker</h2><p className="text-sm text-slate-500">Kelola semua marker pada peta digital desa</p></div><button onClick={() => onNavigate('peta')} className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4" /> Buka Peta</button></div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Marker di bawah ini adalah contoh. Tambahkan marker baru melalui halaman Peta Digital.</div>
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Cari marker..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" /></div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"><option value="all">Semua Kategori</option>{markerCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}</select>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200"><th className="text-left py-3 px-3 font-semibold text-slate-600">Nama</th><th className="text-left py-3 px-3 font-semibold text-slate-600">Kategori</th><th className="text-left py-3 px-3 font-semibold text-slate-600">Koordinat</th><th className="text-left py-3 px-3 font-semibold text-slate-600">Status</th><th className="text-left py-3 px-3 font-semibold text-slate-600">Aksi</th></tr></thead><tbody>{filtered.map(marker => { const cat = markerCategories.find(c => c.id === marker.category); return (<tr key={marker.id} className="border-b border-slate-100 hover:bg-sky-50/50"><td className="py-3 px-3 font-medium text-slate-700">{marker.name}</td><td className="py-3 px-3"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs">{cat?.icon} {cat?.name}</span></td><td className="py-3 px-3 text-slate-500 text-xs">{marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</td><td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">{marker.status}</span></td><td className="py-3 px-3"><button onClick={() => deleteMarker(marker.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>); })}</tbody></table></div>
        <p className="text-xs text-slate-500 mt-3">Menampilkan {filtered.length} dari {markers.length} marker</p>
      </div>
    </div>
  );
}

export function LayerManagementPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [layers] = useState([{ id: 1, name: 'Batas Administrasi Desa', type: 'Polygon', visible: true, objects: 1, color: '#0ea5e9' }, { id: 2, name: 'Jalan Desa', type: 'Polyline', visible: true, objects: 8, color: '#6b7280' }, { id: 3, name: 'Area Pertanian', type: 'Polygon', visible: true, objects: 12, color: '#84cc16' }, { id: 4, name: 'Area Perikanan', type: 'Polygon', visible: false, objects: 5, color: '#06b6d4' }, { id: 5, name: 'Zona Pembangunan', type: 'Polygon', visible: true, objects: 3, color: '#f97316' }, { id: 6, name: 'Fasilitas Umum', type: 'Marker', visible: true, objects: 15, color: '#8b5cf6' }, { id: 7, name: 'Titik Rawan Bencana', type: 'Marker', visible: false, objects: 4, color: '#ef4444' }]);
  const [visibleLayers, setVisibleLayers] = useState(layers.filter(l => l.visible).map(l => l.id));
  const toggleLayer = (id: number) => { setVisibleLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]); };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-800">Manajemen Layer</h2><p className="text-sm text-slate-500">Kelola layer peta digital desa</p></div><button onClick={() => onNavigate('peta')} className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center gap-2"><Layers className="w-4 h-4" /> Buka Peta</button></div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Layer di bawah ini adalah contoh untuk demonstrasi.</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{layers.map(layer => (<motion.div key={layer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-4 h-4 rounded" style={{ backgroundColor: layer.color }} /><div><p className="text-sm font-medium text-slate-700">{layer.name}</p><p className="text-xs text-slate-500">{layer.type} • {layer.objects} objek</p></div></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={visibleLayers.includes(layer.id)} onChange={() => toggleLayer(layer.id)} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div></label></div></motion.div>))}</div>
      <div className="glass-card p-6"><h3 className="text-lg font-semibold text-slate-800 mb-3">Impor/Ekspor Layer</h3><p className="text-sm text-slate-600 mb-4">Impor data GeoJSON atau ekspor layer yang ada.</p><div className="flex gap-3"><button className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 text-sm font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Impor GeoJSON</button><button className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4" /> Ekspor Semua Layer</button></div></div>
    </div>
  );
}

export function GenericDataPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"><h2 className="text-xl font-bold text-slate-800">{title}</h2><p className="text-sm text-slate-500 mt-1">{description}</p></motion.div>
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Modul ini dalam pengembangan. Data yang ditampilkan adalah contoh.</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 text-center"><div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-sky-600" /></div><h3 className="text-lg font-semibold text-slate-700">Modul {title}</h3><p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">Modul ini siap untuk menerima data resmi dari Desa Maba Sangaji. Administrator dapat mengimpor data melalui fitur impor CSV/Excel.</p><div className="flex gap-3 justify-center mt-4"><button className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 text-sm font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Impor Data</button><button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4" /> Unduh Template</button></div></motion.div>
    </div>
  );
}
