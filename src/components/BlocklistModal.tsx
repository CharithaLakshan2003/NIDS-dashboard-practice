import React, { useState } from 'react';
import type { BlockedNode } from '../types/nids';
import { 
  X, 
  Ban, 
  Plus, 
  Trash2
} from 'lucide-react';

interface BlocklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedNodes: BlockedNode[];
  onUnblock: (id: string) => void;
  onAddBlock: (ip: string, reason: string, category: string, action: 'TEMPORARY' | 'PERMANENT') => void;
}

export const BlocklistModal: React.FC<BlocklistModalProps> = ({
  isOpen,
  onClose,
  blockedNodes,
  onUnblock,
  onAddBlock,
}) => {
  const [newIp, setNewIp] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newCategory, setNewCategory] = useState('Exploit');
  const [newAction, setNewAction] = useState<'TEMPORARY' | 'PERMANENT'>('TEMPORARY');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim() || !newReason.trim()) return;

    onAddBlock(newIp.trim(), newReason.trim(), newCategory, newAction);
    setNewIp('');
    setNewReason('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Active Firewall & IPS Blocklist
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  {blockedNodes.length} IPs Dropped
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                In-line hardware ACL synchronization & automated BGP null-routing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Automated rate-limiting triggers will immediately append hostile subnets here.
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel Form' : 'Ban Custom IP'}</span>
          </button>
        </div>

        {/* Add IP Form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="p-4 border-b border-slate-800 bg-slate-950/80 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Add New IP to Firewall Drop Policy
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Target IPv4 / CIDR</label>
                <input
                  type="text"
                  placeholder="e.g. 198.51.100.45"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Trigger Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Manual SOC quarantine for malicious probe"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Threat Classification</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Exploit">Exploit Attempt</option>
                  <option value="DDoS">DDoS / Flooder</option>
                  <option value="Scan">Reconnaissance Probe</option>
                  <option value="Malware">Malware / C2</option>
                  <option value="Brute Force">Brute Force Stuffing</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Duration</label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as 'TEMPORARY' | 'PERMANENT')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="TEMPORARY">Temporary Drop (24 Hours)</option>
                  <option value="PERMANENT">Permanent Null-Route</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Enforce Firewall Block
              </button>
            </div>
          </form>
        )}

        {/* List of Blocked IPs */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800">
          {blockedNodes.map((node) => (
            <div key={node.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-rose-300 text-sm">
                    {node.ip}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                    {node.country}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    node.action === 'PERMANENT'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {node.action}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  {node.reason}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>Blocked: {node.blockedAt}</span>
                  <span>•</span>
                  <span>Expires: {node.expiresIn}</span>
                  <span>•</span>
                  <span className="text-amber-400">{node.hitsCount} packets dropped</span>
                </div>
              </div>

              <button
                onClick={() => onUnblock(node.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/30 border border-slate-700 hover:border-emerald-500/30 transition-colors"
                title="Unblock and restore traffic"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Unblock</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Sync status: Synchronized across 3 border routers
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
