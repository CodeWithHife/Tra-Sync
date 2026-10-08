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
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push('/onboard');
  }

  return (
    <div className="min-h-screen bg-[#040817] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#00d4ff] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#a855f7] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center mb-4 animate-pulse-glow">
            <Shield size={26} className="text-[#040817]" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white">
            TRA<span className="text-[#00d4ff]">-SYNC</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Secure Merchant Portal</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Tabs */}
          <div className="flex bg-[#0f1a3e] rounded-lg p-1 mb-8">
            {(['login', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                onClick={() => { setTab(t); setForm(INIT); setError(''); }}
                className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? 'bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-[#040817]'
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
                <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-name"
                    type="text"
                    className="input-field pl-10"
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
              <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Business Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-email"
                  type="email"
                  className="input-field pl-10"
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
                <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-phone"
                    type="tel"
                    className="input-field pl-10"
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
              <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00d4ff] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-[#450a0a] border border-[#f8717130] text-[#f87171] text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#040817] border-t-transparent rounded-full animate-spin" />
                  {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                <>
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Switch tab hint */}
          <p className="text-center text-slate-500 text-sm mt-6">
            {tab === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setForm(INIT); setError(''); }}
              className="text-[#00d4ff] hover:underline font-medium"
            >
              {tab === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Protected by TRA-SYNC Anti-Fraud Layer · End-to-end encrypted
        </p>
      </div>
    </div>
  );
}
