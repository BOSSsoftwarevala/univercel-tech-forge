import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, UserPlus, ArrowRight,
  Phone, Mail, MapPin, Star, Clock, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  maskedContact: string;
  industry: string;
  region: string;
  city: string;
  language: string;
  score: number;
  status: string;
  assignedToReseller: string | null;
  demoRequested: boolean;
}

const FranchiseLeadConsole = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Raj Kumar', maskedContact: '98****1234', industry: 'Retail', region: 'Maharashtra', city: 'Mumbai', language: 'Hindi', score: 85, status: 'new', assignedToReseller: null, demoRequested: false },
    { id: '2', name: 'Priya Singh', maskedContact: '87****5678', industry: 'Healthcare', region: 'Maharashtra', city: 'Pune', language: 'Marathi', score: 92, status: 'contacted', assignedToReseller: 'RSL-001', demoRequested: true },
    { id: '3', name: 'Amit Patel', maskedContact: '79****9012', industry: 'Education', region: 'Gujarat', city: 'Ahmedabad', language: 'Gujarati', score: 78, status: 'demo_scheduled', assignedToReseller: null, demoRequested: true },
    { id: '4', name: 'Sneha Gupta', maskedContact: '90****3456', industry: 'Finance', region: 'Maharashtra', city: 'Mumbai', language: 'English', score: 65, status: 'negotiation', assignedToReseller: 'RSL-002', demoRequested: true },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const resellers = [
    { id: 'RSL-001', name: 'Reseller Alpha', region: 'Mumbai', performance: 92 },
    { id: 'RSL-002', name: 'Reseller Beta', region: 'Pune', performance: 88 },
    { id: 'RSL-003', name: 'Reseller Gamma', region: 'Ahmedabad', performance: 85 },
  ];

  const handleAssignToReseller = (leadId: string, resellerId: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, assignedToReseller: resellerId, status: 'assigned' } : lead
    ));
    toast({
      title: "Lead Assigned",
      description: "Lead has been assigned to the reseller successfully.",
    });
  };

  const handleRequestDemo = (leadId: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, demoRequested: true } : lead
    ));
    toast({
      title: "Demo Requested",
      description: "Demo request sent to Demo Manager for approval.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-emerald-400 bg-emerald-500/20';
      case 'contacted': return 'text-cyan-400 bg-cyan-500/20';
      case 'assigned': return 'text-purple-400 bg-purple-500/20';
      case 'demo_scheduled': return 'text-indigo-400 bg-indigo-500/20';
      case 'negotiation': return 'text-amber-400 bg-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || lead.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Assignment Console</h1>
          <p className="text-slate-400">Manage and assign leads within your territory</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Total Leads:</span>
          <span className="text-lg font-bold text-indigo-400">{leads.length}</span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
        <Shield className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-amber-400">Contact information is masked for security. Direct contact is restricted.</span>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search leads by name or industry..."
              className="pl-10 bg-slate-800 border-slate-700"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'demo_scheduled', 'negotiation'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {filter === 'all' ? 'All' : filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <span className="text-indigo-400 font-bold text-lg">{lead.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-0.5 rounded ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                      <span className={`flex items-center gap-1 ${getScoreColor(lead.score)}`}>
                        <Star className="w-3 h-3" />
                        Score: {lead.score}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span>{lead.maskedContact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{lead.city}, {lead.region}</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">Industry:</span> {lead.industry}
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">Language:</span> {lead.language}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {!lead.demoRequested && (
                  <Button
                    onClick={() => handleRequestDemo(lead.id)}
                    variant="outline"
                    size="sm"
                    className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
                  >
                    Request Demo
                  </Button>
                )}
                {lead.demoRequested && !lead.assignedToReseller && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded text-center">
                    Demo Pending
                  </span>
                )}
              </div>
            </div>

            {/* Assign to Reseller Section */}
            {!lead.assignedToReseller && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-400 mb-3">Assign to Reseller:</p>
                <div className="flex flex-wrap gap-2">
                  {resellers
                    .filter(r => r.region === lead.city || r.region === lead.region)
                    .map(reseller => (
                    <button
                      key={reseller.id}
                      onClick={() => handleAssignToReseller(lead.id, reseller.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/50 transition-all"
                    >
                      <UserPlus className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm text-white">{reseller.name}</span>
                      <span className="text-xs text-emerald-400">{reseller.performance}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lead.assignedToReseller && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Assigned to:</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded">
                    {resellers.find(r => r.id === lead.assignedToReseller)?.name || lead.assignedToReseller}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Leads Found</h3>
          <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default FranchiseLeadConsole;
