'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Mail, Phone, User, Lock, ArrowRight } from 'lucide-react';

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
      setError('Full name is required for signup.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    // Simulate auth delay — swap for real Supabase auth call
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push('/onboard');
  }

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#10B981] opacity-[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#059669] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div 
            onClick={() => router.push('/')}
            className="cursor-pointer w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center mb-4 shadow-lg shadow-[#10B981]/10 hover:scale-105 transition-transform"
          >
            <Shield size={26} className="text-[#10B981]" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white">
            TRA<span className="text-[#10B981]">-SYNC</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Secure Merchant Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          {/* Tabs */}
          <div className="flex bg-[#090D16] border border-[#1E293B] rounded-xl p-1 mb-8">
            {(['login', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                onClick={() => { setTab(t); setForm(INIT); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  tab === t
                    ? 'bg-[#10B981] text-[#090D16] shadow-md shadow-[#10B981]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name — signup only */}
            {tab === 'signup' && (
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-name"
                    type="text"
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white placeholder:text-slate-600 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
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
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Business Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-email"
                  type="email"
                  className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white placeholder:text-slate-600 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
                  placeholder="you@business.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Phone — signup only */}
            {tab === 'signup' && (
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-phone"
                    type="tel"
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white placeholder:text-slate-600 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
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
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white placeholder:text-slate-600 rounded-xl py-3 pl-11 pr-11 text-sm outline-none transition-all"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#10B981] transition-colors p-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#090D16] border-t-transparent rounded-full animate-spin" />
                  <span>{tab === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                </>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Switch tab hint */}
          <p className="text-center text-slate-400 text-sm mt-6">
            {tab === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setForm(INIT); setError(''); }}
              className="text-[#10B981] hover:underline font-bold ml-1"
            >
              {tab === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6 font-medium">
          Protected by TRA-SYNC Anti-Fraud Layer · End-to-end encrypted
        </p>
      </div>
    </div>
  );
}

