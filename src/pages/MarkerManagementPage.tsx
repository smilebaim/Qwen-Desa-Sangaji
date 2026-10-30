import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, Search, Filter, Download, Upload, Eye } from 'lucide-react';
import { CRUDManager, downloadFile, exportToCSV } from '../utils/crudManager';
import { Modal, ConfirmDialog, FormField } from '../components/Modal';
import { markerCategories } from '../data/demoData';

interface MarkerItem {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  status: string;
  address?: string;
  photo?: string;
  notes?: string;
}

const markerManager = new CRUDManager<MarkerItem>('maba_markers');

const defaultMarkers: Omit<MarkerItem, 'id'>[] = [
  { name: 'Kantor Desa Maba Sangaji', category: 'kantor', lat: 0.6833, lng: 128.3833, description: 'Kantor pemerintahan Desa Maba Sangaji', status: 'Aktif', address: 'Jl. Raya Maba Sangaji', notes: 'Jam kerja: Senin-Jumat 08:00-16:00 WIT' },
  { name: 'SD Negeri Maba Sangaji', category: 'sekolah', lat: 0.6855, lng: 128.3860, description: 'Sekolah Dasar Negeri', status: 'Aktif', address: 'Dusun 1', notes: 'Jumlah siswa: 156 orang' },
  { name: 'Puskesmas Pembantu Maba', category: 'kesehatan', lat: 0.6810, lng: 128.3810, description: 'Puskesmas pembantu untuk layanan kesehatan dasar', status: 'Aktif', address: 'Dusun 2', notes: 'Layanan 24 jam' },
  { name: 'Masjid Al-Hidayah', category: 'ibadah', lat: 0.6840, lng: 128.3850, description: 'Masjid utama Desa Maba Sangaji', status: 'Aktif', address: 'Dusun 1', notes: 'Kapasitas: 500 jamaah' },
  { name: 'SMP Negeri Maba', category: 'sekolah', lat: 0.6870, lng: 128.3820, description: 'Sekolah Menengah Pertama Negeri', status: 'Aktif', address: 'Dusun 2', notes: 'Jumlah siswa: 234 orang' },
  { name: 'Tambak Ikan Desa', category: 'perikanan', lat: 0.6790, lng: 128.3900, description: 'Area tambak ikan masyarakat', status: 'Aktif', address: 'Pesisir Dusun 3', notes: 'Luas: 5 hektar' },
  { name: 'Kelompok Tani Makmur', category: 'pertanian', lat: 0.6880, lng: 128.3780, description: 'Lahan pertanian kelompok tani', status: 'Aktif', address: 'Dusun 3', notes: 'Komoditas: Padi, Jagung' },
  { name: 'UMKM Kerajinan Anyaman', category: 'umkm', lat: 0.6825, lng: 128.3870, description: 'Usaha kerajinan anyaman tradisional', status: 'Aktif', address: 'Dusun 1', notes: 'Produk: Tas, Topi, Anyaman' },
  { name: 'Jembatan Sungai Maba', category: 'jalan', lat: 0.6815, lng: 128.3845, description: 'Jembatan penghubung antar dusun', status: 'Aktif', address: 'Sungai Maba', notes: 'Panjang: 45 meter' },
  { name: 'Sumur Bor Desa', category: 'air', lat: 0.6850, lng: 128.3800, description: 'Sarana air bersih masyarakat', status: 'Aktif', address: 'Dusun 2', notes: 'Kapasitas: 10.000 liter/hari' },
];

export default function MarkerManagementPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [markers, setMarkers] = useState<MarkerItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMarker, setEditingMarker] = useState<MarkerItem | null>(null);
  const [deletingMarker, setDeletingMarker] = useState<MarkerItem | null>(null);
  const [viewingMarker, setViewingMarker] = useState<MarkerItem | null>(null);
  const [formData, setFormData] = useState<Omit<MarkerItem, 'id'>>({
    name: '',
    category: 'kantor',
    lat: 0,
    lng: 0,
    description: '',
    status: 'Aktif',
    address: '',
    notes: '',
  });

  useEffect(() => {
    let stored = markerManager.getAll();
    if (stored.length === 0) {
      markerManager.importData(defaultMarkers);
      stored = markerManager.getAll();
    }
    setMarkers(stored as MarkerItem[]);
  }, []);

  const filteredMarkers = markers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                       m.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || m.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    setEditingMarker(null);
    setFormData({ name: '', category: 'kantor', lat: 0, lng: 0, description: '', status: 'Aktif', address: '', notes: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (marker: MarkerItem) => {
    setEditingMarker(marker);
    setFormData({
      name: marker.name,
      category: marker.category,
      lat: marker.lat,
      lng: marker.lng,
      description: marker.description,
      status: marker.status,
      address: marker.address || '',
      notes: marker.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (marker: MarkerItem) => {
    setDeletingMarker(marker);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (marker: MarkerItem) => {
    setViewingMarker(marker);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMarker) {
      markerManager.update(editingMarker.id, formData);
    } else {
      markerManager.create(formData);
    }
    setMarkers(markerManager.getAll() as MarkerItem[]);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingMarker) {
      markerManager.delete(deletingMarker.id);
      setMarkers(markerManager.getAll() as MarkerItem[]);
    }
  };

  const handleExport = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: markers.map(m => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [m.lng, m.lat] },
        properties: { name: m.name, category: m.category, description: m.description, status: m.status, address: m.address, notes: m.notes }
      }))
    };
    downloadFile(JSON.stringify(geojson, null, 2), 'markers-maba-sangaji.geojson');
  };

  const handleExportCSV = () => {
    exportToCSV(markers, 'markers-maba-sangaji.csv');
  };

  const categoryCounts = markers.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manajemen Marker</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola semua marker pada peta digital desa</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Marker
            </button>
            <button onClick={() => onNavigate('peta')} className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Lihat di Peta
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Total Marker</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{markers.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Kategori</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{Object.keys(categoryCounts).length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Aktif</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{markers.filter(m => m.status === 'Aktif').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Ditampilkan</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{filteredMarkers.length}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari marker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="all">Semua Kategori</option>
            {markerCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name} ({categoryCounts[cat.id] || 0})</option>
            ))}
          </select>
          <button onClick={handleExport} className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-medium flex items-center gap-1">
            <Download className="w-4 h-4" /> GeoJSON
          </button>
          <button onClick={handleExportCSV} className="px-3 py-2 rounded-lg bg-violet-100 text-violet-700 text-sm font-medium flex items-center gap-1">
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {/* Markers Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Nama</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Kategori</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Koordinat</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada marker ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredMarkers.map(marker => {
                  const cat = markerCategories.find(c => c.id === marker.category);
                  return (
                    <tr key={marker.id} className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-700">{marker.name}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs">
                          {cat?.icon} {cat?.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-xs">{marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${marker.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {marker.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <button onClick={() => handleView(marker)} className="p-1.5 rounded-lg hover:bg-sky-100 text-sky-600 transition-colors" title="Lihat">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEdit(marker)} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(marker)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">Menampilkan {filteredMarkers.length} dari {markers.length} marker</p>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMarker ? 'Edit Marker' : 'Tambah Marker'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Marker" name="name" type="text" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} placeholder="Masukkan nama marker" required />
          <FormField label="Kategori" name="category" type="select" value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} options={markerCategories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }))} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Latitude" name="lat" type="number" value={formData.lat} onChange={(value) => setFormData({ ...formData, lat: value })} placeholder="0.6833" required />
            <FormField label="Longitude" name="lng" type="number" value={formData.lng} onChange={(value) => setFormData({ ...formData, lng: value })} placeholder="128.3833" required />
          </div>
          <FormField label="Deskripsi" name="description" type="textarea" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} placeholder="Masukkan deskripsi" required />
          <FormField label="Alamat" name="address" type="text" value={formData.address} onChange={(value) => setFormData({ ...formData, address: value })} placeholder="Masukkan alamat" />
          <FormField label="Status" name="status" type="select" value={formData.status} onChange={(value) => setFormData({ ...formData, status: value })} options={[{ value: 'Aktif', label: 'Aktif' }, { value: 'Tidak Aktif', label: 'Tidak Aktif' }]} required />
          <FormField label="Catatan" name="notes" type="textarea" value={formData.notes} onChange={(value) => setFormData({ ...formData, notes: value })} placeholder="Catatan tambahan" />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Batal</button>
            <button type="submit" className="flex-1 py-2 rounded-xl gradient-primary text-white text-sm font-medium">{editingMarker ? 'Simpan Perubahan' : 'Tambah Marker'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={viewingMarker?.name || ''} size="lg">
        {viewingMarker && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
              <p className="text-xs text-sky-700 font-semibold mb-1">Koordinat</p>
              <p className="text-sm text-sky-900">{viewingMarker.lat.toFixed(6)}, {viewingMarker.lng.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Kategori</p>
              <p className="text-sm text-slate-700">{markerCategories.find(c => c.id === viewingMarker.category)?.icon} {markerCategories.find(c => c.id === viewingMarker.category)?.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Deskripsi</p>
              <p className="text-sm text-slate-700">{viewingMarker.description}</p>
            </div>
            {viewingMarker.address && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Alamat</p>
                <p className="text-sm text-slate-700">{viewingMarker.address}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${viewingMarker.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                {viewingMarker.status}
              </span>
            </div>
            {viewingMarker.notes && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Catatan</p>
                <p className="text-sm text-slate-700">{viewingMarker.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Marker"
        message={`Apakah Anda yakin ingin menghapus marker "${deletingMarker?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="danger"
      />
    </div>
  );
}
