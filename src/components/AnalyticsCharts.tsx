import React from 'react';
import { 
  CATEGORY_STATS, 
  SEVERITY_STATS, 
  PROTOCOL_STATS, 
  HOURLY_TIMELINE 
} from '../data/mockData';
import { Shield, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsChartsProps {
  selectedSeverity: string;
  onSelectSeverity: (sev: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  selectedSeverity,
  onSelectSeverity,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* 1. Attack Categories Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Attack Vectors & Categories
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Top signatures</span>
          </div>

          <div className="space-y-2.5">
            {CATEGORY_STATS.map((item) => {
              const isSelected = selectedCategory === item.category;
              return (
                <div
                  key={item.category}
                  onClick={() => onSelectCategory(isSelected ? 'ALL' : item.category)}
                  className={`cursor-pointer p-1.5 rounded-lg transition-colors ${
                    isSelected ? 'bg-slate-800/80 ring-1 ring-cyan-500/50' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-medium text-slate-300 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                      {item.category}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {item.count} <span className="text-slate-600">({item.percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Click a category to filter table</span>
          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => onSelectCategory('ALL')}
              className="text-cyan-400 hover:underline font-mono"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      {/* 2. Attack Activity Timeline (Hourly) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Threat Activity Timeline
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Last 6 hours</span>
          </div>

          <div className="pt-2">
            <div className="flex items-end justify-between gap-2 h-36 border-b border-slate-800 pb-2">
              {HOURLY_TIMELINE.map((h) => {
                const maxVal = 65;
                const totalHeight = Math.round((h.attacks / maxVal) * 100);
                const blockedHeight = Math.round((h.blocked / maxVal) * 100);

                return (
                  <div key={h.time} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-[10px] text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                      <div className="font-semibold">{h.time} UTC</div>
                      <div className="text-amber-400">Total: {h.attacks}</div>
                      <div className="text-emerald-400">Blocked: {h.blocked}</div>
                    </div>

                    <div className="w-full max-w-[28px] h-32 bg-slate-950/60 rounded-t flex flex-col justify-end p-0.5 relative overflow-hidden">
                      {/* Total bar */}
                      <div
                        className="w-full bg-amber-500/30 rounded-t transition-all group-hover:bg-amber-500/50"
                        style={{ height: `${totalHeight}%` }}
                      >
                        {/* Blocked portion overlay */}
                        <div
                          className="w-full bg-emerald-500/80 rounded-t transition-all"
                          style={{ height: `${blockedHeight}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{h.time}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-5 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/50"></span>
                Detected ({HOURLY_TIMELINE.reduce((acc, c) => acc + c.attacks, 0)})
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                Blocked ({HOURLY_TIMELINE.reduce((acc, c) => acc + c.blocked, 0)})
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-2 text-center font-mono">
          Mitigation rate: 84.8% automated inline drops
        </div>
      </div>

      {/* 3. Severity Distribution & Protocol Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              Severity & Protocol Telemetry
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Filter by rank</span>
          </div>

          {/* Severity Pills */}
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {SEVERITY_STATS.map((s) => {
              const isSelected = selectedSeverity === s.severity;
              return (
                <button
                  key={s.severity}
                  onClick={() => onSelectSeverity(isSelected ? 'ALL' : s.severity)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-sm'
                      : `${s.bgBadge} hover:opacity-90`
                  }`}
                >
                  <div className={`text-[10px] font-bold tracking-wider ${s.textColor}`}>
                    {s.severity.slice(0, 4)}
                  </div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {s.count}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Protocols List */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Protocol Analysis</span>
              <span className="text-slate-500">Packets</span>
            </div>
            {PROTOCOL_STATS.map((proto) => (
              <div key={proto.protocol} className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 w-16 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${proto.color}`}></span>
                  {proto.protocol}
                </span>
                <div className="flex-1 mx-3 bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${proto.color}`}
                    style={{ width: `${proto.percent}%` }}
                  />
                </div>
                <span className="font-mono text-slate-400 text-[11px] w-14 text-right">
                  {proto.packets}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>{selectedSeverity !== 'ALL' ? `Filtered by ${selectedSeverity}` : 'All severities shown'}</span>
          {selectedSeverity !== 'ALL' && (
            <button
              onClick={() => onSelectSeverity('ALL')}
              className="text-cyan-400 hover:underline font-mono"
            >
              Clear
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
