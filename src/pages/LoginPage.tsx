import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username tidak boleh kosong'); return; }
    if (!password.trim()) { setError('Password tidak boleh kosong'); return; }
    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (!success) setError('Username atau password salah.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-decoration bg-decoration-1" />
      <div className="bg-decoration bg-decoration-2" />
      <div className="bg-decoration bg-decoration-3" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="hidden lg:block">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">MABA SANGAJI</h1>
                <p className="text-sm text-slate-500">DIGITAL</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Sistem Informasi dan Pemetaan Desa</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Platform digital terpadu untuk pengelolaan data desa, pemetaan GIS, dan pelayanan administrasi Desa Maba Sangaji.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600"><MapPin className="w-4 h-4 text-sky-500" /><span>Desa Maba Sangaji, Halmahera Timur</span></div>
              <div className="flex items-center gap-3 text-sm text-slate-600"><MapPin className="w-4 h-4 text-sky-500" /><span>Provinsi Maluku Utara, Indonesia</span></div>
              <div className="flex items-center gap-3 text-sm text-slate-600"><MapPin className="w-4 h-4 text-sky-500" /><span>Zona Waktu: WIT (UTC+9)</span></div>
            </div>
            <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-semibold text-amber-700 mb-1">⚡ MODE DEMO</p>
              <p className="text-xs text-amber-600">Gunakan: admin/admin123, operator/operator123, atau gis/gis123</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="glass-card p-8 max-w-md mx-auto">
            <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">MABA SANGAJI</h1>
                <p className="text-xs text-slate-500">DIGITAL</p>
              </div>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Selamat Datang</h2>
              <p className="text-sm text-slate-500 mt-1">Masuk ke sistem informasi desa</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
                </motion.div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all text-sm pr-11" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span className="text-sm text-slate-600">Ingat sesi saya</span>
                </label>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Memproses...</span></>) : (<span>Masuk</span>)}
              </motion.button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-6">© 2024 Maba Sangaji Digital — Sistem Informasi Desa</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
