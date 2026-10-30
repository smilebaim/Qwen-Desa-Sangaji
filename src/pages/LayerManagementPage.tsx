import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Edit, Trash2, Eye, EyeOff, Download, Upload } from 'lucide-react';
import { CRUDManager, downloadFile } from '../utils/crudManager';
import { Modal, ConfirmDialog, FormField } from '../components/Modal';

interface LayerItem {
  id: number;
  name: string;
  type: string;
  visible: boolean;
  opacity: number;
  color: string;
  objectCount: number;
  description: string;
  createdAt: string;
}

const layerManager = new CRUDManager<LayerItem>('maba_layers');

const defaultLayers: Omit<LayerItem, 'id'>[] = [
  { name: 'Batas Administrasi Desa', type: 'Polygon', visible: true, opacity: 100, color: '#0ea5e9', objectCount: 1, description: 'Batas wilayah administratif Desa Maba Sangaji', createdAt: '2024-01-01' },
  { name: 'Jalan Desa', type: 'Polyline', visible: true, opacity: 100, color: '#6b7280', objectCount: 8, description: 'Jaringan jalan desa', createdAt: '2024-01-05' },
  { name: 'Area Pertanian', type: 'Polygon', visible: true, opacity: 70, color: '#84cc16', objectCount: 12, description: 'Lahan pertanian dan perkebunan', createdAt: '2024-01-10' },
  { name: 'Area Perikanan', type: 'Polygon', visible: false, opacity: 70, color: '#06b6d4', objectCount: 5, description: 'Area tambak dan perikanan', createdAt: '2024-01-12' },
  { name: 'Zona Pembangunan', type: 'Polygon', visible: true, opacity: 80, color: '#f97316', objectCount: 3, description: 'Area yang sedang dalam pembangunan', createdAt: '2024-01-15' },
  { name: 'Fasilitas Umum', type: 'Marker', visible: true, opacity: 100, color: '#8b5cf6', objectCount: 15, description: 'Marker fasilitas umum desa', createdAt: '2024-01-08' },
  { name: 'Titik Rawan Bencana', type: 'Marker', visible: false, opacity: 100, color: '#ef4444', objectCount: 4, description: 'Lokasi rawan bencana alam', createdAt: '2024-01-20' },
  { name: 'Jaringan Irigasi', type: 'Polyline', visible: true, opacity: 90, color: '#0ea5e9', objectCount: 6, description: 'Saluran irigasi pertanian', createdAt: '2024-01-18' },
  { name: 'Area Permukiman', type: 'Polygon', visible: true, opacity: 60, color: '#ec4899', objectCount: 4, description: 'Kawasan permukiman penduduk', createdAt: '2024-01-22' },
  { name: 'Hutan Lindung', type: 'Polygon', visible: false, opacity: 70, color: '#10b981', objectCount: 2, description: 'Area hutan lindung', createdAt: '2024-01-25' },
];

export default function LayerManagementPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<LayerItem | null>(null);
  const [deletingLayer, setDeletingLayer] = useState<LayerItem | null>(null);
  const [formData, setFormData] = useState<Omit<LayerItem, 'id'>>({
    name: '',
    type: 'Polygon',
    visible: true,
    opacity: 100,
    color: '#0ea5e9',
    objectCount: 0,
    description: '',
    createdAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    let stored = layerManager.getAll();
    if (stored.length === 0) {
      layerManager.importData(defaultLayers);
      stored = layerManager.getAll();
    }
    setLayers(stored as LayerItem[]);
  }, []);

  const handleAdd = () => {
    setEditingLayer(null);
    setFormData({
      name: '',
      type: 'Polygon',
      visible: true,
      opacity: 100,
      color: '#0ea5e9',
      objectCount: 0,
      description: '',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (layer: LayerItem) => {
    setEditingLayer(layer);
    setFormData({
      name: layer.name,
      type: layer.type,
      visible: layer.visible,
      opacity: layer.opacity,
      color: layer.color,
      objectCount: layer.objectCount,
      description: layer.description,
      createdAt: layer.createdAt,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (layer: LayerItem) => {
    setDeletingLayer(layer);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLayer) {
      layerManager.update(editingLayer.id, formData);
    } else {
      layerManager.create(formData);
    }
    setLayers(layerManager.getAll() as LayerItem[]);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingLayer) {
      layerManager.delete(deletingLayer.id);
      setLayers(layerManager.getAll() as LayerItem[]);
    }
  };

  const toggleVisibility = (id: number) => {
    const layer = layers.find(l => l.id === id);
    if (layer) {
      layerManager.update(id, { visible: !layer.visible });
      setLayers(layerManager.getAll() as LayerItem[]);
    }
  };

  const handleExport = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: layers.map(l => ({
        type: 'Feature',
        geometry: null,
        properties: {
          name: l.name,
          type: l.type,
          visible: l.visible,
          opacity: l.opacity,
          color: l.color,
          objectCount: l.objectCount,
          description: l.description,
          createdAt: l.createdAt
        }
      }))
    };
    downloadFile(JSON.stringify(geojson, null, 2), 'layers-maba-sangaji.geojson');
  };

  const totalObjects = layers.reduce((sum, layer) => sum + layer.objectCount, 0);
  const visibleLayers = layers.filter(l => l.visible).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manajemen Layer</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola layer peta digital desa</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Layer
            </button>
            <button onClick={handleExport} className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" /> Ekspor
            </button>
            <button onClick={() => onNavigate('peta')} className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" /> Lihat di Peta
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Total Layer</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{layers.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Layer Aktif</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{visibleLayers}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Total Objek</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalObjects}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4">
          <p className="text-xs text-slate-500">Tipe Layer</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{new Set(layers.map(l => l.type)).size}</p>
        </motion.div>
      </div>

      {/* Layers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: layer.color, opacity: layer.opacity / 100 }} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-700 truncate">{layer.name}</h3>
                  <p className="text-xs text-slate-500">{layer.type} • {layer.objectCount} objek</p>
                </div>
              </div>
              <button
                onClick={() => toggleVisibility(layer.id)}
                className={`p-1.5 rounded-lg transition-colors ${layer.visible ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                title={layer.visible ? 'Sembunyikan' : 'Tampilkan'}
              >
                {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3 line-clamp-2">{layer.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-full bg-slate-200 rounded-full h-1.5 w-20">
                  <div className="h-1.5 rounded-full" style={{ width: `${layer.opacity}%`, backgroundColor: layer.color }} />
                </div>
                <span className="text-xs text-slate-500">{layer.opacity}%</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(layer)} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors" title="Edit">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(layer)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Hapus">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLayer ? 'Edit Layer' : 'Tambah Layer'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Layer" name="name" type="text" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} placeholder="Masukkan nama layer" required />
          <FormField label="Tipe Layer" name="type" type="select" value={formData.type} onChange={(value) => setFormData({ ...formData, type: value })} options={[
            { value: 'Polygon', label: 'Polygon (Area)' },
            { value: 'Polyline', label: 'Polyline (Garis)' },
            { value: 'Marker', label: 'Marker (Titik)' },
          ]} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Jumlah Objek" name="objectCount" type="number" value={formData.objectCount} onChange={(value) => setFormData({ ...formData, objectCount: value })} placeholder="0" required />
            <FormField label="Opacity (%)" name="opacity" type="number" value={formData.opacity} onChange={(value) => setFormData({ ...formData, opacity: value })} placeholder="100" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Warna Layer</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
            />
          </div>
          <FormField label="Deskripsi" name="description" type="textarea" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} placeholder="Masukkan deskripsi layer" required />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor="visible" className="text-sm text-slate-700">Layer terlihat secara default</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Batal</button>
            <button type="submit" className="flex-1 py-2 rounded-xl gradient-primary text-white text-sm font-medium">{editingLayer ? 'Simpan Perubahan' : 'Tambah Layer'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Layer"
        message={`Apakah Anda yakin ingin menghapus layer "${deletingLayer?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="danger"
      />
    </div>
  );
}
