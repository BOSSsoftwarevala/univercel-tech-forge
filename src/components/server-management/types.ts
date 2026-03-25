// Server Management Types

export interface ServerInstance {
  id: string;
  name: string;
  region: string;
  dataCenter: string;
  provider: "aws" | "gcp" | "azure" | "contabo" | "hostinger" | "other";
  type: "vps" | "vds" | "dedicated" | "cluster";
  status: "online" | "offline" | "degraded" | "maintenance";
  ipAddress: string;
  cpu: { cores: number; usage: number };
  ram: { total: number; used: number; unit: "GB" };
  disk: { total: number; used: number; unit: "GB" };
  network: { in: number; out: number; unit: "Mbps" };
  uptime: string;
  uptimePercent: number;
  securityState: "secure" | "warning" | "critical";
  lastHealthCheck: string;
  os: string;
  services: ServiceStatus[];
}

export interface ServiceStatus {
  name: string;
  status: "running" | "stopped" | "error";
  port?: number;
}

export interface ClusterInfo {
  id: string;
  name: string;
  nodeCount: number;
  healthyNodes: number;
  status: "healthy" | "degraded" | "critical";
  region: string;
  loadBalanced: boolean;
}

export interface ServerKPI {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  icon: any;
  color: string;
  trend?: "up" | "down" | "stable";
  source: "system" | "ai" | "human";
  lastUpdate: string;
}

export interface AIAutomationAction {
  id: string;
  type: "auto-restart" | "auto-scale" | "auto-patch" | "auto-backup" | "auto-rollback" | "threat-detected";
  target: string;
  description: string;
  confidence: number;
  timestamp: string;
  status: "pending" | "executed" | "blocked" | "failed";
  requiresApproval: boolean;
}

export interface SecurityThreat {
  id: string;
  type: "brute-force" | "ddos" | "intrusion" | "malware" | "unauthorized-access";
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  target: string;
  timestamp: string;
  status: "detected" | "mitigated" | "investigating";
  autoBlocked: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  target: string;
  timestamp: string;
  details: string;
  category: "system" | "security" | "ai" | "user";
}

// Sample server data generator
export const generateSampleServers = (): ServerInstance[] => [
  {
    id: "srv-001",
    name: "Primary API Cluster",
    region: "US-East",
    dataCenter: "AWS Virginia",
    provider: "aws",
    type: "cluster",
    status: "online",
    ipAddress: "10.0.1.***",
    cpu: { cores: 32, usage: 45 },
    ram: { total: 128, used: 78, unit: "GB" },
    disk: { total: 2000, used: 1200, unit: "GB" },
    network: { in: 850, out: 420, unit: "Mbps" },
    uptime: "45d 12h 34m",
    uptimePercent: 99.99,
    securityState: "secure",
    lastHealthCheck: "30s ago",
    os: "Ubuntu 22.04 LTS",
    services: [
      { name: "nginx", status: "running", port: 443 },
      { name: "node", status: "running", port: 3000 },
      { name: "postgres", status: "running", port: 5432 },
    ]
  },
  {
    id: "srv-002",
    name: "EU Database Primary",
    region: "EU-Frankfurt",
    dataCenter: "GCP Frankfurt",
    provider: "gcp",
    type: "dedicated",
    status: "online",
    ipAddress: "10.0.2.***",
    cpu: { cores: 16, usage: 62 },
    ram: { total: 64, used: 52, unit: "GB" },
    disk: { total: 4000, used: 2800, unit: "GB" },
    network: { in: 320, out: 180, unit: "Mbps" },
    uptime: "120d 3h 22m",
    uptimePercent: 99.95,
    securityState: "secure",
    lastHealthCheck: "15s ago",
    os: "Debian 12",
    services: [
      { name: "postgresql", status: "running", port: 5432 },
      { name: "pgbouncer", status: "running", port: 6432 },
    ]
  },
  {
    id: "srv-003",
    name: "Asia Cache Layer",
    region: "AP-Tokyo",
    dataCenter: "AWS Tokyo",
    provider: "aws",
    type: "vps",
    status: "degraded",
    ipAddress: "10.0.3.***",
    cpu: { cores: 8, usage: 88 },
    ram: { total: 32, used: 30, unit: "GB" },
    disk: { total: 500, used: 450, unit: "GB" },
    network: { in: 650, out: 520, unit: "Mbps" },
    uptime: "15d 8h 45m",
    uptimePercent: 99.8,
    securityState: "warning",
    lastHealthCheck: "1m ago",
    os: "Ubuntu 22.04 LTS",
    services: [
      { name: "redis", status: "running", port: 6379 },
      { name: "memcached", status: "error" },
    ]
  },
  {
    id: "srv-004",
    name: "Backup Storage Node",
    region: "US-West",
    dataCenter: "Azure California",
    provider: "azure",
    type: "vds",
    status: "offline",
    ipAddress: "10.0.4.***",
    cpu: { cores: 4, usage: 0 },
    ram: { total: 16, used: 0, unit: "GB" },
    disk: { total: 10000, used: 6500, unit: "GB" },
    network: { in: 0, out: 0, unit: "Mbps" },
    uptime: "0d 0h 0m",
    uptimePercent: 85.2,
    securityState: "critical",
    lastHealthCheck: "15m ago",
    os: "Ubuntu 20.04 LTS",
    services: [
      { name: "minio", status: "stopped" },
      { name: "rsync", status: "stopped" },
    ]
  },
  {
    id: "srv-005",
    name: "India API Gateway",
    region: "AP-Mumbai",
    dataCenter: "AWS Mumbai",
    provider: "aws",
    type: "vps",
    status: "online",
    ipAddress: "10.0.5.***",
    cpu: { cores: 8, usage: 35 },
    ram: { total: 32, used: 18, unit: "GB" },
    disk: { total: 500, used: 180, unit: "GB" },
    network: { in: 420, out: 380, unit: "Mbps" },
    uptime: "60d 5h 12m",
    uptimePercent: 99.92,
    securityState: "secure",
    lastHealthCheck: "20s ago",
    os: "Ubuntu 22.04 LTS",
    services: [
      { name: "kong", status: "running", port: 8000 },
      { name: "nginx", status: "running", port: 443 },
    ]
  },
  {
    id: "srv-006",
    name: "EU Media CDN",
    region: "EU-London",
    dataCenter: "Cloudflare London",
    provider: "other",
    type: "cluster",
    status: "online",
    ipAddress: "10.0.6.***",
    cpu: { cores: 16, usage: 28 },
    ram: { total: 64, used: 24, unit: "GB" },
    disk: { total: 8000, used: 5200, unit: "GB" },
    network: { in: 1200, out: 2400, unit: "Mbps" },
    uptime: "90d 14h 8m",
    uptimePercent: 99.98,
    securityState: "secure",
    lastHealthCheck: "10s ago",
    os: "Alpine Linux",
    services: [
      { name: "varnish", status: "running", port: 80 },
      { name: "haproxy", status: "running", port: 443 },
    ]
  },
];

export const generateClusters = (): ClusterInfo[] => [
  { id: "cl-001", name: "Primary API Cluster", nodeCount: 5, healthyNodes: 5, status: "healthy", region: "US-East", loadBalanced: true },
  { id: "cl-002", name: "EU Database Cluster", nodeCount: 3, healthyNodes: 3, status: "healthy", region: "EU-Frankfurt", loadBalanced: true },
  { id: "cl-003", name: "Asia Cache Cluster", nodeCount: 4, healthyNodes: 3, status: "degraded", region: "AP-Tokyo", loadBalanced: true },
  { id: "cl-004", name: "Media CDN Cluster", nodeCount: 8, healthyNodes: 8, status: "healthy", region: "Global", loadBalanced: true },
];

export const generateAIActions = (): AIAutomationAction[] => [
  { id: "ai-001", type: "auto-restart", target: "memcached (srv-003)", description: "Service crashed, auto-restart triggered", confidence: 95, timestamp: "2 min ago", status: "executed", requiresApproval: false },
  { id: "ai-002", type: "auto-scale", target: "Primary API Cluster", description: "Traffic spike detected, scaling up 2 nodes", confidence: 88, timestamp: "5 min ago", status: "pending", requiresApproval: true },
  { id: "ai-003", type: "threat-detected", target: "India API Gateway", description: "Brute-force attempt blocked from 45.33.***", confidence: 99, timestamp: "10 min ago", status: "executed", requiresApproval: false },
  { id: "ai-004", type: "auto-patch", target: "All Ubuntu servers", description: "Critical security patch available (CVE-2024-1234)", confidence: 92, timestamp: "1 hour ago", status: "pending", requiresApproval: true },
  { id: "ai-005", type: "auto-backup", target: "EU Database Primary", description: "Scheduled backup completed successfully", confidence: 100, timestamp: "2 hours ago", status: "executed", requiresApproval: false },
];

export const generateSecurityThreats = (): SecurityThreat[] => [
  { id: "threat-001", type: "brute-force", severity: "high", source: "45.33.***", target: "SSH (srv-005)", timestamp: "10 min ago", status: "mitigated", autoBlocked: true },
  { id: "threat-002", type: "ddos", severity: "medium", source: "Multiple IPs", target: "API Gateway", timestamp: "1 hour ago", status: "mitigated", autoBlocked: true },
  { id: "threat-003", type: "unauthorized-access", severity: "low", source: "Internal", target: "Admin Panel", timestamp: "3 hours ago", status: "investigating", autoBlocked: false },
];
