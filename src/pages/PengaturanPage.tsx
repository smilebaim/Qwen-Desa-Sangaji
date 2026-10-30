import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Database, Trash2, RefreshCw, Download, Upload, AlertTriangle, CheckCircle, Users, Shield } from 'lucide-react';
import { CRUDManager } from '../utils/crudManager';
import { Modal, ConfirmDialog } from '../components/Modal';

export default function PengaturanPage() {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('data');

  const handleResetAllData = () => {
    // Clear all CRUD data
    new CRUDManager('maba_penduduk').clear();
    new CRUDManager('maba_keluarga').clear();
    new CRUDManager('maba_umkm').clear();
    new CRUDManager('maba_infrastruktur').clear();
    new CRUDManager('maba_pengumuman').clear();
    setIsResetSuccess(true);
    setTimeout(() => setIsResetSuccess(false), 3000);
  };

  const handleExportAllData = () => {
    const allData = {
      penduduk: new CRUDManager('maba_penduduk').getAll(),
      keluarga: new CRUDManager('maba_keluarga').getAll(),
      umkm: new CRUDManager('maba_umkm').getAll(),
      infrastruktur: new CRUDManager('maba_infrastruktur').getAll(),
      pengumuman: new CRUDManager('maba_pengumuman').getAll(),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-data-maba-sangaji-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'data', label: 'Manajemen Data', icon: Database },
    { id: 'pengguna', label: 'Manajemen Pengguna', icon: Users },
    { id: 'sistem', label: 'Pengaturan Sistem', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-slate-800">Pengaturan</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola data, pengguna, dan konfigurasi sistem</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Backup & Restore Data</h3>
            <p className="text-sm text-slate-600 mb-4">Ekspor semua data untuk backup atau restore dari file backup.</p>
            <div className="flex gap-3">
              <button onClick={handleExportAllData} className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-medium flex items-center gap-2">
                <Download className="w-4 h-4" /> Ekspor Semua Data
              </button>
              <label className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 text-sm font-medium flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" /> Impor Data
                <input type="file" accept=".json" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);
                      if (data.penduduk) new CRUDManager('maba_penduduk').importData(data.penduduk);
                      if (data.keluarga) new CRUDManager('maba_keluarga').importData(data.keluarga);
                      if (data.umkm) new CRUDManager('maba_umkm').importData(data.umkm);
                      if (data.infrastruktur) new CRUDManager('maba_infrastruktur').importData(data.infrastruktur);
                      if (data.pengumuman) new CRUDManager('maba_pengumuman').importData(data.pengumuman);
                      alert('Data berhasil diimpor!');
                    } catch {
                      alert('Format file tidak valid!');
                    }
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }} />
              </label>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Reset Data</h3>
            <p className="text-sm text-slate-600 mb-4">Hapus semua data yang tersimpan dan kembalikan ke data awal demo.</p>
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Peringatan</p>
                  <p className="text-xs text-red-700 mt-1">Tindakan ini akan menghapus semua data yang telah Anda tambah atau edit. Data tidak dapat dikembalikan kecuali Anda telah melakukan backup.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsResetDialogOpen(true)} className="mt-4 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Reset Semua Data
            </button>
          </motion.div>

          {isResetSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">Data berhasil direset ke kondisi awal!</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'pengguna' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Manajemen Pengguna</h3>
          <p className="text-sm text-slate-600 mb-6">Kelola pengguna dan hak akses sistem.</p>
          <div className="space-y-3">
            {[
              { username: 'admin', name: 'Administrator Desa', role: 'Super Admin', status: 'Aktif' },
              { username: 'operator', name: 'Operator Data', role: 'Operator Data', status: 'Aktif' },
              { username: 'gis', name: 'Petugas GIS', role: 'Petugas GIS', status: 'Aktif' },
            ].map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                    <p className="text-xs text-slate-500">@{user.username} • {user.role}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">{user.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700">⚡ Fitur manajemen pengguna lengkap akan tersedia setelah integrasi backend.</p>
          </div>
        </motion.div>
      )}

      {/* System Settings Tab */}
      {activeTab === 'sistem' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pengaturan Sistem</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Versi Aplikasi</p>
              <p className="text-xs text-slate-500 mt-1">MABA SANGAJI DIGITAL v1.0.0</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Penyimpanan Data</p>
              <p className="text-xs text-slate-500 mt-1">Data tersimpan di localStorage browser. Untuk produksi, gunakan database server.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Zona Waktu</p>
              <p className="text-xs text-slate-500 mt-1">WIT (UTC+9) - Waktu Indonesia Timur</p>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
              <p className="text-xs text-sky-700">💡 Untuk implementasi produksi, hubungkan dengan backend API dan database PostgreSQL + PostGIS.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetAllData}
        title="Reset Semua Data"
        message="Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan. Pastikan Anda telah melakukan backup terlebih dahulu."
        confirmText="Ya, Reset"
        variant="danger"
      />
    </div>
  );
}
