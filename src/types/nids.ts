export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AlertAction = 'BLOCKED' | 'ALERTED' | 'DROPPED' | 'QUARANTINED';

export type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH';

export interface PacketHeader {
  ttl: number;
  ipFlags: string;
  tcpFlags?: string;
  windowSize?: number;
  seqNumber?: string;
  ackNumber?: string;
  payloadLength: number;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  signature: string;
  signatureId: number;
  category: 'Exploit' | 'Malware' | 'Scan' | 'DDoS' | 'Brute Force' | 'Policy Violation' | 'DNS Tunneling';
  severity: Severity;
  protocol: Protocol;
  srcIp: string;
  srcPort: number;
  srcCountry: string;
  srcCountryCode: string;
  destIp: string;
  destPort: number;
  destHostname: string;
  action: AlertAction;
  cve?: string;
  mitreTactic: string;
  mitreId: string;
  sensorId: string;
  packetHeader: PacketHeader;
  hexPayload: string;
  asciiPayload: string;
  recommendation: string;
  status: 'New' | 'Investigating' | 'Resolved' | 'False Positive';
}

export interface SensorStatus {
  sensorId: string;
  name: string;
  location: string;
  engine: 'Suricata v7.0.3' | 'Snort 3.3' | 'Zeek 6.1';
  mode: 'Inline IPS' | 'Passive TAP';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  activeRules: number;
  packetsPerSec: number;
  dropRatePercent: number;
  bandwidthMbps: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  uptime: string;
}

export interface ThreatCategoryStat {
  category: string;
  count: number;
  percent: number;
  color: string;
}

export interface SeverityStat {
  severity: Severity;
  count: number;
  color: string;
  textColor: string;
  bgBadge: string;
}

export interface BlockedNode {
  id: string;
  ip: string;
  reason: string;
  category: string;
  blockedAt: string;
  expiresIn: string;
  hitsCount: number;
  country: string;
  action: 'PERMANENT' | 'TEMPORARY';
}
