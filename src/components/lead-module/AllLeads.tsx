/**
 * ALL LEADS LIST
 * Lead records with actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Eye, UserPlus, PhoneCall, TrendingUp, XCircle,
  Search, Filter, MoreHorizontal, Mail, Phone, Globe,
  Flame, Thermometer, Snowflake
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const mockLeads = [
  { id: '1', name: 'Rahul Sharma', email: 'r***@gmail.com', phone: '+91 98***123', country: 'India', city: 'Mumbai', product: 'School ERP Pro', roleType: 'Client', source: 'Website Form', status: 'qualified', aiScore: 85, tag: 'hot' },
  { id: '2', name: 'John Smith', email: 'j***@yahoo.com', phone: '+1 555***789', country: 'USA', city: 'New York', product: 'Hospital Management', roleType: 'Client', source: 'Google Ads', status: 'new', aiScore: 72, tag: 'warm' },
  { id: '3', name: 'Priya Patel', email: 'p***@company.com', phone: '+91 87***456', country: 'India', city: 'Delhi', product: 'Franchise Opportunity', roleType: 'Franchise', source: 'Franchise Apply', status: 'contacted', aiScore: 91, tag: 'hot' },
  { id: '4', name: 'Ahmed Khan', email: 'a***@email.com', phone: '+971 50***321', country: 'UAE', city: 'Dubai', product: 'Restaurant POS', roleType: 'Client', source: 'Demo Request', status: 'hot', aiScore: 88, tag: 'hot' },
  { id: '5', name: 'Maria Garcia', email: 'm***@mail.com', phone: '+34 6***654', country: 'Spain', city: 'Madrid', product: 'Real Estate CRM', roleType: 'Reseller', source: 'Reseller Apply', status: 'new', aiScore: 45, tag: 'cold' },
  { id: '6', name: 'Chen Wei', email: 'c***@tech.cn', phone: '+86 13***987', country: 'China', city: 'Shanghai', product: 'Gym Management', roleType: 'Client', source: 'SEO Organic', status: 'lost', aiScore: 32, tag: 'cold' },
];

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  qualified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  hot: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  converted: 'bg-green-500/20 text-green-400 border-green-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export const AllLeads: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = mockLeads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'hot': return <Flame className="w-3.5 h-3.5 text-orange-500" />;
      case 'warm': return <Thermometer className="w-3.5 h-3.5 text-amber-500" />;
      case 'cold': return <Snowflake className="w-3.5 h-3.5 text-blue-500" />;
      default: return null;
    }
  };

  const handleAction = (action: string, lead: typeof mockLeads[0]) => {
    switch (action) {
      case 'assign':
        toast.success(`Lead "${lead.name}" assigned successfully`);
        break;
      case 'followup':
        toast.info(`Follow-up scheduled for "${lead.name}"`);
        break;
      case 'convert':
        toast.success(`Lead "${lead.name}" converted! Order created.`);
        break;
      case 'close':
        toast.warning(`Lead "${lead.name}" marked as lost`);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          All Leads
        </h1>
        <p className="text-sm text-muted-foreground">Manage and track all leads</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'contacted', 'qualified', 'hot', 'converted', 'lost'].map((status) => (
            <Button 
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <Card className="bg-card/80 border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="p-3">Lead</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Product Interest</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">AI Score</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, idx) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getTagIcon(lead.tag)}
                        <div>
                          <p className="font-medium text-foreground text-sm">{lead.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{lead.country}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{lead.city}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-foreground">{lead.product}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{lead.roleType}</Badge>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-muted-foreground">{lead.source}</p>
                    </td>
                    <td className="p-3">
                      <Badge className={cn("capitalize text-xs", statusColors[lead.status])}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              lead.aiScore >= 80 ? "bg-green-500" :
                              lead.aiScore >= 50 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${lead.aiScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{lead.aiScore}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('assign', lead)}>
                            <UserPlus className="w-4 h-4 mr-2" /> Assign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('followup', lead)}>
                            <PhoneCall className="w-4 h-4 mr-2" /> Follow-up
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('convert', lead)}>
                            <TrendingUp className="w-4 h-4 mr-2" /> Convert
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('close', lead)} className="text-destructive">
                            <XCircle className="w-4 h-4 mr-2" /> Close
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLead && getTagIcon(selectedLead.tag)}
              {selectedLead?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selectedLead.email}</p></div>
                <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{selectedLead.phone}</p></div>
                <div><span className="text-muted-foreground">Country:</span><p className="font-medium">{selectedLead.country}</p></div>
                <div><span className="text-muted-foreground">City:</span><p className="font-medium">{selectedLead.city}</p></div>
                <div><span className="text-muted-foreground">Product:</span><p className="font-medium">{selectedLead.product}</p></div>
                <div><span className="text-muted-foreground">Role Type:</span><p className="font-medium">{selectedLead.roleType}</p></div>
                <div><span className="text-muted-foreground">Source:</span><p className="font-medium">{selectedLead.source}</p></div>
                <div><span className="text-muted-foreground">AI Score:</span><p className="font-medium">{selectedLead.aiScore}/100</p></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 gap-2" onClick={() => { handleAction('assign', selectedLead); setSelectedLead(null); }}>
                  <UserPlus className="w-4 h-4" /> Assign
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => { handleAction('followup', selectedLead); setSelectedLead(null); }}>
                  <PhoneCall className="w-4 h-4" /> Follow-up
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
