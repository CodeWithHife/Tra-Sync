'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Building2, MapPin, CheckCircle, Loader2,
  ChevronRight, Globe, AlertCircle, Store, ArrowRight, Lock, Sparkles,
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
      setPostcodeError('Please enter your NIPOST digital postcode or street address.');
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
    <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Radial background glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#10B981] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#059669] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div 
          onClick={() => router.push('/')}
          className="flex items-center justify-center gap-2.5 mb-8 sm:mb-10 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:scale-105 transition-transform shadow-md shadow-[#10B981]/10">
            <Shield size={20} className="fill-[#10B981]/20" />
          </div>
          <span className="text-2xl font-black tracking-widest text-white">
            TRA<span className="text-[#10B981]">-SYNC</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 px-2">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step > s.num
                      ? 'bg-[#10B981] text-[#090D16] shadow-md shadow-[#10B981]/20'
                      : step === s.num
                      ? 'bg-[#10B981] text-[#090D16] ring-4 ring-[#10B981]/20 shadow-lg'
                      : 'bg-[#0F172A] text-slate-500 border border-[#1E293B]'
                  }`}
                >
                  {step > s.num ? <CheckCircle size={15} /> : s.num}
                </div>
                <span className={`text-[10px] font-semibold ${step >= s.num ? 'text-[#10B981]' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mt-[-12px] transition-all duration-500 ${step > s.num ? 'bg-[#10B981]' : 'bg-[#1E293B]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 animate-slide-up">
          {/* ── Step 1: Welcome ──────────────────────────────────────────── */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#10B981]/10 animate-float">
                <Shield size={38} className="text-[#10B981]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Welcome to TRA-SYNC</h2>
              <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
                Set up your merchant terminal in 3 quick steps. Start verifying bank transfers
                and preventing fake alert fraud in under 2 minutes.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                {[
                  { icon: Building2, label: 'Business Info', color: '#10B981' },
                  { icon: Globe,     label: 'NIPOST Address', color: '#10B981' },
                  { icon: CheckCircle, label: 'Go Live',     color: '#34d399' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-[#090D16] border border-[#1E293B] rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2">
                      <Icon size={20} style={{ color: item.color }} />
                      <span className="text-slate-400 text-xs text-center font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <button
                id="onboard-start"
                onClick={advance}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2"
              >
                <span>Let&apos;s Begin</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* ── Step 2: Business Info ────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] shrink-0">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Business Information</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">Tell us about your storefront or business</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                    Business Name
                  </label>
                  <div className="relative">
                    <Store size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="onboard-biz-name"
                      type="text"
                      className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white placeholder:text-slate-600 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
                      placeholder="Chidi Superstore"
                      value={business.name}
                      onChange={(e) => setBusiness((b) => ({ ...b, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                    Industry Type
                  </label>
                  <select
                    id="onboard-industry"
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white rounded-xl py-3 px-4 text-sm outline-none transition-all appearance-none cursor-pointer"
                    value={business.industry}
                    onChange={(e) => setBusiness((b) => ({ ...b, industry: e.target.value }))}
                  >
                    <option value="" disabled className="text-slate-500">Select your industry…</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-[#090D16] text-white">{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="onboard-biz-next"
                onClick={advance}
                disabled={!canAdvance()}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 mt-8 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── Step 3: NIPOST Postcode ──────────────────────────────────── */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Location Verification</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">Verify physical store location via NIPOST API</p>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Street Address or NIPOST Digital Postcode
                </label>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    id="onboard-postcode"
                    type="text"
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white placeholder:text-slate-600 rounded-xl py-3 px-4 text-sm outline-none transition-all"
                    placeholder="e.g., 12 Allen Avenue, Ikeja OR LA-100001-0842"
                    value={postcode}
                    onChange={(e) => { setPostcode(e.target.value); setPostcodeError(''); setPostcodeResult(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && lookupPostcode()}
                  />
                  <button
                    id="onboard-postcode-verify"
                    onClick={lookupPostcode}
                    disabled={postcodeLoading}
                    className="bg-[#10B981]/15 border border-[#10B981]/40 hover:bg-[#10B981]/25 text-[#10B981] font-bold px-5 py-3 rounded-xl transition-all shrink-0 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {postcodeLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
                  </button>
                </div>
                <p className="text-slate-500 text-xs mb-5 leading-normal">
                  Enter your address or digital postcode. Demo shortcut: Enter &apos;LA-100001-0842&apos; or &apos;12 Allen Avenue&apos;.
                </p>
              </div>

              {postcodeError && (
                <div className="flex items-start gap-2 bg-red-950/50 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-xl mb-4 font-medium">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{postcodeError}</span>
                </div>
              )}

              {postcodeResult && (
                <div className="bg-[#062c1d]/60 border border-[#10B981]/40 rounded-xl p-4 sm:p-5 mb-6 animate-slide-up space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-[#10B981]" />
                      <span className="text-[#10B981] font-bold text-sm">Location Verified</span>
                    </div>
                    <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      GEOFENCE LOCKED
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs sm:text-sm pt-1 border-t border-[#10B981]/20">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Assigned NIPOST Code</span>
                      <span className="text-[#10B981] font-mono font-bold text-base">{postcodeResult.postcode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Full Address</span>
                      <span className="text-white font-medium">{postcodeResult.street}, {postcodeResult.lga}, {postcodeResult.state} State</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Geofence Coordinates</span>
                      <span className="text-slate-300 font-medium">{postcodeResult.lat.toFixed(4)}° N, {postcodeResult.lng.toFixed(4)}° E</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                id="onboard-location-next"
                onClick={advance}
                disabled={!canAdvance()}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Confirm Location & Proceed</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── Step 4: Terminal Ready ───────────────────────────────────── */}
          {step === 4 && (
            <div className="text-center">
              <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#10B981]/20 opacity-40 absolute inset-0 animate-ping" />
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#062c1d] border-2 border-[#10B981] flex items-center justify-center relative shadow-lg shadow-[#10B981]/30">
                  <CheckCircle size={42} className="text-[#10B981]" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Terminal Ready!</h2>
              <p className="text-slate-300 text-sm sm:text-base mb-2">
                <span className="text-white font-bold">{business.name || 'Your Business'}</span> is now fully enrolled in TRA-SYNC anti-fraud protection.
              </p>
              {postcodeResult && (
                <div className="flex items-center justify-center text-[#10B981] text-xs sm:text-sm font-medium mb-6 gap-1 bg-[#10B981]/10 py-1.5 px-3 rounded-full border border-[#10B981]/20 max-w-sm mx-auto">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{postcodeResult.street}, {postcodeResult.lga}, {postcodeResult.state}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                <div className="bg-[#062c1d]/60 border border-[#10B981]/40 rounded-xl p-4 text-left">
                  <div className="flex items-center gap-1.5 text-[#10B981] font-bold text-base">
                    <Shield size={16} />
                    <span>ACTIVE</span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1 font-medium">Fraud Shield</div>
                </div>
                <div className="bg-[#090D16] border border-[#1E293B] rounded-xl p-4 text-left">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold text-base">
                    <Lock size={16} className="text-[#10B981]" />
                    <span>PROTECTED</span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1 font-medium">Inventory Guard</div>
                </div>
              </div>
              <button
                id="onboard-go-dashboard"
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => router.push('/pos')}
                className="w-full mt-3 bg-transparent border border-[#1E293B] hover:border-[#10B981]/40 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                id="onboard-go-pos"
              >
                <Sparkles size={16} className="text-[#10B981]" />
                <span>Open POS Terminal</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-6 font-medium">
          Step {step} of 4 · TRA-SYNC Merchant Setup
        </p>
      </div>
    </div>
  );
}

