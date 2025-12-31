import React, { useState } from 'react';
import { 
  Target, Filter, Search, Plus, MoreHorizontal, Phone, Mail,
  User, MapPin, Calendar, Star, AlertTriangle, CheckCircle,
  Clock, ArrowRight, Sparkles, Building2, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaskedInfoTag } from '../components/MaskedInfoTag';
import { WireframeModal } from '../components/WireframeModal';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Lead {
  id: string;
  name: string;
  contact: string;
  email: string;
  location: string;
  source: string;
  score: number;
  status: 'new' | 'qualified' | 'demo' | 'closed';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

const mockLeads: Lead[] = [
  { id: 'L-2847', name: 'ABC Corp', contact: '+91 98***12345', email: 'con***@abc.com', location: 'Mumbai', source: 'Franchise', score: 85, status: 'new', priority: 'high', createdAt: '2 min ago' },
  { id: 'L-2846', name: 'XYZ Ltd', contact: '+91 87***54321', email: 'inf***@xyz.com', location: 'Delhi', source: 'Reseller', score: 72, status: 'qualified', priority: 'medium', createdAt: '15 min ago' },
  { id: 'L-2845', name: 'Tech Solutions', contact: '+91 76***98765', email: 'sal***@tech.com', location: 'Bangalore', source: 'Direct', score: 90, status: 'demo', priority: 'high', createdAt: '1 hour ago' },
  { id: 'L-2844', name: 'Global Inc', contact: '+91 65***45678', email: 'buy***@global.com', location: 'Chennai', source: 'Influencer', score: 65, status: 'new', priority: 'low', createdAt: '2 hours ago' },
  { id: 'L-2843', name: 'Smart Systems', contact: '+91 54***32109', email: 'inf***@smart.com', location: 'Hyderabad', source: 'Organic', score: 78, status: 'qualified', priority: 'medium', createdAt: '3 hours ago' },
];

export function LeadManagerScreen() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState(mockLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', contact: '', email: '', location: '', source: 'Direct', notes: '' });
  const isDark = true;

  const columns = ['new', 'qualified', 'demo', 'closed'] as const;
  const columnLabels = { new: 'New Leads', qualified: 'Qualified', demo: 'Demo Scheduled', closed: 'Closed' };
  const columnColors = { new: 'border-amber-500', qualified: 'border-cyan-500', demo: 'border-purple-500', closed: 'border-emerald-500' };

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === 'all' || lead.source.toLowerCase() === sourceFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    return matchesSearch && matchesSource && matchesPriority;
  });

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true);
    toast.info('Running AI Analysis...', { description: 'Analyzing lead quality and conversion potential' });
    
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('AI Analysis Complete', {
        description: '3 leads scored, 2 ready for demo recommendation'
      });
    }, 2000);
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.contact) {
      toast.error('Please fill required fields');
      return;
    }

    const lead: Lead = {
      id: `L-${Date.now().toString().slice(-4)}`,
      name: newLead.name,
      contact: newLead.contact.replace(/\d(?=\d{4})/g, '*'),
      email: newLead.email ? newLead.email.replace(/(.{3}).*(@.*)/, '$1***$2') : 'N/A',
      location: newLead.location || 'Unknown',
      source: newLead.source,
      score: Math.floor(Math.random() * 30) + 60,
      status: 'new',
      priority: 'medium',
      createdAt: 'Just now',
    };

    setLeads(prev => [lead, ...prev]);
    setNewLead({ name: '', contact: '', email: '', location: '', source: 'Direct', notes: '' });
    setAddLeadOpen(false);
    toast.success('Lead Added', { description: `Lead ${lead.id} created successfully` });
  };

  const handleAssignLead = () => {
    if (selectedLead) {
      toast.success('Lead Assigned', { description: `${selectedLead.id} has been assigned to your team` });
      setSelectedLead(null);
    }
  };

  const handleScheduleDemo = () => {
    if (selectedLead) {
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'demo' as const } : l));
      toast.success('Demo Scheduled', { description: `Demo scheduled for ${selectedLead.name}` });
      setSelectedLead(null);
    }
  };

  const handleApplyFilters = () => {
    setFilterOpen(false);
    toast.success('Filters Applied', {
      description: `Showing ${filteredLeads.length} leads`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-teal-500" />
            Lead Manager
          </h1>
          <p className="text-muted-foreground">Manage and track all leads</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filters Sheet */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
              <SheetHeader>
                <SheetTitle>Filter Leads</SheetTitle>
                <SheetDescription>Apply filters to narrow down leads</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="franchise">Franchise</SelectItem>
                      <SelectItem value="reseller">Reseller</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="influencer">Influencer</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={() => { setSourceFilter('all'); setPriorityFilter('all'); }}>
                  Reset
                </Button>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Add Lead Sheet */}
          <Sheet open={addLeadOpen} onOpenChange={setAddLeadOpen}>
            <SheetTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </SheetTrigger>
            <SheetContent className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
              <SheetHeader>
                <SheetTitle>Add New Lead</SheetTitle>
                <SheetDescription>Enter lead details below</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input 
                    placeholder="Enter company name"
                    value={newLead.name}
                    onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number *</Label>
                  <Input 
                    placeholder="+91 XXXXX XXXXX"
                    value={newLead.contact}
                    onChange={(e) => setNewLead(prev => ({ ...prev, contact: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    placeholder="email@company.com"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="City"
                    value={newLead.location}
                    onChange={(e) => setNewLead(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select value={newLead.source} onValueChange={(v) => setNewLead(prev => ({ ...prev, source: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Franchise">Franchise</SelectItem>
                      <SelectItem value="Reseller">Reseller</SelectItem>
                      <SelectItem value="Influencer">Influencer</SelectItem>
                      <SelectItem value="Organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea 
                    placeholder="Additional notes..."
                    value={newLead.notes}
                    onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={() => setAddLeadOpen(false)}>Cancel</Button>
                <Button onClick={handleAddLead}>Add Lead</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="franchise">Franchise</SelectItem>
            <SelectItem value="reseller">Reseller</SelectItem>
            <SelectItem value="direct">Direct</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Qualification Widget */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <div>
              <h3 className="font-semibold">AI Lead Qualification</h3>
              <p className="text-sm text-muted-foreground">3 leads need scoring • 2 ready for demo</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRunAIAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Run AI Analysis'
            )}
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col} className={`rounded-xl border-t-4 ${columnColors[col]} ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            {/* Column Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{columnLabels[col]}</h3>
                <Badge variant="outline">{filteredLeads.filter(l => l.status === col).length}</Badge>
              </div>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredLeads.filter(l => l.status === col).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                    isDark ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/50' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Priority & ID */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{lead.id}</Badge>
                    {lead.priority === 'high' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>

                  {/* Name */}
                  <h4 className="font-semibold mb-2">{lead.name}</h4>

                  {/* Masked Contact */}
                  <MaskedInfoTag type="phone" maskedValue={lead.contact} isDark={isDark} />

                  {/* Location & Score */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {lead.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-medium">{lead.score}</span>
                    </div>
                  </div>

                  {/* Source & Time */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
                    <Badge variant="outline" className="text-[10px]">{lead.source}</Badge>
                    <span className="text-[10px] text-muted-foreground">{lead.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Detail Modal */}
      <WireframeModal
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={`Lead Details: ${selectedLead?.name}`}
        subtitle={selectedLead?.id}
        size="lg"
        isDark={isDark}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedLead(null)}>Close</Button>
            <Button onClick={handleAssignLead}>Assign Lead</Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500" onClick={handleScheduleDemo}>
              Schedule Demo
            </Button>
          </>
        }
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Contact</label>
                <MaskedInfoTag type="phone" maskedValue={selectedLead.contact} isDark={isDark} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <MaskedInfoTag type="email" maskedValue={selectedLead.email} isDark={isDark} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <p className="text-xs text-muted-foreground">AI Score</p>
                <p className="text-2xl font-bold text-cyan-500">{selectedLead.score}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <p className="text-xs text-muted-foreground">Priority</p>
                <Badge className={selectedLead.priority === 'high' ? 'bg-red-500' : selectedLead.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}>
                  {selectedLead.priority}
                </Badge>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <p className="text-xs text-muted-foreground">Source</p>
                <p className="font-semibold">{selectedLead.source}</p>
              </div>
            </div>
          </div>
        )}
      </WireframeModal>
    </div>
  );
}
