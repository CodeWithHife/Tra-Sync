'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Mail, Phone, User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

type Tab = 'login' | 'signup';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const INIT: FormState = { fullName: '', email: '', phone: '', password: '' };

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [form, setForm] = useState<FormState>(INIT);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }
    if (tab === 'signup' && !form.fullName) {
      setError('Full name is required for registration.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    // Simulate authentication delay
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push('/onboard');
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-white font-sans flex flex-col justify-between px-4 py-8 relative overflow-hidden selection:bg-[#10B981] selection:text-[#090D16]">
      {/* Background radial lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10B981]/10 via-[#10B981]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header Link */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between z-10">
        <button
          onClick={() => router.push('/')}
          className="text-slate-400 hover:text-[#10B981] text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <span className="text-slate-500 font-mono text-[11px]">NIPOST SECURED</span>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md mx-auto my-auto py-6 relative z-10">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div 
            onClick={() => router.push('/')}
            className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] mb-3 shadow-lg shadow-[#10B981]/15 cursor-pointer hover:scale-105 transition-transform"
          >
            <Shield className="w-6 h-6 fill-[#10B981]/20" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            TRA<span className="text-[#10B981]">-SYNC</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium mt-1">Access Verified Merchant Portal</p>
        </div>

        {/* Card Box */}
        <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-[#10B981]/5">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-6">
            {(['login', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                onClick={() => { setTab(t); setForm(INIT); setError(''); }}
                className={`py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                  tab === t
                    ? 'bg-[#10B981] text-[#090D16] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name — signup only */}
            {tab === 'signup' && (
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-colors outline-none font-medium placeholder:text-slate-600"
                    placeholder="Chidi Okeke"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-colors outline-none font-medium placeholder:text-slate-600"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Phone — signup only */}
            {tab === 'signup' && (
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-phone"
                    type="tel"
                    className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-colors outline-none font-medium placeholder:text-slate-600"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white rounded-xl pl-10 pr-10 py-3 text-sm transition-colors outline-none font-medium placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#10B981] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/40 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#090D16] border-t-transparent rounded-full animate-spin" />
                  <span>{tab === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                </>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In to Portal' : 'Create Merchant Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Tab Switcher Link */}
          <p className="text-center text-slate-400 text-xs mt-6">
            {tab === 'login' ? "Don't have a merchant account? " : 'Already registered? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setForm(INIT); setError(''); }}
              className="text-[#10B981] hover:underline font-bold"
            >
              {tab === 'login' ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>

      {/* Footer Note */}
      <div className="text-center text-slate-500 text-[11px] font-mono z-10">
        Protected by TRA-SYNC Real-Time Anti-Fraud Layer · CBN & NIPOST Compliant
      </div>
    </div>
  );
}
