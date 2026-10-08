'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Building2, MapPin, CheckCircle2, Loader2,
  ChevronRight, Globe, AlertCircle, Store, ArrowRight, ArrowLeft
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
  'Other Services',
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
    <div className="min-h-screen bg-[#090D16] text-white font-sans flex flex-col justify-between px-4 py-8 relative overflow-hidden selection:bg-[#10B981] selection:text-[#090D16]">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10B981]/10 via-[#10B981]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header Link */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between z-10">
        <button
          onClick={() => router.push('/auth')}
          className="text-slate-400 hover:text-[#10B981] text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Auth
        </button>
        <span className="text-[#10B981] font-mono text-[11px] font-bold">SETUP IN 3 MINS</span>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-xl mx-auto my-auto py-6 relative z-10">
        
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
          <p className="text-slate-400 text-xs font-medium mt-1">Merchant Terminal Onboarding</p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2 mb-8 px-2">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step > s.num
                      ? 'bg-[#10B981] text-[#090D16]'
                      : step === s.num
                      ? 'bg-[#10B981] text-[#090D16] shadow-md shadow-[#10B981]/30 ring-2 ring-[#10B981]/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span className={`text-[10px] font-medium ${step >= s.num ? 'text-[#10B981]' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mt-[-14px] transition-all duration-500 ${step > s.num ? 'bg-[#10B981]' : 'bg-slate-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card Box */}
        <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-[#10B981]/5">
          
          {/* ── Step 1: Welcome ──────────────────────────────────────────── */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#10B981]/10">
                <Shield className="w-8 h-8 text-[#10B981]" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Welcome to TRA-SYNC</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                  Configure your store terminal in 3 quick steps. Start protecting your sales against fake payment alerts immediately.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Building2, label: 'Business Profile', color: '#10B981' },
                  { icon: Globe,     label: 'NIPOST Address', color: '#3B82F6' },
                  { icon: CheckCircle2, label: 'Live POS Shield', color: '#10B981' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center gap-2">
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                      <span className="text-slate-300 text-xs font-medium text-center">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <button 
                id="onboard-start" 
                onClick={advance} 
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/40 flex items-center justify-center gap-2 mt-4"
              >
                Start Store Configuration <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Step 2: Business Info ────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Business Details</h2>
                  <p className="text-slate-400 text-xs">Enter your official retail store name &amp; category</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Business / Store Name
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="onboard-biz-name"
                      type="text"
                      required
                      className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-colors outline-none font-medium placeholder:text-slate-600"
                      placeholder="e.g. Apex Retail Supermarket"
                      value={business.name}
                      onChange={(e) => setBusiness((b) => ({ ...b, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Industry Category
                  </label>
                  <select
                    id="onboard-industry"
                    className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-white rounded-xl px-4 py-3 text-sm transition-colors outline-none font-medium"
                    value={business.industry}
                    onChange={(e) => setBusiness((b) => ({ ...b, industry: e.target.value }))}
                  >
                    <option value="" disabled>Select your store industry…</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-slate-900 text-white">{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="onboard-biz-next"
                onClick={advance}
                disabled={!canAdvance()}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-6"
              >
                Continue to Location <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Step 3: NIPOST Postcode ──────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">NIPOST Address Verification</h2>
                  <p className="text-slate-400 text-xs">Anchor terminal to official physical postcode</p>
                </div>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Enter your NIPOST digital postcode to verify store address.
                <span className="text-[#10B981] font-semibold cursor-pointer ml-1" onClick={() => setPostcode('LA-100001-0842')}>
                  (Try: LA-100001-0842)
                </span>
              </p>

              <div className="flex gap-2">
                <input
                  id="onboard-postcode"
                  type="text"
                  className="bg-slate-900/90 border border-slate-700/80 focus:border-[#10B981] text-white font-mono tracking-widest rounded-xl px-4 py-3 text-sm flex-1 uppercase outline-none"
                  placeholder="LA-100001-0842"
                  value={postcode}
                  onChange={(e) => { setPostcode(e.target.value.toUpperCase()); setPostcodeError(''); setPostcodeResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && lookupPostcode()}
                />
                <button
                  id="onboard-postcode-verify"
                  onClick={lookupPostcode}
                  disabled={postcodeLoading}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-5 rounded-xl border border-slate-700 shrink-0 flex items-center gap-2 transition-colors disabled:opacity-60"
                >
                  {postcodeLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#10B981]" /> : 'Verify'}
                </button>
              </div>

              {postcodeError && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{postcodeError}</span>
                </div>
              )}

              {postcodeResult && (
                <div className="bg-[#062c1d]/60 border border-[#10B981]/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[#10B981] font-bold text-xs uppercase tracking-wider">Address Resolved</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Street Address</span>
                      <span className="text-white font-medium">{postcodeResult.street}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">LGA Zone</span>
                      <span className="text-white font-medium">{postcodeResult.lga}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">State</span>
                      <span className="text-white font-medium">{postcodeResult.state}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">GPS Coordinates</span>
                      <span className="text-[#10B981] font-mono font-bold text-[11px]">
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
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-4"
              >
                Confirm Location &amp; Deploy <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Step 4: Terminal Ready ───────────────────────────────────── */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="relative mx-auto w-20 h-20">
                <div className="w-20 h-20 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center mx-auto shadow-xl shadow-[#10B981]/20">
                  <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Terminal Deployed!</h2>
                <p className="text-slate-400 text-sm">
                  <span className="text-white font-bold">{business.name || 'Your Business'}</span> is now active on TRA-SYNC real-time anti-fraud protocol.
                </p>
                {postcodeResult && (
                  <p className="text-[#10B981] font-mono text-xs pt-1">
                    📍 {postcodeResult.street}, {postcodeResult.lga}, {postcodeResult.state}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#062c1d]/60 border border-[#10B981]/40 rounded-xl p-3.5 text-center">
                  <div className="text-[#10B981] font-bold text-base">ACTIVE</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Webhook Shield</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center">
                  <div className="text-white font-bold text-base">LOCKED</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Inventory Guard</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  id="onboard-go-dashboard"
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2"
                >
                  Launch Merchant Dashboard <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/pos')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
                  id="onboard-go-pos"
                >
                  Open POS Checkout Terminal
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Footer Note */}
      <div className="text-center text-slate-500 text-[11px] font-mono z-10">
        Step {step} of 4 · TRA-SYNC Merchant Onboarding Protocol
      </div>
    </div>
  );
}
