import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Users, Search, Filter, ArrowRight, 
  Star, MapPin, Phone, Mail, Building2, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  industry: string;
  region: string;
  score: number;
  status: string;
  maskedContact: string;
}

interface Reseller {
  id: string;
  name: string;
  region: string;
  activeLeads: number;
  conversionRate: number;
  rating: number;
}

const FranchiseAssignLead = () => {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [selectedReseller, setSelectedReseller] = useState<string | null>(null);

  const unassignedLeads: Lead[] = [
    { id: '1', name: 'Amit Sharma', industry: 'Retail', region: 'Mumbai', score: 85, status: 'new', maskedContact: '+91 98***12345' },
    { id: '2', name: 'Priya Patel', industry: 'Healthcare', region: 'Pune', score: 92, status: 'new', maskedContact: '+91 87***54321' },
    { id: '3', name: 'Raj Kumar', industry: 'Education', region: 'Thane', score: 78, status: 'new', maskedContact: '+91 76***98765' },
    { id: '4', name: 'Sneha Gupta', industry: 'Finance', region: 'Mumbai', score: 65, status: 'new', maskedContact: '+91 99***45678' },
  ];

  const resellers: Reseller[] = [
    { id: 'r1', name: 'TechSales Pro', region: 'Mumbai', activeLeads: 8, conversionRate: 72, rating: 4.8 },
    { id: 'r2', name: 'Digital Partners', region: 'Pune', activeLeads: 5, conversionRate: 68, rating: 4.5 },
    { id: 'r3', name: 'SalesForce Hub', region: 'Mumbai', activeLeads: 12, conversionRate: 65, rating: 4.2 },
    { id: 'r4', name: 'Growth Experts', region: 'Thane', activeLeads: 3, conversionRate: 80, rating: 4.9 },
  ];

  const handleAssign = () => {
    if (!selectedLead || !selectedReseller) {
      toast.error('Please select both a lead and a reseller');
      return;
    }
    const lead = unassignedLeads.find(l => l.id === selectedLead);
    const reseller = resellers.find(r => r.id === selectedReseller);
    toast.success(`Lead "${lead?.name}" assigned to "${reseller?.name}"`);
    setSelectedLead(null);
    setSelectedReseller(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assign Leads</h1>
          <p className="text-slate-400">Distribute unassigned leads to your resellers</p>
        </div>
        <Button 
          className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
          disabled={!selectedLead || !selectedReseller}
          onClick={handleAssign}
        >
          <UserPlus className="w-4 h-4" />
          Assign Selected
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search leads or resellers..." 
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
          />
        </div>
        <Select>
          <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="pune">Pune</SelectItem>
            <SelectItem value="thane">Thane</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Leads */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Unassigned Leads
              </div>
              <Badge className="bg-indigo-500/20 text-indigo-300">{unassignedLeads.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {unassignedLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedLead(lead.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedLead === lead.id 
                    ? 'bg-indigo-500/20 border-2 border-indigo-500' 
                    : 'bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedLead === lead.id && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <span className="text-indigo-400 font-semibold">{lead.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.industry} • {lead.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getScoreColor(lead.score)}`}>
                      Score: {lead.score}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">{lead.maskedContact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Arrow Indicator */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <ArrowRight className="w-8 h-8 text-indigo-500" />
        </div>

        {/* Resellers */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Available Resellers
              </div>
              <Badge className="bg-purple-500/20 text-purple-300">{resellers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {resellers.map((reseller, index) => (
              <motion.div
                key={reseller.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedReseller(reseller.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedReseller === reseller.id 
                    ? 'bg-purple-500/20 border-2 border-purple-500' 
                    : 'bg-slate-900/50 border border-slate-700/50 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedReseller === reseller.id && (
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{reseller.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {reseller.region}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-sm font-medium">{reseller.rating}</span>
                    </div>
                    <p className="text-xs text-slate-400">{reseller.activeLeads} active • {reseller.conversionRate}% conv.</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Assignment Preview */}
      {selectedLead && selectedReseller && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Selected Lead</p>
                <p className="font-medium text-white">{unassignedLeads.find(l => l.id === selectedLead)?.name}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-400" />
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Assigned To</p>
                <p className="font-medium text-white">{resellers.find(r => r.id === selectedReseller)?.name}</p>
              </div>
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2" onClick={handleAssign}>
              <Check className="w-4 h-4" />
              Confirm Assignment
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FranchiseAssignLead;
