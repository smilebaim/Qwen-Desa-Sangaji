import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Upload, Plus, Edit, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Modal, ConfirmDialog, FormField } from './Modal';
import { exportToCSV } from '../utils/crudManager';

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
  render?: (value: any, row: any) => React.ReactNode;
}

interface CRUDTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onCreate: (item: any) => void;
  onUpdate: (id: number, item: any) => void;
  onDelete: (id: number) => void;
  searchKeys?: string[];
}

export function CRUDTable({ title, columns, data, onCreate, onUpdate, onDelete, searchKeys }: CRUDTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const perPage = 10;

  const filtered = useMemo(() => {
    if (!search) return data;
    const keys = searchKeys || columns.map(c => c.key);
    return data.filter(row => keys.some(key => String(row[key] ?? '').toLowerCase().includes(search.toLowerCase())));
  }, [data, search, columns, searchKeys]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdate(editingItem.id, formData);
    } else {
      onCreate(formData);
    }
    setIsModalOpen(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleExport = () => {
    exportToCSV(data, `${title.toLowerCase().replace(/\s+/g, '-')}-data.csv`);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const items = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const item: any = {};
        headers.forEach((header, idx) => {
          item[header] = values[idx] || '';
        });
        return item;
      });
      items.forEach(item => onCreate(item));
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="glass-card p-3 sm:p-6">
        <div className="flex flex-col gap-3 mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button onClick={handleAdd} className="flex-1 sm:flex-none px-3 py-2 rounded-lg gradient-primary text-white text-sm font-medium flex items-center justify-center gap-1 whitespace-nowrap">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tambah</span><span className="sm:hidden">Tambah</span>
              </button>
              <button onClick={handleExport} className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-medium flex items-center justify-center gap-1 whitespace-nowrap">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Ekspor</span>
              </button>
              <label className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-violet-100 text-violet-700 text-sm font-medium flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap">
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Impor</span>
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map(col => (
                  <th key={col.key} className="text-left py-2 sm:py-3 px-2 sm:px-3 font-semibold text-slate-600 whitespace-nowrap">{col.label}</th>
                ))}
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-semibold text-slate-600 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-8 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Tidak ada data</p>
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr key={row.id || idx} className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors">
                    {columns.map(col => (
                      <td key={col.key} className="py-2 sm:py-3 px-2 sm:px-3 text-slate-700 whitespace-nowrap">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    <td className="py-2 sm:py-3 px-2 sm:px-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(row)} className="p-1.5 rounded-lg hover:bg-sky-100 text-sky-600 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-3 sm:mt-4">
            <p className="text-[10px] sm:text-xs text-slate-500">Menampilkan {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs text-slate-600">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `Edit ${title}` : `Tambah ${title}`} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {columns.filter(col => col.key !== 'id').map(col => (
            <FormField
              key={col.key}
              label={col.label}
              name={col.key}
              type={col.type || 'text'}
              value={formData[col.key] || ''}
              onChange={(value) => setFormData({ ...formData, [col.key]: value })}
              placeholder={`Masukkan ${col.label.toLowerCase()}`}
              required={col.required}
              options={col.options}
            />
          ))}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
              Batal
            </button>
            <button type="submit" className="flex-1 py-2 rounded-xl gradient-primary text-white text-sm font-medium">
              {editingItem ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deletingItem && onDelete(deletingItem.id)}
        title="Hapus Data"
        message={`Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="danger"
      />
    </>
  );
}
