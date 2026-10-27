import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Download, 
  Server,
  Ban
} from 'lucide-react';
import type { SensorStatus } from '../types/nids';

interface HeaderProps {
  sensors: SensorStatus[];
  selectedSensorId: string;
  onSelectSensor: (sensorId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onOpenBlocklist: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sensors,
  selectedSensorId,
  onSelectSensor,
  searchQuery,
  onSearchChange,
  timeRange,
  onTimeRangeChange,
  onOpenBlocklist,
  onExport,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
              <ShieldAlert className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span> */}
                {/* <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span> */}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5 font-sans">
                  NetSentinel AI <span className="text-cyan-400 font-mono text-sm px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">NIDS</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  THREAT: ELEVATED
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Network Intrusion Detection & Inline Prevention Platform
              </p>
            </div>
          </div>

          {/* Global Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search alerts, IP (e.g. 185.220), CVE-2021, signatures..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Controls: Sensor Selector, Time Window, Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Sensor Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={selectedSensorId}
                onChange={(e) => onSelectSensor(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {sensors.map((sensor) => (
                  <option key={sensor.sensorId} value={sensor.sensorId} className="bg-slate-900 text-slate-200">
                    {sensor.name} ({sensor.engine})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Window Buttons */}
            <div className="hidden lg:flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 text-xs">
              {['15m', '1h', '24h', '7d'].map((range) => (
                <button
                  key={range}
                  onClick={() => onTimeRangeChange(range)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeRange === range
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Blocklist Management Button */}
            <button
              onClick={onOpenBlocklist}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
              title="Manage Firewall Blocklist"
            >
              <Ban className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Blocklist</span>
            </button>

            {/* Export Report Button */}
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Export Incident Report (JSON)"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search alerts, IPs, CVEs..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
