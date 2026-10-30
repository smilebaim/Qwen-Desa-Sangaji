// CRUD Utility with localStorage persistence
export interface CRUDItem {
  id: number;
  [key: string]: any;
}

export class CRUDManager<T extends CRUDItem> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getById(id: number): T | undefined {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  create(item: Omit<T, 'id'>): T {
    const items = this.getAll();
    const newItem = { ...item, id: Date.now() } as T;
    items.push(newItem);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return newItem;
  }

  update(id: number, updates: Partial<T>): T | undefined {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return items[index];
  }

  delete(id: number): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }

  importData(newItems: Omit<T, 'id'>[]): T[] {
    const items = this.getAll();
    const imported = newItems.map(item => ({ ...item, id: Date.now() + Math.random() * 1000 }) as T);
    const allItems = [...items, ...imported];
    localStorage.setItem(this.storageKey, JSON.stringify(allItems));
    return allItems;
  }

  exportData(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

// Export download helper
export function downloadFile(content: string, filename: string, mimeType: string = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// CSV export helper
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      const escaped = String(value ?? '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(','))
  ].join('\n');
  downloadFile(csvContent, filename, 'text/csv');
}
