// ============================================
// DOMAINS — VERCEL CLONE
// Custom domains, SSL, DNS management
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Plus, CheckCircle2, XCircle, Clock, 
  Shield, ExternalLink, Trash2, MoreHorizontal,
  ArrowUpRight, RefreshCw, AlertTriangle, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Domain {
  id: string;
  domain: string;
  type: 'production' | 'redirect' | 'preview';
  status: 'valid' | 'pending' | 'invalid' | 'configuring';
  ssl: 'active' | 'pending' | 'expired';
  assignedTo: string;
  addedAt: string;
  dnsRecords?: { type: string; name: string; value: string; status: 'valid' | 'pending' }[];
}

const mockDomains: Domain[] = [
  {
    id: '1',
    domain: 'softwarewala.net',
    type: 'production',
    status: 'valid',
    ssl: 'active',
    assignedTo: 'Main Platform',
    addedAt: '2025-01-15',
    dnsRecords: [
      { type: 'A', name: '@', value: '72.61.236.249', status: 'valid' },
      { type: 'A', name: 'www', value: '72.61.236.249', status: 'valid' },
      { type: 'CNAME', name: '*', value: 'srv1183368.hstgr.cloud', status: 'valid' },
    ]
  },
  {
    id: '2',
    domain: 'www.softwarewala.net',
    type: 'redirect',
    status: 'valid',
    ssl: 'active',
    assignedTo: 'softwarewala.net',
    addedAt: '2025-01-15',
  },
  {
    id: '3',
    domain: 'demo.softwarewala.net',
    type: 'preview',
    status: 'valid',
    ssl: 'active',
    assignedTo: 'Demo System',
    addedAt: '2025-02-10',
  },
  {
    id: '4',
    domain: 'api.softwarewala.net',
    type: 'production',
    status: 'valid',
    ssl: 'active',
    assignedTo: 'API Gateway',
    addedAt: '2025-02-20',
  },
  {
    id: '5',
    domain: 'staging.softwarewala.net',
    type: 'preview',
    status: 'pending',
    ssl: 'pending',
    assignedTo: 'Staging',
    addedAt: '2025-03-01',
    dnsRecords: [
      { type: 'A', name: 'staging', value: '72.61.236.249', status: 'pending' },
    ]
  },
];

const SMDomains = () => {
  const [domains] = useState<Domain[]>(mockDomains);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    valid: { color: 'text-emerald-400', icon: CheckCircle2, label: 'Valid Configuration' },
    pending: { color: 'text-amber-400', icon: Clock, label: 'Pending Verification' },
    invalid: { color: 'text-red-400', icon: XCircle, label: 'Invalid' },
    configuring: { color: 'text-blue-400', icon: RefreshCw, label: 'Configuring' },
  };

  const sslConfig: Record<string, { color: string; label: string }> = {
    active: { color: 'text-emerald-400', label: 'SSL Active' },
    pending: { color: 'text-amber-400', label: 'SSL Pending' },
    expired: { color: 'text-red-400', label: 'SSL Expired' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Domains</h1>
          <p className="text-sm text-[#888] mt-1">Manage custom domains, DNS records, and SSL certificates</p>
        </div>
        <Button 
          onClick={() => {
            toast.info('Add domain modal — coming soon');
            setShowAddModal(true);
          }}
          className="bg-white text-black hover:bg-[#ccc] text-sm font-medium h-9 px-4"
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          Add Domain
        </Button>
      </div>

      {/* Wildcard DNS Info */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
        <Globe className="w-4 h-4 text-blue-400" />
        <div className="flex-1">
          <span className="text-sm text-[#ccc]">Wildcard DNS configured: </span>
          <span className="text-sm text-white font-mono">*.softwarewala.net → 72.61.236.249</span>
        </div>
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      </div>

      {/* Domain List */}
      <div className="border border-[#222] rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#222] text-xs text-[#555] uppercase tracking-wider">
          <div className="col-span-4">Domain</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">SSL</div>
          <div className="col-span-2">Assigned To</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {domains.map((domain, i) => {
          const config = statusConfig[domain.status];
          const ssl = sslConfig[domain.ssl];
          const StatusIcon = config.icon;
          const isExpanded = expandedDomain === domain.id;

          return (
            <div key={domain.id}>
              <div 
                className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[#111] transition-colors cursor-pointer ${
                  i < domains.length - 1 && !isExpanded ? 'border-b border-[#1a1a1a]' : ''
                }`}
                onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
              >
                {/* Domain Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#555]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{domain.domain}</span>
                      <a 
                        href={`https://${domain.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#555] hover:text-blue-400"
                        onClick={e => e.stopPropagation()}
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider ${
                      domain.type === 'production' ? 'text-blue-400' : 
                      domain.type === 'redirect' ? 'text-[#666]' : 'text-purple-400'
                    }`}>
                      {domain.type}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center gap-2">
                  <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                  <span className={`text-xs ${config.color}`}>{config.label}</span>
                </div>

                {/* SSL */}
                <div className="col-span-2 flex items-center gap-2">
                  <Lock className={`w-3 h-3 ${ssl.color}`} />
                  <span className={`text-xs ${ssl.color}`}>{ssl.label}</span>
                </div>

                {/* Assigned To */}
                <div className="col-span-2">
                  <span className="text-xs text-[#888]">{domain.assignedTo}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center gap-2 justify-end">
                  <button 
                    className="p-1.5 text-[#555] hover:text-white hover:bg-[#222] rounded transition-colors"
                    onClick={e => { e.stopPropagation(); toast.info('Refreshing SSL...'); }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-[#555] hover:text-white hover:bg-[#222] rounded transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded DNS Records */}
              {isExpanded && domain.dnsRecords && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-[#222] bg-[#080808]"
                >
                  <div className="px-5 py-4 ml-7">
                    <p className="text-xs text-[#888] mb-3 font-medium">DNS Records</p>
                    <div className="space-y-2">
                      {domain.dnsRecords.map((record, rIdx) => (
                        <div key={rIdx} className="grid grid-cols-4 gap-4 text-xs py-2 px-3 rounded bg-[#0a0a0a] border border-[#1a1a1a]">
                          <div>
                            <span className="text-[#555]">Type: </span>
                            <span className="text-white font-mono">{record.type}</span>
                          </div>
                          <div>
                            <span className="text-[#555]">Name: </span>
                            <span className="text-white font-mono">{record.name}</span>
                          </div>
                          <div>
                            <span className="text-[#555]">Value: </span>
                            <span className="text-white font-mono">{record.value}</span>
                          </div>
                          <div className="text-right">
                            {record.status === 'valid' ? (
                              <span className="text-emerald-400 flex items-center gap-1 justify-end">
                                <CheckCircle2 className="w-3 h-3" /> Valid
                              </span>
                            ) : (
                              <span className="text-amber-400 flex items-center gap-1 justify-end">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#444] mt-3">
                      DNS propagation can take up to 48 hours. Records are checked every 30 minutes.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[#555] pt-2">
        <span>{domains.length} domains configured</span>
        <span>VPS: srv1183368.hstgr.cloud · 72.61.236.249</span>
      </div>
    </div>
  );
};

export default SMDomains;
