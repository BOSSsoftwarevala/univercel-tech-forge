import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, FileText, Calendar, AlertTriangle, CheckCircle2,
  Clock, Shield, Lock, RefreshCw, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Territory {
  id: string;
  name: string;
  type: 'state' | 'city' | 'district';
  isExclusive: boolean;
  leads: number;
  sales: string;
  status: 'active' | 'pending' | 'disputed';
}

interface Contract {
  id: string;
  contractNumber: string;
  type: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  status: 'active' | 'expiring_soon' | 'expired';
  autoRenew: boolean;
}

const FranchiseContractTerritory = () => {
  const [activeTab, setActiveTab] = useState<'territories' | 'contracts'>('territories');

  const [territories] = useState<Territory[]>([
    { id: '1', name: 'Maharashtra', type: 'state', isExclusive: true, leads: 145, sales: '₹12.5L', status: 'active' },
    { id: '2', name: 'Mumbai', type: 'city', isExclusive: true, leads: 85, sales: '₹8.2L', status: 'active' },
    { id: '3', name: 'Pune', type: 'city', isExclusive: false, leads: 42, sales: '₹3.8L', status: 'active' },
    { id: '4', name: 'Gujarat', type: 'state', isExclusive: false, leads: 28, sales: '₹2.1L', status: 'pending' },
  ]);

  const [contracts] = useState<Contract[]>([
    { id: '1', contractNumber: 'FRC-2024-001', type: 'Exclusive', startDate: 'Jan 1, 2024', endDate: 'Dec 31, 2025', renewalDate: 'Nov 1, 2025', status: 'active', autoRenew: true },
    { id: '2', contractNumber: 'FRC-2024-002', type: 'Standard', startDate: 'Mar 15, 2024', endDate: 'Mar 14, 2025', renewalDate: 'Feb 14, 2025', status: 'expiring_soon', autoRenew: false },
  ]);

  const handleRequestTerritory = () => {
    toast({
      title: "Territory Request",
      description: "Your request for new territory has been submitted.",
    });
  };

  const handleRenewalRequest = (contractId: string) => {
    toast({
      title: "Renewal Requested",
      description: "Your contract renewal request has been submitted.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/20';
      case 'expiring_soon': return 'text-amber-400 bg-amber-500/20';
      case 'expired': return 'text-red-400 bg-red-500/20';
      case 'pending': return 'text-cyan-400 bg-cyan-500/20';
      case 'disputed': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Territory & Contracts</h1>
          <p className="text-slate-400">Manage your territories and contract renewals</p>
        </div>
        <Button onClick={handleRequestTerritory} className="bg-indigo-500 hover:bg-indigo-600">
          <MapPin className="w-4 h-4 mr-2" />
          Request Territory
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('territories')}
          className={`pb-3 px-2 text-sm font-medium transition-all relative ${
            activeTab === 'territories' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Territories
          {activeTab === 'territories' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 px-2 text-sm font-medium transition-all relative ${
            activeTab === 'contracts' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Contracts
          {activeTab === 'contracts' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>
      </div>

      {activeTab === 'territories' && (
        <div className="space-y-6">
          {/* Territory Rules */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">Territory Rules</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Exclusive territories cannot overlap without Super Admin override</li>
                  <li>• Leads are routed based on location, language, and industry</li>
                  <li>• You can only reassign leads within your sub-resellers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Territory List */}
          <div className="grid md:grid-cols-2 gap-4">
            {territories.map((territory, index) => (
              <motion.div
                key={territory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{territory.name}</h3>
                      <p className="text-sm text-slate-400 capitalize">{territory.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(territory.status)}`}>
                      {territory.status}
                    </span>
                    {territory.isExclusive && (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <Lock className="w-3 h-3" />
                        Exclusive
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-400 mb-1">Total Leads</p>
                    <p className="text-xl font-bold text-white">{territory.leads}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-400 mb-1">Total Sales</p>
                    <p className="text-xl font-bold text-emerald-400">{territory.sales}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'contracts' && (
        <div className="space-y-6">
          {/* Contract List */}
          {contracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border backdrop-blur-sm ${
                contract.status === 'expiring_soon' 
                  ? 'bg-amber-500/5 border-amber-500/30' 
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              {contract.status === 'expiring_soon' && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-medium">Contract expiring soon - Renewal recommended</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{contract.contractNumber}</h3>
                    <p className="text-slate-400">{contract.type} Contract</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${getStatusColor(contract.status)}`}>
                  {contract.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </div>
                  <p className="font-medium text-white">{contract.startDate}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </div>
                  <p className="font-medium text-white">{contract.endDate}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <RefreshCw className="w-4 h-4" />
                    Renewal Date
                  </div>
                  <p className="font-medium text-amber-400">{contract.renewalDate}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Auto Renew
                  </div>
                  <p className={`font-medium ${contract.autoRenew ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {contract.autoRenew ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Contract
                </Button>
                {contract.status === 'expiring_soon' && (
                  <Button 
                    onClick={() => handleRenewalRequest(contract.id)}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Request Renewal
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FranchiseContractTerritory;
