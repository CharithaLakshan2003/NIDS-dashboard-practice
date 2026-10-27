import { useState } from 'react';
import { 
  INITIAL_SENSORS, 
  MOCK_ALERTS, 
  MOCK_BLOCKED_NODES 
} from './data/mockData';
import type { 
  SecurityAlert, 
  SensorStatus, 
  BlockedNode 
} from './types/nids';
import { Header } from './components/Header';
import { SensorStatusBanner } from './components/SensorStatusBanner';
import { MetricCards } from './components/MetricCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { AlertsTable } from './components/AlertsTable';
import { AlertDetailModal } from './components/AlertDetailModal';
import { BlocklistModal } from './components/BlocklistModal';
import { CheckCircle2, Shield } from 'lucide-react';

export function App() {
  const [sensors] = useState<SensorStatus[]>(INITIAL_SENSORS);
  const [selectedSensorId, setSelectedSensorId] = useState<string>('sensor-edge-01');
  const [alerts, setAlerts] = useState<SecurityAlert[]>(MOCK_ALERTS);
  const [blockedNodes, setBlockedNodes] = useState<BlockedNode[]>(MOCK_BLOCKED_NODES);
  
  // Filter and view states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Modals
  const [inspectedAlert, setInspectedAlert] = useState<SecurityAlert | null>(null);
  const [isBlocklistOpen, setIsBlocklistOpen] = useState<boolean>(false);

  // Temporary feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentSensor = sensors.find((s) => s.sensorId === selectedSensorId) || sensors[0];

  // Block an IP from any alert or manually
  const handleBlockIp = (ip: string, reason: string, category: string = 'Exploit', action: 'TEMPORARY' | 'PERMANENT' = 'TEMPORARY') => {
    // Check if already in blocklist
    if (blockedNodes.some((n) => n.ip === ip)) {
      showToast(`IP ${ip} is already blocked in firewall rules.`);
      return;
    }

    const newBlocked: BlockedNode = {
      id: `BLK-${Date.now().toString().slice(-4)}`,
      ip,
      reason,
      category,
      blockedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      expiresIn: action === 'PERMANENT' ? 'Permanent' : '23h 59m',
      hitsCount: 1,
      country: 'Threat Node',
      action,
    };

    setBlockedNodes((prev) => [newBlocked, ...prev]);

    // Update alerts with this IP to BLOCKED
    setAlerts((prev) =>
      prev.map((a) => (a.srcIp === ip ? { ...a, action: 'BLOCKED' } : a))
    );

    showToast(`Firewall drop rule deployed for IP ${ip} across border gateways.`);
  };

  const handleUnblock = (id: string) => {
    const target = blockedNodes.find((n) => n.id === id);
    setBlockedNodes((prev) => prev.filter((n) => n.id !== id));
    if (target) {
      showToast(`Unblocked ${target.ip}. Restored gateway routing.`);
    }
  };

  const handleUpdateStatus = (alertId: string, status: SecurityAlert['status']) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a))
    );
    if (inspectedAlert && inspectedAlert.id === alertId) {
      setInspectedAlert({ ...inspectedAlert, status });
    }
    showToast(`Alert ${alertId} status marked as "${status}".`);
  };

  // Export alerts as JSON
  const handleExport = () => {
    const reportData = {
      exportTimestamp: new Date().toISOString(),
      activeSensor: currentSensor,
      totalAlertsCount: alerts.length,
      alerts,
      blockedFirewallNodes: blockedNodes,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nids-threat-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('NIDS Security Operations Report downloaded (JSON).');
  };

  // Derived counts
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const blockedCount = alerts.filter((a) => a.action === 'BLOCKED' || a.action === 'DROPPED').length + blockedNodes.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-2xl text-xs text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        sensors={sensors}
        selectedSensorId={selectedSensorId}
        onSelectSensor={setSelectedSensorId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onOpenBlocklist={() => setIsBlocklistOpen(true)}
        onExport={handleExport}
      />

      {/* Main SOC Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Active Sensor Diagnostics Banner */}
        <SensorStatusBanner sensor={currentSensor} />

        {/* Top Metric Cards (KPIs) */}
        <MetricCards
          totalPackets="2,841,200"
          totalAlerts={alerts.length}
          criticalAlerts={criticalCount}
          blockedCount={blockedCount}
          onFilterCritical={() => setSelectedSeverity('CRITICAL')}
          onFilterBlocked={() => setSearchQuery('BLOCKED')}
        />

        {/* Threat Analytics & Vector Visualizations */}
        <AnalyticsCharts
          selectedSeverity={selectedSeverity}
          onSelectSeverity={setSelectedSeverity}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Security Alerts Stream & Triage Table */}
        <AlertsTable
          alerts={alerts}
          onSelectAlert={(alert) => setInspectedAlert(alert)}
          onBlockIp={(ip, reason) => handleBlockIp(ip, reason)}
          filterSeverity={selectedSeverity}
          onFilterSeverityChange={setSelectedSeverity}
          filterCategory={selectedCategory}
          onFilterCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

      </main>

      {/* Alert Deep-Dive Modal */}
      <AlertDetailModal
        alert={inspectedAlert}
        onClose={() => setInspectedAlert(null)}
        onBlockIp={(ip, reason) => handleBlockIp(ip, reason)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Firewall Blocklist Modal */}
      <BlocklistModal
        isOpen={isBlocklistOpen}
        onClose={() => setIsBlocklistOpen(false)}
        blockedNodes={blockedNodes}
        onUnblock={handleUnblock}
        onAddBlock={(ip, reason, category, action) => handleBlockIp(ip, reason, category, action)}
      />

      {/* Footer */}
      {/* <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>NetSentinel AI NIDS Engine v7.0.3 • Security Operations Center</span>
          </div>
          <div className="text-slate-600 text-[11px]">
            Signatures updated 2026-10-27 04:00:00 UTC • Encrypted IPS Channel
          </div>
        </div>
      </footer> */}

    </div>
  );
}

export default App;
