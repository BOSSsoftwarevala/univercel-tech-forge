/**
 * DEMO LIBRARY SCREEN
 * Master Software List with Card/List View
 * Actions: Open, Health Check, Fix via AI, Lock/Unlock, Archive
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  ExternalLink,
  HeartPulse,
  Bot,
  Lock,
  Unlock,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface SoftwareItem {
  id: string;
  name: string;
  industry: string;
  category: string;
  subCategory: string;
  microCategory: string;
  status: 'healthy' | 'warning' | 'broken' | 'critical';
  demoUrl: string;
  lastAIScan: string;
  riskFlag: boolean;
  isLocked: boolean;
}

const mockSoftware: SoftwareItem[] = [
  { id: '1', name: 'SchoolERP Pro', industry: 'Education', category: 'ERP', subCategory: 'School', microCategory: 'Admin Panel', status: 'healthy', demoUrl: 'demo.schoolerp.com', lastAIScan: '2 hours ago', riskFlag: false, isLocked: false },
  { id: '2', name: 'HospitalCRM', industry: 'Healthcare', category: 'CRM', subCategory: 'Hospital', microCategory: 'Doctor Panel', status: 'warning', demoUrl: 'demo.hospitalcrm.com', lastAIScan: '5 hours ago', riskFlag: true, isLocked: false },
  { id: '3', name: 'RetailPOS Master', industry: 'Retail', category: 'POS', subCategory: 'Retail', microCategory: 'Billing Panel', status: 'broken', demoUrl: 'demo.retailpos.com', lastAIScan: '1 day ago', riskFlag: true, isLocked: true },
  { id: '4', name: 'BuilderCRM Elite', industry: 'Real Estate', category: 'CRM', subCategory: 'Builder', microCategory: 'Sales Panel', status: 'healthy', demoUrl: 'demo.buildercrm.com', lastAIScan: '3 hours ago', riskFlag: false, isLocked: false },
  { id: '5', name: 'LogisticsERP', industry: 'Logistics', category: 'ERP', subCategory: 'Transport', microCategory: 'Fleet Panel', status: 'healthy', demoUrl: 'demo.logisticserp.com', lastAIScan: '1 hour ago', riskFlag: false, isLocked: false },
  { id: '6', name: 'FinanceHRM', industry: 'Finance', category: 'HRM', subCategory: 'Banking', microCategory: 'Employee Panel', status: 'critical', demoUrl: 'demo.financehrm.com', lastAIScan: '2 days ago', riskFlag: true, isLocked: true },
];

export const DMELibraryScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [software, setSoftware] = useState(mockSoftware);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'warning': return 'bg-neon-orange/20 text-neon-orange border-neon-orange/30';
      case 'broken': return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'critical': return 'bg-red-600/20 text-red-500 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAction = (id: string, action: string) => {
    toast.success(`${action} triggered for software ID: ${id}`);
  };

  const toggleLock = (id: string) => {
    setSoftware(prev => prev.map(s => 
      s.id === id ? { ...s, isLocked: !s.isLocked } : s
    ));
    toast.success('Lock status updated');
  };

  const filteredSoftware = software.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Library</h1>
          <p className="text-muted-foreground text-sm">Master software catalog • {software.length} demos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search software by name, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Software Grid/List */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSoftware.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.industry} • {item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.riskFlag && <AlertTriangle className="w-4 h-4 text-neon-orange" />}
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Sub Category:</span>
                      <span className="text-foreground">{item.subCategory}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Micro Category:</span>
                      <span className="text-foreground">{item.microCategory}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Demo URL:</span>
                      <span className="text-primary">{item.demoUrl}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last AI Scan:</span>
                      <span className="text-foreground">{item.lastAIScan}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-5 gap-1 pt-3 border-t border-border/30">
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleAction(item.id, 'Open')}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleAction(item.id, 'Health')}>
                      <HeartPulse className="w-3.5 h-3.5 text-neon-green" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleAction(item.id, 'AI Fix')}>
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleLock(item.id)}>
                      {item.isLocked ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Unlock className="w-3.5 h-3.5 text-neon-teal" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleAction(item.id, 'Archive')}>
                      <Archive className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/30">
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left p-4">Software Name</th>
                    <th className="text-left p-4">Industry</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Last Scan</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSoftware.map((item) => (
                    <tr key={item.id} className="border-b border-border/20 hover:bg-secondary/20">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {item.riskFlag && <AlertTriangle className="w-4 h-4 text-neon-orange" />}
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{item.industry}</td>
                      <td className="p-4 text-sm text-muted-foreground">{item.category}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{item.lastAIScan}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Bot className="w-3.5 h-3.5 text-primary" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleLock(item.id)}>
                            {item.isLocked ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Unlock className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
