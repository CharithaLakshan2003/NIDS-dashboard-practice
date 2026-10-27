import React from 'react';
import type { SensorStatus } from '../types/nids';
import { 
  Cpu, 
  HardDrive, 
  Zap, 
  Clock, 
  Layers, 
  Wifi 
} from 'lucide-react';

interface SensorStatusBannerProps {
  sensor: SensorStatus;
}

export const SensorStatusBanner: React.FC<SensorStatusBannerProps> = ({ sensor }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Sensor Info & Engine Details */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-white text-sm sm:text-base tracking-tight">
                {sensor.name}
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                sensor.status === 'ONLINE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                ● {sensor.status}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {sensor.engine}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {sensor.mode}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{sensor.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" /> Uptime: {sensor.uptime}
              </span>
            </p>
          </div>
        </div>

        {/* Live Sensor Performance Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-5 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
          
          {/* Rules Loaded */}
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Signatures</div>
              <div className="text-xs font-semibold font-mono text-slate-200">
                {sensor.activeRules.toLocaleString()} rules
              </div>
            </div>
          </div>

          {/* Packet Throughput */}
          <div className="flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Throughput</div>
              <div className="text-xs font-semibold font-mono text-slate-200">
                {sensor.bandwidthMbps} Mbps <span className="text-slate-500 font-normal">({(sensor.packetsPerSec / 1000).toFixed(1)}k pps)</span>
              </div>
            </div>
          </div>

          {/* CPU Meter */}
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-[70px]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 uppercase tracking-wider font-mono">CPU</span>
                <span className="font-mono text-slate-300 font-medium">{sensor.cpuUsagePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    sensor.cpuUsagePercent > 75 ? 'bg-rose-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${sensor.cpuUsagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Memory Meter */}
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-[70px]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 uppercase tracking-wider font-mono">RAM</span>
                <span className="font-mono text-slate-300 font-medium">{sensor.memoryUsagePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    sensor.memoryUsagePercent > 75 ? 'bg-rose-500' : 'bg-purple-400'
                  }`}
                  style={{ width: `${sensor.memoryUsagePercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
