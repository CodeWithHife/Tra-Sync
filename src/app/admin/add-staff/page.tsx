'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, UserPlus, ArrowLeft, Mail, User, Phone, Briefcase, Hash, Lock, CheckCircle, Loader2
} from 'lucide-react';

export default function AddStaffPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'cashier',
    terminal: 'T1',
    password: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    setLoading(false);
    setSuccess(true);
    
    // Redirect back to admin after success
    setTimeout(() => {
      router.push('/admin');
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-[#FFFFFF] font-sans flex flex-col">
      {/* ── Top Nav ──────────────────────────────────────────────────────── */}
      <header className="bg-[#0B132B]/80 backdrop-blur-md border-b border-[#1E2A4F] px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-[#111C3A] border border-[#1E2A4F] flex items-center justify-center text-[#94A3B8] hover:text-[#FFFFFF] hover:border-[#334155] transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E676] to-[#00B359] flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.5)]">
            <Shield size={16} className="text-[#0A0F1D]" />
          </div>
          <span className="font-black tracking-widest text-[#FFFFFF] text-xl drop-shadow-md">
            TRA<span className="text-[#00E676]">-SYNC</span>
          </span>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E676]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00B359]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-xl bg-[#111C3A]/80 backdrop-blur-xl border border-[#1E2A4F] rounded-3xl p-8 shadow-2xl relative z-10 animate-slide-up">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,230,118,0.15)]">
              <UserPlus size={28} className="text-[#00E676]" />
            </div>
            <h1 className="text-3xl font-black text-[#FFFFFF] mb-2">Add New Staff</h1>
            <p className="text-[#94A3B8] text-sm">Register a new cashier or administrator</p>
          </div>

          {success ? (
            <div className="bg-[#00E676]/10 border border-[#00E676]/30 rounded-2xl p-8 text-center animate-slide-up">
              <CheckCircle size={48} className="text-[#00E676] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#00E676] mb-2">Staff Registered Successfully</h2>
              <p className="text-[#94A3B8] text-sm">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <User size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-[#0A0F1D] border border-[#1E2A4F] rounded-xl py-3.5 pl-12 pr-4 text-[#FFFFFF] placeholder-[#475569] focus:outline-none focus:border-[#00E676] transition-colors"
                    placeholder="Chidi Bankole"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <Mail size={18} />
                    </div>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#0A0F1D] border border-[#1E2A4F] rounded-xl py-3.5 pl-12 pr-4 text-[#FFFFFF] placeholder-[#475569] focus:outline-none focus:border-[#00E676] transition-colors"
                      placeholder="chidi@trasync.io"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider pl-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <Phone size={18} />
                    </div>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#0A0F1D] border border-[#1E2A4F] rounded-xl py-3.5 pl-12 pr-4 text-[#FFFFFF] placeholder-[#475569] focus:outline-none focus:border-[#00E676] transition-colors"
                      placeholder="0801 234 5678"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider pl-1">System Role</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                      <Briefcase size={18} />
                    </div>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-[#0A0F1D] border border-[#1E2A4F] rounded-xl py-3.5 pl-12 pr-4 text-[#FFFFFF] appearance-none focus:outline-none focus:border-[#00E676] transition-colors cursor-pointer"
                    >
                      <option value="cashier">Cashier</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                
                {formData.role === 'cashier' && (
                  <div className="space-y-1.5 animate-slide-up">
                    <label className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider pl-1">Assigned Terminal</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                        <Hash size={18} />
                      </div>
                      <select
                        value={formData.terminal}
                        onChange={(e) => setFormData({...formData, terminal: e.target.value})}
                        className="w-full bg-[#0A0F1D] border border-[#1E2A4F] rounded-xl py-3.5 pl-12 pr-4 text-[#FFFFFF] appearance-none focus:outline-none focus:border-[#00E676] transition-colors cursor-pointer"
                      >
                        <option value="T1">Terminal 1</option>
                        <option value="T2">Terminal 2</option>
                        <option value="T3">Terminal 3</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider pl-1">Temporary Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <Lock size={18} />
                  </div>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[#0A0F1D] border border-[#1E2A4F] rounded-xl py-3.5 pl-12 pr-4 text-[#FFFFFF] placeholder-[#475569] focus:outline-none focus:border-[#00E676] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#00E676] text-[#0A0F1D] py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:bg-[#00C853] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Register Staff
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
