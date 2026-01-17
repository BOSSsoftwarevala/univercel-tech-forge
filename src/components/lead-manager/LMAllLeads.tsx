import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, Upload, Plus, MoreHorizontal,
  Phone, Mail, MapPin, Brain, Clock, CheckCircle, XCircle,
  UserPlus, Trash2, RefreshCw, Eye, Edit, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { sampleLeads, pipelineStages, leadSourcesConfig, leadCategoriesConfig } from './data/leadData';
import { Lead } from './types/leadTypes';

const LMAllLeads = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAll = () => {
    if (selectedLeads.length === sampleLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(sampleLeads.map(l => l.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleAction = async (action: string, lead?: Lead) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (action) {
      case 'view':
        toast.info(`Viewing lead: ${lead?.name}`);
        break;
      case 'edit':
        toast.info(`Editing lead: ${lead?.name}`);
        break;
      case 'assign':
        toast.success(`Lead assigned successfully`);
        break;
      case 'delete':
        toast.success(`Lead moved to trash`);
        break;
      case 'export':
        toast.success(`Exporting ${selectedLeads.length || 'all'} leads...`);
        break;
      case 'import':
        toast.info('Opening import dialog...');
        break;
      case 'create':
        toast.info('Opening create lead form...');
        break;
      case 'bulk_assign':
        toast.success(`${selectedLeads.length} leads assigned`);
        break;
      case 'bulk_delete':
        toast.success(`${selectedLeads.length} leads deleted`);
        setSelectedLeads([]);
        break;
      case 'mark_spam':
        toast.warning(`Lead marked as spam`);
        break;
      case 'merge':
        toast.success(`Duplicate leads merged`);
        break;
    }
    
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      contacted: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      qualified: 'bg-green-500/20 text-green-400 border-green-500/30',
      interested: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      proposal_sent: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      negotiation: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      won: 'bg-green-500/20 text-green-400 border-green-500/30',
      lost: 'bg-red-500/20 text-red-400 border-red-500/30',
      dormant: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || colors.new;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {pipelineStages.map(stage => (
                <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {leadSourcesConfig.map(source => (
                <SelectItem key={source.id} value={source.source}>{source.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {leadCategoriesConfig.map(cat => (
                <SelectItem key={cat.id} value={cat.category}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction('import')}>
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAction('export')}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={() => handleAction('create')}>
            <Plus className="w-4 h-4 mr-1" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg"
        >
          <span className="text-sm text-foreground">
            {selectedLeads.length} lead(s) selected
          </span>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={() => handleAction('bulk_assign')}>
            <UserPlus className="w-4 h-4 mr-1" />
            Assign
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAction('merge')}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Merge
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleAction('bulk_delete')}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </motion.div>
      )}

      {/* Leads Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/50 border-b border-border">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={selectedLeads.length === sampleLeads.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Lead</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Source</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">AI Score</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Location</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Activity</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-accent/30 transition-colors"
                  >
                    <td className="p-3">
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                          {lead.company && (
                            <p className="text-xs text-muted-foreground">{lead.company}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm text-foreground capitalize">{lead.source}</p>
                        <p className="text-xs text-muted-foreground">{lead.subSource}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm text-foreground capitalize">{lead.category.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{lead.subCategory}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <Badge className={getStatusBadge(lead.status)}>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityBadge(lead.priority)}>
                          {lead.priority}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className={`font-medium ${
                          lead.aiScore >= 80 ? 'text-green-500' :
                          lead.aiScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {lead.aiScore}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Risk: {lead.riskScore}%
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{lead.city}, {lead.country}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm text-foreground">{lead.lastActivity}</p>
                        <p className="text-xs text-muted-foreground">{lead.lastActivityTime}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('view', lead)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('edit', lead)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('assign', lead)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Assign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAction('mark_spam', lead)}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Mark as Spam
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction('delete', lead)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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
    </div>
  );
};

export default LMAllLeads;
