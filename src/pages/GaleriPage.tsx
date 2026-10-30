import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Edit, Trash2, Eye, Calendar, Tag, Search, Grid, List, X } from 'lucide-react';
import { CRUDManager } from '../utils/crudManager';
import { Modal, ConfirmDialog, FormField } from '../components/Modal';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

const galleryManager = new CRUDManager<GalleryItem>('maba_gallery');

const defaultGallery: Omit<GalleryItem, 'id'>[] = [
  {
    title: 'Musyawarah Desa 2024',
    description: 'Kegiatan musyawarah desa untuk pembahasan RKPDes tahun 2025',
    category: 'Pemerintahan',
    date: '2024-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
    tags: ['musyawarah', 'perencanaan', 'desa'],
  },
  {
    title: 'Pembangunan Jalan Desa',
    description: 'Progres pembangunan jalan desa sepanjang 2.5 km',
    category: 'Infrastruktur',
    date: '2024-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop',
    tags: ['pembangunan', 'jalan', 'infrastruktur'],
  },
  {
    title: 'Posyandu Balita',
    description: 'Kegiatan posyandu rutin untuk pemeriksaan kesehatan balita',
    category: 'Kesehatan',
    date: '2024-01-08',
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop',
    tags: ['kesehatan', 'balita', 'posyandu'],
  },
  {
    title: 'Panen Raya Padi',
    description: 'Petani desa melakukan panen raya padi di lahan 50 hektar',
    category: 'Pertanian',
    date: '2024-01-05',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    tags: ['pertanian', 'panen', 'padi'],
  },
  {
    title: 'Pelatihan UMKM',
    description: 'Pelatihan pengelolaan UMKM untuk pelaku usaha desa',
    category: 'Ekonomi',
    date: '2024-01-03',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    tags: ['umkm', 'pelatihan', 'ekonomi'],
  },
  {
    title: 'Festival Budaya Desa',
    description: 'Festival budaya tahunan untuk melestarikan tradisi lokal',
    category: 'Budaya',
    date: '2023-12-28',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    tags: ['budaya', 'festival', 'tradisi'],
  },
];

export default function GaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    description: '',
    category: '',
    date: '',
    imageUrl: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    let stored = galleryManager.getAll();
    if (stored.length === 0) {
      galleryManager.importData(defaultGallery);
      stored = galleryManager.getAll();
    }
    setGallery(stored as GalleryItem[]);
  }, []);

  const categories = ['all', ...Array.from(new Set(gallery.map(item => item.category)))];

  const filteredGallery = gallery.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', category: '', date: '', imageUrl: '', tags: [] });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      date: item.date,
      imageUrl: item.imageUrl,
      tags: item.tags,
    });
    setTagInput(item.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = (item: GalleryItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (item: GalleryItem) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(',').map(t => t.trim()).filter(t => t);
    const dataWithTags = { ...formData, tags };

    if (editingItem) {
      galleryManager.update(editingItem.id, dataWithTags);
    } else {
      galleryManager.create(dataWithTags);
    }
    setGallery(galleryManager.getAll() as GalleryItem[]);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      galleryManager.delete(deletingItem.id);
      setGallery(galleryManager.getAll() as GalleryItem[]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Galeri Dokumentasi</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola foto dan dokumentasi kegiatan desa</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Dokumentasi
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari dokumentasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'Semua Kategori' : cat}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid/List */}
      {filteredGallery.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Tidak ada dokumentasi ditemukan</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="flex-1 py-2 rounded-lg bg-white/90 text-slate-800 text-xs font-medium flex items-center justify-center gap-1 hover:bg-white"
                    >
                      <Eye className="w-3.5 h-3.5" /> Lihat
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg bg-white/90 text-sky-600 hover:bg-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-800 line-clamp-1">{item.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-medium whitespace-nowrap">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString('id-ID')}
                  </div>
                  <div className="flex gap-1">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4 flex gap-4"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-medium">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-2">{item.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Dokumentasi' : 'Tambah Dokumentasi'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Judul"
            name="title"
            type="text"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="Masukkan judul dokumentasi"
            required
          />
          <FormField
            label="Deskripsi"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Masukkan deskripsi dokumentasi"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Kategori"
              name="category"
              type="text"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="Contoh: Pemerintahan, Infrastruktur"
              required
            />
            <FormField
              label="Tanggal"
              name="date"
              type="date"
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value })}
              required
            />
          </div>
          <FormField
            label="URL Gambar"
            name="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={(value) => setFormData({ ...formData, imageUrl: value })}
            placeholder="https://example.com/image.jpg"
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Masukkan tag"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded-lg bg-sky-100 text-sky-700 text-sm font-medium"
              >
                Tambah
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {formData.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
              Batal
            </button>
            <button type="submit" className="flex-1 py-2 rounded-xl gradient-primary text-white text-sm font-medium">
              {editingItem ? 'Simpan Perubahan' : 'Tambah Dokumentasi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={viewingItem?.title || ''} size="xl">
        {viewingItem && (
          <div className="space-y-4">
            <img src={viewingItem.imageUrl} alt={viewingItem.title} className="w-full h-96 object-cover rounded-xl" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-medium">
                  {viewingItem.category}
                </span>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(viewingItem.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <p className="text-slate-700">{viewingItem.description}</p>
              <div className="flex gap-2 flex-wrap mt-3">
                {viewingItem.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Dokumentasi Dokumentasi"
        message={`Apakah Anda yakin ingin menghapus "${deletingItem?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="danger"
      />
    </div>
  );
}
