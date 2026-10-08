'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Building2, MapPin, CheckCircle, Loader2,
  ChevronRight, Globe, AlertCircle, Store, ArrowRight,
} from 'lucide-react';
import { PostcodeResult } from '@/types';

const INDUSTRIES = [
  'Retail & Supermarket',
  'Fashion & Apparel',
  'Electronics & Gadgets',
  'Food & Beverage',
  'Pharmacy & Health',
  'Agriculture & Farm Produce',
  'Auto Parts & Accessories',
  'Furniture & Home Goods',
  'Telecommunications',
  'Other',
];

type Step = 1 | 2 | 3 | 4;

interface BusinessInfo {
  name: string;
  industry: string;
}

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [business, setBusiness] = useState<BusinessInfo>({ name: '', industry: '' });
  const [postcode, setPostcode] = useState('');
  const [postcodeResult, setPostcodeResult] = useState<PostcodeResult | null>(null);
  const [postcodeError, setPostcodeError] = useState('');
  const [postcodeLoading, setPostcodeLoading] = useState(false);

  async function lookupPostcode() {
    if (!postcode.trim()) {
      setPostcodeError('Please enter your NIPOST digital postcode.');
      return;
    }
    setPostcodeLoading(true);
    setPostcodeError('');
    setPostcodeResult(null);
    try {
      const res = await fetch(`/api/postcode?code=${encodeURIComponent(postcode.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setPostcodeError(data.error ?? 'Postcode lookup failed.');
      } else {
        setPostcodeResult(data as PostcodeResult);
      }
    } catch {
      setPostcodeError('Network error. Please try again.');
    } finally {
      setPostcodeLoading(false);
    }
  }

  function canAdvance(): boolean {
    if (step === 2) return business.name.trim().length >= 2 && business.industry !== '';
    if (step === 3) return postcodeResult !== null;
    return true;
  }

  function advance() {
    if (step < 4) setStep((s) => (s + 1) as Step);
  }

  const STEPS = [
    { num: 1, label: 'Welcome' },
    { num: 2, label: 'Business' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Terminal' },
  ];

  return (
    <div className="min-h-screen bg-[#040817] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00d4ff] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center">
            <Shield size={18} className="text-[#040817]" />
          </div>
          <span className="text-2xl font-black tracking-widest text-white">
            TRA<span className="text-[#00d4ff]">-SYNC</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step > s.num
                      ? 'bg-[#00d4ff] text-[#040817]'
                      : step === s.num
                      ? 'bg-gradient-to-br from-[#00d4ff] to-[#0066ff] text-[#040817]'
                      : 'bg-[#0f1a3e] text-slate-500 border border-[#1a2550]'
                  }`}
                >
                  {step > s.num ? <CheckCircle size={14} /> : s.num}
                </div>
                <span className={`text-[10px] font-medium ${step >= s.num ? 'text-[#00d4ff]' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mt-[-12px] transition-all duration-500 ${step > s.num ? 'bg-[#00d4ff]' : 'bg-[#1a2550]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card p-8 animate-slide-up">
          {/* ── Step 1: Welcome ──────────────────────────────────────────── */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00d4ff20] to-[#0066ff20] border border-[#00d4ff25] flex items-center justify-center mx-auto mb-6 animate-float">
                <Shield size={36} className="text-[#00d4ff]" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Welcome to TRA-SYNC</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Let&apos;s set up your merchant terminal in 3 quick steps. You&apos;ll be protected from
                payment fraud within minutes.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Building2, label: 'Business Info', color: '#00d4ff' },
                  { icon: Globe,     label: 'NIPOST Address', color: '#a855f7' },
                  { icon: CheckCircle, label: 'Go Live',     color: '#00ff87' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-[#0f1a3e] rounded-xl p-4 flex flex-col items-center gap-2">
                      <Icon size={20} style={{ color: item.color }} />
                      <span className="text-slate-400 text-xs text-center">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <button id="onboard-start" onClick={advance} className="btn-primary w-full flex items-center justify-center gap-2">
                Let&apos;s Begin <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 2: Business Info ────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00d4ff20] border border-[#00d4ff25] flex items-center justify-center">
                  <Building2 size={20} className="text-[#00d4ff]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Business Information</h2>
                  <p className="text-slate-500 text-sm">Tell us about your business</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Business Name</label>
                  <div className="relative">
                    <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="onboard-biz-name"
                      type="text"
                      className="input-field pl-10"
                      placeholder="Chidi Superstore"
                      value={business.name}
                      onChange={(e) => setBusiness((b) => ({ ...b, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Industry Type</label>
                  <select
                    id="onboard-industry"
                    className="input-field appearance-none"
                    value={business.industry}
                    onChange={(e) => setBusiness((b) => ({ ...b, industry: e.target.value }))}
                  >
                    <option value="" disabled>Select your industry…</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="onboard-biz-next"
                onClick={advance}
                disabled={!canAdvance()}
                className="btn-primary w-full mt-8 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 3: NIPOST Postcode ──────────────────────────────────── */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#a855f720] border border-[#a855f725] flex items-center justify-center">
                  <MapPin size={20} className="text-[#a855f7]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">NIPOST Address Verification</h2>
                  <p className="text-slate-500 text-sm">Verify your physical business location</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Enter your NIPOST digital postcode to anchor your terminal to a verified address.
                <span className="text-[#00d4ff]"> Try: LA-100001-0842</span>
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  id="onboard-postcode"
                  type="text"
                  className="input-field font-mono tracking-widest flex-1"
                  placeholder="LA-100001-0842"
                  value={postcode}
                  onChange={(e) => { setPostcode(e.target.value.toUpperCase()); setPostcodeError(''); setPostcodeResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && lookupPostcode()}
                />
                <button
                  id="onboard-postcode-verify"
                  onClick={lookupPostcode}
                  disabled={postcodeLoading}
                  className="btn-ghost px-4 shrink-0 flex items-center gap-2 disabled:opacity-60"
                >
                  {postcodeLoading ? <Loader2 size={16} className="animate-spin" /> : 'Verify'}
                </button>
              </div>

              {postcodeError && (
                <div className="flex items-start gap-2 bg-[#450a0a] border border-[#f8717130] text-[#f87171] text-sm px-4 py-3 rounded-lg mb-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {postcodeError}
                </div>
              )}

              {postcodeResult && (
                <div className="bg-[#0a1f10] border border-[#34d39930] rounded-xl p-5 mb-4 animate-slide-up">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-[#34d399]" />
                    <span className="text-[#34d399] font-semibold text-sm">Location Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Street</span>
                      <span className="text-white font-medium">{postcodeResult.street}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">LGA</span>
                      <span className="text-white font-medium">{postcodeResult.lga}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">State</span>
                      <span className="text-white font-medium">{postcodeResult.state}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Coordinates</span>
                      <span className="text-[#00d4ff] font-mono text-xs">
                        {postcodeResult.lat.toFixed(4)}°N {postcodeResult.lng.toFixed(4)}°E
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                id="onboard-location-next"
                onClick={advance}
                disabled={!canAdvance()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Location <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 4: Terminal Ready ───────────────────────────────────── */}
          {step === 4 && (
            <div className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00ff87] to-[#00d4ff] opacity-20 absolute inset-0 animate-ping" />
                <div className="w-24 h-24 rounded-full bg-[#0a1f10] border-2 border-[#00ff87] flex items-center justify-center relative">
                  <CheckCircle size={40} className="text-[#00ff87]" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Terminal Ready!</h2>
              <p className="text-slate-400 mb-2">
                <span className="text-white font-semibold">{business.name || 'Your Business'}</span> is now
                enrolled in TRA-SYNC anti-fraud protection.
              </p>
              {postcodeResult && (
                <p className="text-[#00d4ff] text-sm mb-8">
                  📍 {postcodeResult.street}, {postcodeResult.lga}, {postcodeResult.state}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0a1f10] border border-[#00ff8730] rounded-xl p-4">
                  <div className="text-[#00ff87] font-bold text-lg">ACTIVE</div>
                  <div className="text-slate-500 text-xs mt-1">Fraud Shield</div>
                </div>
                <div className="bg-[#0f1a3e] border border-[#00d4ff30] rounded-xl p-4">
                  <div className="text-[#00d4ff] font-bold text-lg">LOCKED</div>
                  <div className="text-slate-500 text-xs mt-1">Inventory Guard</div>
                </div>
              </div>
              <button
                id="onboard-go-dashboard"
                onClick={() => router.push('/dashboard')}
                className="btn-primary w-full flex items-center justify-center gap-2 animate-pulse-glow"
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
              <button
                onClick={() => router.push('/pos')}
                className="btn-ghost w-full mt-3 flex items-center justify-center gap-2"
                id="onboard-go-pos"
              >
                Open POS Terminal
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Step {step} of 4 · TRA-SYNC Onboarding
        </p>
      </div>
    </div>
  );
}
