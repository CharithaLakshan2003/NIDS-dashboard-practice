import React, { useState, useMemo } from 'react';
import type { SecurityAlert, Severity, AlertAction } from '../types/nids';
import { 
  Terminal, 
  Ban, 
  ArrowUpDown, 
  ShieldAlert, 
  RotateCcw
} from 'lucide-react';

interface AlertsTableProps {
  alerts: SecurityAlert[];
  onSelectAlert: (alert: SecurityAlert) => void;
  onBlockIp: (ip: string, reason: string) => void;
  filterSeverity: string;
  onFilterSeverityChange: (sev: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  onSelectAlert,
  onBlockIp,
  filterSeverity,
  onFilterSeverityChange,
  filterCategory,
  onFilterCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [filterProtocol, setFilterProtocol] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'timestamp' | 'severity' | 'srcIp'>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter logic
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = 
          alert.signature.toLowerCase().includes(query) ||
          alert.srcIp.toLowerCase().includes(query) ||
          alert.destIp.toLowerCase().includes(query) ||
          alert.destHostname.toLowerCase().includes(query) ||
          (alert.cve && alert.cve.toLowerCase().includes(query)) ||
          alert.category.toLowerCase().includes(query) ||
          alert.id.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Severity filter
      if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) {
        return false;
      }

      // Category filter
      if (filterCategory !== 'ALL' && alert.category !== filterCategory) {
        return false;
      }

      // Action filter
      if (filterAction !== 'ALL' && alert.action !== filterAction) {
        return false;
      }

      // Protocol filter
      if (filterProtocol !== 'ALL' && alert.protocol !== filterProtocol) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'timestamp') {
        return sortAsc
          ? a.timestamp.localeCompare(b.timestamp)
          : b.timestamp.localeCompare(a.timestamp);
      }
      if (sortField === 'severity') {
        const ranks: Record<Severity, number> = {
          CRITICAL: 5,
          HIGH: 4,
          MEDIUM: 3,
          LOW: 2,
          INFO: 1,
        };
        return sortAsc
          ? ranks[a.severity] - ranks[b.severity]
          : ranks[b.severity] - ranks[a.severity];
      }
      if (sortField === 'srcIp') {
        return sortAsc ? a.srcIp.localeCompare(b.srcIp) : b.srcIp.localeCompare(a.srcIp);
      }
      return 0;
    });
  }, [alerts, searchQuery, filterSeverity, filterCategory, filterAction, filterProtocol, sortField, sortAsc]);

  const handleSort = (field: 'timestamp' | 'severity' | 'srcIp') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const resetAllFilters = () => {
    onSearchChange('');
    onFilterSeverityChange('ALL');
    onFilterCategoryChange('ALL');
    setFilterAction('ALL');
    setFilterProtocol('ALL');
  };

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'LOW':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getActionBadge = (act: AlertAction) => {
    switch (act) {
      case 'BLOCKED':
        return 'bg-rose-950/60 text-rose-400 border-rose-800/60';
      case 'DROPPED':
        return 'bg-red-950/60 text-red-400 border-red-800/60';
      case 'QUARANTINED':
        return 'bg-amber-950/60 text-amber-400 border-amber-800/60';
      default:
        return 'bg-blue-950/60 text-blue-400 border-blue-800/60';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      
      {/* Table Top Controls & Filter Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white text-sm sm:text-base tracking-tight font-sans">
            Live Security Alert Feed
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
            {filteredAlerts.length} of {alerts.length} events
          </span>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1">
            <span className="text-slate-500 font-mono">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => onFilterSeverityChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Severities</option>
              <option value="CRITICAL" className="bg-slate-900">Critical</option>
              <option value="HIGH" className="bg-slate-900">High</option>
              <option value="MEDIUM" className="bg-slate-900">Medium</option>
              <option value="LOW" className="bg-slate-900">Low</option>
              <option value="INFO" className="bg-slate-900">Info</option>
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1">
            <span className="text-slate-500 font-mono">Action:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Actions</option>
              <option value="BLOCKED" className="bg-slate-900">Blocked</option>
              <option value="DROPPED" className="bg-slate-900">Dropped</option>
              <option value="QUARANTINED" className="bg-slate-900">Quarantined</option>
              <option value="ALERTED" className="bg-slate-900">Alerted</option>
            </select>
          </div>

          {/* Protocol Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1">
            <span className="text-slate-500 font-mono">Proto:</span>
            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All</option>
              <option value="TCP" className="bg-slate-900">TCP</option>
              <option value="UDP" className="bg-slate-900">UDP</option>
              <option value="HTTPS" className="bg-slate-900">HTTPS</option>
              <option value="HTTP" className="bg-slate-900">HTTP</option>
              <option value="DNS" className="bg-slate-900">DNS</option>
              <option value="SSH" className="bg-slate-900">SSH</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(filterSeverity !== 'ALL' || filterCategory !== 'ALL' || filterAction !== 'ALL' || filterProtocol !== 'ALL' || searchQuery) && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 font-mono text-slate-400 text-[11px] uppercase tracking-wider">
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
                onClick={() => handleSort('severity')}
              >
                <div className="flex items-center gap-1">
                  Severity <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-1">
                  Time (UTC) <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Threat Signature / Vector</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
                onClick={() => handleSort('srcIp')}
              >
                <div className="flex items-center gap-1">
                  Source Attacker <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Target Destination</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-slate-300">No security events found</p>
                    <p className="text-xs text-slate-500">No alerts match your current filter parameters or search terms.</p>
                    <button
                      onClick={resetAllFilters}
                      className="mt-2 text-xs font-mono text-cyan-400 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  {/* Severity Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {alert.timestamp.split(' ')[1]}
                  </td>

                  {/* Signature & CVE */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {alert.signature}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px] text-slate-500">
                      <span>SID:{alert.signatureId}</span>
                      {alert.cve && (
                        <span className="text-purple-400 bg-purple-950/60 px-1 py-0.2 rounded border border-purple-800/50">
                          {alert.cve}
                        </span>
                      )}
                      <span className="text-indigo-400">{alert.mitreId}</span>
                    </div>
                  </td>

                  {/* Source Attacker IP */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono text-rose-300 font-medium">
                      {alert.srcIp}:{alert.srcPort}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <span>{alert.srcCountry}</span>
                      <span className="px-1 bg-slate-800 rounded font-mono text-slate-400">{alert.srcCountryCode}</span>
                    </div>
                  </td>

                  {/* Target Destination IP */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono text-slate-300">
                      {alert.destIp}:{alert.destPort}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                      {alert.destHostname}
                    </div>
                  </td>

                  {/* In-Line Action */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getActionBadge(alert.action)}`}>
                      {alert.action}
                    </span>
                  </td>

                  {/* Triage Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                      alert.status === 'Resolved' ? 'text-emerald-400' :
                      alert.status === 'Investigating' ? 'text-amber-400' :
                      alert.status === 'False Positive' ? 'text-slate-500' :
                      'text-cyan-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        alert.status === 'Resolved' ? 'bg-emerald-400' :
                        alert.status === 'Investigating' ? 'bg-amber-400' :
                        alert.status === 'False Positive' ? 'bg-slate-500' :
                        'bg-cyan-400'
                      }`} />
                      {alert.status}
                    </span>
                  </td>

                  {/* Row Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectAlert(alert)}
                        className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                        title="Inspect Payload"
                      >
                        <Terminal className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onBlockIp(alert.srcIp, alert.signature)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Ban Source IP"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Displaying {filteredAlerts.length} total event records</span>
        <span className="text-slate-500 text-[11px]">Click any row for raw packet byte dump & triage advice</span>
      </div>

    </div>
  );
};
