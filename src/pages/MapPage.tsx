import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Search, Layers, ZoomIn, ZoomOut, Maximize2, Crosshair, X, Download, Edit, Trash2 } from 'lucide-react';
import { demoMarkers, markerCategories } from '../data/demoData';

function createCategoryIcon(color: string, emoji: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 14px;">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

interface MapMarker {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  status: string;
}

function MapClickHandler({ onMapClick, isAdding }: { onMapClick: (lat: number, lng: number) => void; isAdding: boolean }) {
  useMapEvents({
    click(e) {
      if (isAdding) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPage() {
  const [markers, setMarkers] = useState<MapMarker[]>(demoMarkers);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showPanel, setShowPanel] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingMarker, setEditingMarker] = useState<MapMarker | null>(null);
  const [newMarkerForm, setNewMarkerForm] = useState({ name: '', description: '', category: 'kantor', lat: 0, lng: 0 });
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<string[]>(markerCategories.map(c => c.id));
  const mapRef = useRef<L.Map>(null);

  const defaultCenter: [number, number] = [0.6833, 128.3833];

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setNewMarkerForm(prev => ({ ...prev, lat, lng }));
  }, []);

  const addMarker = () => {
    if (!newMarkerForm.name || !newMarkerForm.lat || !newMarkerForm.lng) return;
    const newMarker: MapMarker = { id: Date.now(), name: newMarkerForm.name, category: newMarkerForm.category, lat: newMarkerForm.lat, lng: newMarkerForm.lng, description: newMarkerForm.description, status: 'Aktif' };
    setMarkers(prev => [...prev, newMarker]);
    setNewMarkerForm({ name: '', description: '', category: 'kantor', lat: 0, lng: 0 });
    setIsAdding(false);
  };

  const deleteMarker = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus marker ini?')) {
      setMarkers(prev => prev.filter(m => m.id !== id));
      setSelectedMarker(null);
    }
  };

  const updateMarker = () => {
    if (!editingMarker) return;
    setMarkers(prev => prev.map(m => m.id === editingMarker.id ? editingMarker : m));
    setEditingMarker(null);
  };

  const filteredMarkers = markers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || m.category === filterCategory;
    const matchVisible = visibleCategories.includes(m.category);
    return matchSearch && matchCategory && matchVisible;
  });

  const toggleCategory = (catId: string) => {
    setVisibleCategories(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
  };

  const exportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: markers.map(m => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [m.lng, m.lat] }, properties: { name: m.name, category: m.category, description: m.description, status: m.status } }))
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maba-sangaji-markers.geojson';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] relative">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] px-2 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-[10px] sm:text-xs font-medium whitespace-nowrap">
        ⚡ MODE DEMO — Data contoh
      </div>

      <MapContainer center={defaultCenter} zoom={14} className="w-full h-full rounded-xl sm:rounded-2xl" ref={mapRef}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onMapClick={handleMapClick} isAdding={isAdding} />
        {filteredMarkers.map(marker => {
          const cat = markerCategories.find(c => c.id === marker.category);
          return (
            <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={cat ? createCategoryIcon(cat.color, cat.icon) : L.divIcon({ className: 'custom-marker', html: '<div style="background: #0ea5e9; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white;"></div>', iconSize: [28, 28], iconAnchor: [14, 28] })} eventHandlers={{ click: () => setSelectedMarker(marker) }}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-sm text-slate-800">{marker.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{cat?.icon} {cat?.name || marker.category}</p>
                  <p className="text-xs text-slate-600 mt-2">{marker.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2">📍 {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
                  <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full ${marker.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{marker.status}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <AnimatePresence>
        {showPanel && (
          <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} className="absolute top-10 sm:top-12 left-2 sm:left-3 z-[1000] w-[calc(100%-16px)] sm:w-72 glass-card p-3 sm:p-4 max-h-[calc(100%-60px)] sm:max-h-[calc(100%-80px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 text-sm">Panel Kontrol Peta</h3>
              <button onClick={() => setShowPanel(false)} className="p-1 rounded-lg hover:bg-white/60"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari marker..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
            </div>
            <div className="mb-3">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30">
                <option value="all">Semua Kategori</option>
                {markerCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}
              </select>
            </div>
            <div className="space-y-2 mb-3">
              <button onClick={() => setIsAdding(!isAdding)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isAdding ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-sky-100 text-sky-700 border border-sky-200'}`}>
                <Plus className="w-4 h-4" />{isAdding ? 'Batal Tambah' : 'Tambah Marker'}
              </button>
              <button onClick={exportGeoJSON} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Download className="w-4 h-4" />Ekspor GeoJSON
              </button>
              <button onClick={() => setShowLayerControl(!showLayerControl)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-violet-100 text-violet-700 border border-violet-200">
                <Layers className="w-4 h-4" />Kelola Layer
              </button>
            </div>
            {showLayerControl && (
              <div className="mb-3 p-3 rounded-lg bg-white/60 border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-2">Kategori Marker</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {markerCategories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/50 p-1 rounded">
                      <input type="checkbox" checked={visibleCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                      <span>{cat.icon}</span><span className="text-slate-600">{cat.name}</span>
                      <span className="ml-auto text-slate-400">{markers.filter(m => m.category === cat.id).length}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-slate-500 text-center">Menampilkan {filteredMarkers.length} dari {markers.length} marker</div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showPanel && (
        <button onClick={() => setShowPanel(true)} className="absolute top-12 left-3 z-[1000] p-2 glass-card rounded-xl"><Layers className="w-5 h-5 text-slate-600" /></button>
      )}

      <div className="absolute top-10 sm:top-12 right-2 sm:right-3 z-[1000] space-y-1.5 sm:space-y-2">
        <button onClick={() => mapRef.current?.zoomIn()} className="p-1.5 sm:p-2 glass-card rounded-lg sm:rounded-xl hover:bg-white/90 transition-colors"><ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /></button>
        <button onClick={() => mapRef.current?.zoomOut()} className="p-1.5 sm:p-2 glass-card rounded-lg sm:rounded-xl hover:bg-white/90 transition-colors"><ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /></button>
        <button onClick={() => mapRef.current?.setView(defaultCenter, 14)} className="p-1.5 sm:p-2 glass-card rounded-lg sm:rounded-xl hover:bg-white/90 transition-colors" title="Kembali ke tampilan awal"><Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /></button>
        <button onClick={() => { if (document.fullscreenElement) { document.exitFullscreen(); } else { document.documentElement.requestFullscreen(); } }} className="p-1.5 sm:p-2 glass-card rounded-lg sm:rounded-xl hover:bg-white/90 transition-colors" title="Layar penuh"><Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /></button>
      </div>

      {isAdding && newMarkerForm.lat !== 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] glass-card p-4 w-80">
          <h4 className="font-semibold text-sm text-slate-800 mb-3">Marker Baru</h4>
          <div className="space-y-2">
            <input type="text" placeholder="Nama marker" value={newMarkerForm.name} onChange={(e) => setNewMarkerForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
            <select value={newMarkerForm.category} onChange={(e) => setNewMarkerForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30">
              {markerCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}
            </select>
            <input type="text" placeholder="Deskripsi" value={newMarkerForm.description} onChange={(e) => setNewMarkerForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
            <p className="text-[10px] text-slate-500">Koordinat: {newMarkerForm.lat.toFixed(4)}, {newMarkerForm.lng.toFixed(4)}</p>
            <div className="flex gap-2">
              <button onClick={addMarker} className="flex-1 py-2 rounded-lg gradient-primary text-white text-sm font-medium">Simpan</button>
              <button onClick={() => { setIsAdding(false); setNewMarkerForm({ name: '', description: '', category: 'kantor', lat: 0, lng: 0 }); }} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600">Batal</button>
            </div>
          </div>
        </motion.div>
      )}

      {selectedMarker && !isAdding && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-4 right-3 z-[1000] glass-card p-4 w-72">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-sm text-slate-800">{selectedMarker.name}</h4>
            <button onClick={() => setSelectedMarker(null)} className="p-1 rounded hover:bg-white/60"><X className="w-3 h-3 text-slate-400" /></button>
          </div>
          <p className="text-xs text-slate-500">{markerCategories.find(c => c.id === selectedMarker.category)?.icon} {markerCategories.find(c => c.id === selectedMarker.category)?.name}</p>
          <p className="text-xs text-slate-600 mt-2">{selectedMarker.description}</p>
          <p className="text-[10px] text-slate-400 mt-2">📍 {selectedMarker.lat.toFixed(4)}, {selectedMarker.lng.toFixed(4)}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { setEditingMarker({ ...selectedMarker }); setSelectedMarker(null); }} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-sky-100 text-sky-700 text-xs font-medium"><Edit className="w-3 h-3" /> Edit</button>
            <button onClick={() => deleteMarker(selectedMarker.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium"><Trash2 className="w-3 h-3" /> Hapus</button>
          </div>
        </motion.div>
      )}

      {editingMarker && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-96">
            <h3 className="font-semibold text-slate-800 mb-4">Edit Marker</h3>
            <div className="space-y-3">
              <input type="text" value={editingMarker.name} onChange={(e) => setEditingMarker({ ...editingMarker, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm" placeholder="Nama" />
              <select value={editingMarker.category} onChange={(e) => setEditingMarker({ ...editingMarker, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm">
                {markerCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}
              </select>
              <textarea value={editingMarker.description} onChange={(e) => setEditingMarker({ ...editingMarker, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm" placeholder="Deskripsi" rows={3} />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.0001" value={editingMarker.lat} onChange={(e) => setEditingMarker({ ...editingMarker, lat: parseFloat(e.target.value) })} className="px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm" placeholder="Latitude" />
                <input type="number" step="0.0001" value={editingMarker.lng} onChange={(e) => setEditingMarker({ ...editingMarker, lng: parseFloat(e.target.value) })} className="px-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm" placeholder="Longitude" />
              </div>
              <div className="flex gap-2">
                <button onClick={updateMarker} className="flex-1 py-2 rounded-lg gradient-primary text-white text-sm font-medium">Simpan Perubahan</button>
                <button onClick={() => setEditingMarker(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600">Batal</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
