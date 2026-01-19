/**
 * RESELLER LEADS MANAGER
 * Lead Sources: Website, WhatsApp, Meta Ads, Google Ads, Referral, Manual
 * Actions: Status, Note, Follow-Up, Convert, Send to Approval
 * Masking: Email & Phone masked
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  Globe,
  MessageCircle,
  Facebook,
  Chrome,
  UserPlus,
  Edit3,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Send,
  StickyNote,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

const leadSources = [
  { id: 'all', label: 'All Leads', icon: null },
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'meta', label: 'Meta Ads', icon: Facebook },
  { id: 'google', label: 'Google Ads', icon: Chrome },
  { id: 'referral', label: 'Referral', icon: UserPlus },
  { id: 'manual', label: 'Manual', icon: Edit3 },
];

const initialLeads = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'r***@gmail.com',
    phone: '98***45',
    source: 'whatsapp',
    status: 'hot',
    product: 'School ERP',
    notes: 'Interested in demo',
    followUp: '2024-01-20',
    createdAt: '2024-01-18',
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'p***@yahoo.com',
    phone: '87***23',
    source: 'website',
    status: 'warm',
    product: 'Hospital HMS',
    notes: '',
    followUp: '',
    createdAt: '2024-01-17',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'a***@hotmail.com',
    phone: '99***67',
    source: 'google',
    status: 'new',
    product: 'Retail POS',
    notes: 'Budget discussion pending',
    followUp: '2024-01-21',
    createdAt: '2024-01-16',
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    email: 's***@gmail.com',
    phone: '91***89',
    source: 'meta',
    status: 'converted',
    product: 'Business ERP',
    notes: 'Deal closed',
    followUp: '',
    createdAt: '2024-01-15',
  },
];

export function RSLeadsScreen() {
  const [leads, setLeads] = useState(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState('all');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);
  const [noteText, setNoteText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [manualLeadOpen, setManualLeadOpen] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = activeSource === 'all' || lead.source === activeSource;
    return matchesSearch && matchesSource;
  });

  const handleStatusChange = (leadId: number, newStatus: string) => {
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    toast.success('Status updated');
  };

  const handleAddNote = () => {
    if (selectedLead && noteText) {
      setLeads(leads.map((l) => (l.id === selectedLead.id ? { ...l, notes: noteText } : l)));
      setNoteDialogOpen(false);
      setNoteText('');
      toast.success('Note added');
    }
  };

  const handleSetFollowUp = () => {
    if (selectedLead && followUpDate) {
      setLeads(leads.map((l) => (l.id === selectedLead.id ? { ...l, followUp: followUpDate } : l)));
      setFollowUpDialogOpen(false);
      setFollowUpDate('');
      toast.success('Follow-up reminder set');
    }
  };

  const handleConvert = (lead: typeof leads[0]) => {
    setLeads(leads.map((l) => (l.id === lead.id ? { ...l, status: 'converted' } : l)));
    toast.success(`${lead.name} converted to sale!`);
  };

  const handleSendApproval = (lead: typeof leads[0]) => {
    toast.success(`${lead.name} sent for approval`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500/20 text-red-400';
      case 'warm': return 'bg-amber-500/20 text-amber-400';
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'converted': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getSourceIcon = (source: string) => {
    const found = leadSources.find((s) => s.id === source);
    return found?.icon || Globe;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Manager</h1>
          <p className="text-sm text-slate-400">Track and manage your leads</p>
        </div>
        <Dialog open={manualLeadOpen} onOpenChange={setManualLeadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Add Manual Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Name" className="bg-slate-800 border-slate-700 text-white" />
              <Input placeholder="Email" className="bg-slate-800 border-slate-700 text-white" />
              <Input placeholder="Phone" className="bg-slate-800 border-slate-700 text-white" />
              <Select>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="school">School ERP</SelectItem>
                  <SelectItem value="hospital">Hospital HMS</SelectItem>
                  <SelectItem value="retail">Retail POS</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Notes" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <DialogFooter>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
                setManualLeadOpen(false);
                toast.success('Lead added successfully');
              }}>
                Add Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Source Tabs */}
      <Tabs value={activeSource} onValueChange={setActiveSource}>
        <TabsList className="bg-slate-900/50 border border-slate-800">
          {leadSources.map((source) => (
            <TabsTrigger
              key={source.id}
              value={source.id}
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              {source.icon && <source.icon className="h-4 w-4 mr-1" />}
              {source.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.map((lead, index) => {
          const SourceIcon = getSourceIcon(lead.source);
          return (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Lead Info */}
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-slate-800">
                        <SourceIcon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product & Status */}
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {lead.product}
                      </Badge>
                      <Select
                        value={lead.status}
                        onValueChange={(val) => handleStatusChange(lead.id, val)}
                      >
                        <SelectTrigger className={`w-28 h-8 text-xs ${getStatusColor(lead.status)} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="warm">Warm</SelectItem>
                          <SelectItem value="hot">Hot</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={() => {
                          setSelectedLead(lead);
                          setNoteText(lead.notes);
                          setNoteDialogOpen(true);
                        }}
                      >
                        <StickyNote className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={() => {
                          setSelectedLead(lead);
                          setFollowUpDate(lead.followUp);
                          setFollowUpDialogOpen(true);
                        }}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => handleConvert(lead)}
                        disabled={lead.status === 'converted'}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Convert
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => handleSendApproval(lead)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Approval
                      </Button>
                    </div>
                  </div>

                  {/* Notes & Follow-up */}
                  {(lead.notes || lead.followUp) && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-3 text-xs">
                      {lead.notes && (
                        <span className="text-slate-400">
                          <StickyNote className="h-3 w-3 inline mr-1" />
                          {lead.notes}
                        </span>
                      )}
                      {lead.followUp && (
                        <span className="text-amber-400">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Follow-up: {lead.followUp}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter note..."
            className="bg-slate-800 border-slate-700 text-white"
          />
          <DialogFooter>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddNote}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Set Follow-up Reminder</DialogTitle>
          </DialogHeader>
          <Input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white"
          />
          <DialogFooter>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSetFollowUp}>
              Set Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
