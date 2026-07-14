// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { companyOptions, login } = useApp();

  const handleLogin = (/** @type {string} */ companyId) => {
    login(companyId);
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-slate-200 backdrop-blur">
                <ShieldCheck size={16} className="text-cyan-300" />
                Company-specific login
              </div>
              <div className="space-y-3">
                <p className="text-cyan-300 uppercase tracking-[0.35em] text-xs font-semibold">GST Invoice Generator</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                  Choose the company profile to work in.
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl lg:mx-0 mx-auto">
                  Each login opens its own settings, invoices, products, customers, and stock data. The workflow stays the same; only the active company changes.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Profiles</p>
                  <p className="text-2xl font-bold mt-1">2</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Data</p>
                  <p className="text-2xl font-bold mt-1">Separate</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Access</p>
                  <p className="text-2xl font-bold mt-1">Fast</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl rounded-full" />
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Select company</h2>
                    <p className="text-sm text-slate-400">Continue with the profile you want to manage</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {companyOptions.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleLogin(company.id)}
                      className="w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40 transition-all duration-200 p-4 group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-white truncate">{company.label}</p>
                          <p className="text-sm text-slate-400 mt-1">Open this company’s own settings and business records.</p>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-cyan-400/15 text-cyan-200 border border-cyan-300/20 px-3 py-1 text-xs font-semibold">
                          Continue
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
