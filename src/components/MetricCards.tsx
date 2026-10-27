import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Activity, 
  ArrowUpRight, 
  TrendingUp,
  ShieldBan
} from 'lucide-react';

interface MetricCardsProps {
  totalPackets: string;
  totalAlerts: number;
  criticalAlerts: number;
  blockedCount: number;
  onFilterCritical: () => void;
  onFilterBlocked: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalPackets,
  totalAlerts,
  criticalAlerts,
  blockedCount,
  onFilterCritical,
  onFilterBlocked,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Inspected Packets / Flow */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900/60 border border-slate-800 p-4 transition-all hover:border-slate-700 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
            Traffic Inspected
          </span>
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white">
            {totalPackets}
          </div>
          <span className="text-xs font-mono text-cyan-400">pkts</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center text-emerald-400 font-mono text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +14.2% rate
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Zero packet loss</span>
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 2. Total Threat Alerts */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900/60 border border-slate-800 p-4 transition-all hover:border-amber-500/30 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
            Total Threat Alerts
          </span>
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-400 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-amber-300">
            {totalAlerts}
          </div>
          <span className="text-xs font-mono text-slate-400">events logged</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center text-amber-400 font-mono text-[11px]">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +8 vs last hour
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Signature hits</span>
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 3. Critical Severity Incidents */}
      <div 
        onClick={onFilterCritical}
        className="relative overflow-hidden rounded-xl bg-slate-900/60 border border-rose-900/40 p-4 transition-all hover:border-rose-500/60 hover:bg-rose-950/20 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-rose-400/90 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Critical Threats
          </span>
          <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-400 group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-rose-400">
            {criticalAlerts}
          </div>
          <span className="text-xs font-medium text-rose-300/80 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">
            Immediate Action
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">CVE & C2 beacons</span>
          <span className="text-rose-400 text-[11px] font-mono group-hover:underline flex items-center">
            Filter Critical &rarr;
          </span>
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 4. Mitigated & Blocked Attacks */}
      <div 
        onClick={onFilterBlocked}
        className="relative overflow-hidden rounded-xl bg-slate-900/60 border border-slate-800 p-4 transition-all hover:border-emerald-500/40 hover:bg-emerald-950/10 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
            Attacks Mitigated
          </span>
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 group-hover:scale-105 transition-transform">
            <ShieldBan className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400">
            {blockedCount}
          </div>
          <span className="text-xs font-mono text-slate-400">IPs blocked/dropped</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="text-emerald-400 font-mono text-[11px]">100% Inline IPS drop</span>
          <span className="text-cyan-400 text-[11px] font-mono group-hover:underline flex items-center">
            View Blocked &rarr;
          </span>
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

    </div>
  );
};
