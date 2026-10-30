import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Plus, Edit, Trash2, Search, UserCheck } from 'lucide-react';
import { CRUDManager } from '../utils/crudManager';
import { CRUDTable, Column } from '../components/CRUDTable';

const userManager = new CRUDManager('maba_pengguna');

const defaultUsers = [
  { id: 1, username: 'admin', nama: 'Administrator Desa', role: 'Super Admin', email: 'admin@mabasangaji.desa', status: 'Aktif', lastLogin: '2024-01-15 08:30' },
  { id: 2, username: 'operator', nama: 'Operator Data', role: 'Operator Data', email: 'operator@mabasangaji.desa', status: 'Aktif', lastLogin: '2024-01-15 09:15' },
  { id: 3, username: 'gis', nama: 'Petugas GIS', role: 'Petugas GIS', email: 'gis@mabasangaji.desa', status: 'Aktif', lastLogin: '2024-01-14 14:20' },
  { id: 4, username: 'kepala_desa', nama: 'Ahmad Sanusi', role: 'Kepala Desa', email: 'kepala@mabasangaji.desa', status: 'Aktif', lastLogin: '2024-01-13 10:00' },
];

export default function PenggunaPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let stored = userManager.getAll();
    if (stored.length === 0) {
      userManager.importData(defaultUsers);
      stored = userManager.getAll();
    }
    setData(stored);
  }, []);

  const columns: Column[] = [
    { key: 'username', label: 'Username', type: 'text', required: true },
    { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'text', required: true },
    { key: 'role', label: 'Peran', type: 'select', required: true, options: [
      { value: 'Super Admin', label: 'Super Admin' },
      { value: 'Admin Desa', label: 'Admin Desa' },
      { value: 'Operator Data', label: 'Operator Data' },
      { value: 'Petugas GIS', label: 'Petugas GIS' },
      { value: 'Kepala Desa', label: 'Kepala Desa' },
      { value: 'Baca Saja', label: 'Baca Saja' },
    ], render: (val: string) => {
      const colors: Record<string, string> = {
        'Super Admin': 'bg-red-100 text-red-700',
        'Admin Desa': 'bg-sky-100 text-sky-700',
        'Operator Data': 'bg-emerald-100 text-emerald-700',
        'Petugas GIS': 'bg-violet-100 text-violet-700',
        'Kepala Desa': 'bg-amber-100 text-amber-700',
        'Baca Saja': 'bg-slate-100 text-slate-700',
      };
      return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[val] || 'bg-slate-100 text-slate-700'}`}>{val}</span>;
    }},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'Aktif', label: 'Aktif' },
      { value: 'Nonaktif', label: 'Nonaktif' },
    ], render: (val: string) => (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{val}</span>) },
    { key: 'lastLogin', label: 'Login Terakhir', type: 'text' },
  ];

  const rolePermissions: Record<string, string[]> = {
    'Super Admin': ['Semua akses', 'Kelola pengguna', 'Kelola data', 'Kelola peta', 'Ekspor/Impor', 'Reset data'],
    'Admin Desa': ['Kelola data', 'Kelola peta', 'Ekspor/Impor', 'Lihat laporan'],
    'Operator Data': ['Kelola data', 'Ekspor data', 'Lihat laporan'],
    'Petugas GIS': ['Kelola peta', 'Kelola marker', 'Kelola layer'],
    'Kepala Desa': ['Lihat semua data', 'Lihat laporan', 'Lihat peta'],
    'Baca Saja': ['Lihat data (tidak bisa edit)'],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label: 'Total Pengguna', value: data.length, icon: Users }, { label: 'Pengguna Aktif', value: data.filter(d => d.status === 'Aktif').length, icon: UserCheck }, { label: 'Peran Tersedia', value: '6', icon: Shield }].map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"><Icon className="w-5 h-5 text-white" /></div>
                <div><p className="text-xs text-slate-500">{card.label}</p><p className="text-xl font-bold text-slate-800">{card.value}</p></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">⚡ DATA DEMO — Data pengguna dapat ditambah, edit, dan dihapus. Password tidak disimpan di frontend.</div>

      <CRUDTable title="Manajemen Pengguna" columns={columns} data={data} onCreate={(item) => { userManager.create(item); setData(userManager.getAll()); }} onUpdate={(id, item) => { userManager.update(id, item); setData(userManager.getAll()); }} onDelete={(id) => { userManager.delete(id); setData(userManager.getAll()); }} searchKeys={['username', 'nama', 'email', 'role']} />

      {/* Role Permissions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Hak Akses per Peran</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-2">{role}</p>
              <ul className="space-y-1">
                {permissions.map((perm, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-500" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
