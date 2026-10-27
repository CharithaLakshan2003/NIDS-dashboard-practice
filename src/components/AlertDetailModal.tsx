import React, { useState } from 'react';
import type { SecurityAlert } from '../types/nids';
import { 
  X, 
  ShieldAlert, 
  Terminal, 
  Copy, 
  Check, 
  Ban, 
  AlertOctagon, 
  FileCode,
  Network
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: SecurityAlert | null;
  onClose: () => void;
  onBlockIp: (ip: string, reason: string) => void;
  onUpdateStatus: (alertId: string, status: SecurityAlert['status']) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onBlockIp,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'payload' | 'headers' | 'playbook'>('payload');
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedAscii, setCopiedAscii] = useState(false);

  if (!alert) return null;

  const copyToClipboard = (text: string, type: 'hex' | 'ascii') => {
    navigator.clipboard.writeText(text);
    if (type === 'hex') {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    } else {
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 2000);
    }
  };

  const getSeverityBadge = (sev: SecurityAlert['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'LOW':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-rose-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {alert.id}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-bold border ${getSeverityBadge(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-400 border border-slate-700">
                  SID: {alert.signatureId}
                </span>
                {alert.cve && (
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono flex items-center gap-1">
                    {alert.cve}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
                  MITRE: {alert.mitreId} ({alert.mitreTactic})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {alert.signature}
              </h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Timestamp: {alert.timestamp} UTC • Sensor: {alert.sensorId} • Category: {alert.category}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Flow Summary Banner */}
        <div className="bg-slate-950/30 px-5 py-3 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          
          {/* Source IP / Origin */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 font-mono text-[10px] uppercase block mb-0.5">Source (Attacker)</span>
            <div className="font-mono font-semibold text-rose-300 text-sm flex items-center justify-between">
              <span>{alert.srcIp}:{alert.srcPort}</span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {alert.srcCountryCode}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{alert.srcCountry}</div>
          </div>

          {/* Destination IP / Target */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 font-mono text-[10px] uppercase block mb-0.5">Destination (Target Asset)</span>
            <div className="font-mono font-semibold text-cyan-300 text-sm">
              {alert.destIp}:{alert.destPort}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">{alert.destHostname}</div>
          </div>

          {/* Protocol & Action */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 font-mono text-[10px] uppercase block mb-0.5">Inspection & Action</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-white">{alert.protocol}</span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                alert.action === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                alert.action === 'QUARANTINED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {alert.action}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">State: {alert.status}</div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 border-b border-slate-800 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('payload')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'payload'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Packet Payload (Hex & ASCII)
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'headers'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            TCP/IP Headers Telemetry
          </button>
          <button
            onClick={() => setActiveTab('playbook')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'playbook'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Remediation & Analysis
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 max-h-[420px] overflow-y-auto">
          {activeTab === 'payload' && (
            <div className="space-y-4">
              {/* ASCII Payload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    Decoded ASCII String Representation
                  </span>
                  <button
                    onClick={() => copyToClipboard(alert.asciiPayload, 'ascii')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors"
                  >
                    {copiedAscii ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedAscii ? 'Copied' : 'Copy ASCII'}
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap break-all selection:bg-cyan-500 selection:text-slate-950">
                  {alert.asciiPayload}
                </div>
              </div>

              {/* Raw Hex Dump */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    Raw Hex Byte Stream (Wire Format)
                  </span>
                  <button
                    onClick={() => copyToClipboard(alert.hexPayload, 'hex')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors"
                  >
                    {copiedHex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedHex ? 'Copied' : 'Copy Hex'}
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 whitespace-pre-wrap break-all leading-relaxed">
                  {alert.hexPayload}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">IP TTL</span>
                <div className="text-sm font-bold font-mono text-white mt-1">{alert.packetHeader.ttl}</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">IP Flags</span>
                <div className="text-sm font-bold font-mono text-white mt-1">{alert.packetHeader.ipFlags}</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">TCP Flags</span>
                <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
                  {alert.packetHeader.tcpFlags || 'N/A (UDP/ICMP)'}
                </div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">TCP Window Size</span>
                <div className="text-sm font-bold font-mono text-white mt-1">
                  {alert.packetHeader.windowSize ? `${alert.packetHeader.windowSize} bytes` : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Seq Number</span>
                <div className="text-sm font-bold font-mono text-amber-400 mt-1">
                  {alert.packetHeader.seqNumber || 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Payload Length</span>
                <div className="text-sm font-bold font-mono text-white mt-1">
                  {alert.packetHeader.payloadLength} bytes
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playbook' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50">
                <h4 className="font-bold text-cyan-300 text-sm mb-1.5 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-cyan-400" />
                  Recommended SOC Analyst Remediation
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {alert.recommendation}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-2">MITRE ATT&CK Framework Context</h4>
                <div className="space-y-1.5 text-slate-400">
                  <div>• <strong>Technique ID:</strong> <span className="font-mono text-indigo-400">{alert.mitreId}</span></div>
                  <div>• <strong>Tactic Name:</strong> {alert.mitreTactic}</div>
                  <div>• <strong>NIDS Signature:</strong> <span className="font-mono text-slate-300">Suricata Rule SID {alert.signatureId}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-950 border-t border-slate-800 gap-3">
          
          {/* Triage Status Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 mr-1 font-mono">Status:</span>
            {(['New', 'Investigating', 'Resolved', 'False Positive'] as const).map((st) => (
              <button
                key={st}
                onClick={() => onUpdateStatus(alert.id, st)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  alert.status === st
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBlockIp(alert.srcIp, alert.signature)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-sm shadow-rose-900/50"
            >
              <Ban className="w-3.5 h-3.5" />
              Block Source IP ({alert.srcIp})
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
