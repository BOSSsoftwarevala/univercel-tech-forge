import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Building2, 
  MapPin, 
  User, 
  Calendar,
  AlertTriangle,
  LayoutDashboard,
  AlertCircle,
  Settings,
  TrendingUp,
  DollarSign,
  Shield,
  Users,
  Package,
  MessageSquare,
  Brain,
  FileText,
  History,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FranchiseProfile, ModuleSection } from './types';

interface FranchiseSidebarProps {
  franchises: FranchiseProfile[];
  selectedFranchise: FranchiseProfile | null;
  onSelectFranchise: (franchise: FranchiseProfile) => void;
  activeSection: ModuleSection;
  onSectionChange: (section: ModuleSection) => void;
}

const moduleItems: { id: ModuleSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'issues', label: 'Issues & Complaints', icon: AlertCircle },
  { id: 'operations', label: 'Operations Tracking', icon: Settings },
  { id: 'performance', label: 'Performance Metrics', icon: TrendingUp },
  { id: 'financial', label: 'Financial Health', icon: DollarSign },
  { id: 'compliance', label: 'Compliance & Audits', icon: Shield },
  { id: 'staff', label: 'Staff & Training', icon: Users },
  { id: 'inventory', label: 'Inventory / Supply', icon: Package },
  { id: 'feedback', label: 'Customer Feedback', icon: MessageSquare },
  { id: 'ai_insights', label: 'AI Insights', icon: Brain },
  { id: 'documents', label: 'Documents & Evidence', icon: FileText },
  { id: 'history', label: 'History & Logs', icon: History },
];

export function FranchiseSidebar({
  franchises,
  selectedFranchise,
  onSelectFranchise,
  activeSection,
  onSectionChange
}: FranchiseSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFranchises = franchises.filter(f => 
    f.franchiseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'risk': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full">
      {/* Franchise Selector */}
      <div className="p-4 border-b border-border space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Franchise Control
        </h3>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>

        <Select 
          value={selectedFranchise?.id || ''} 
          onValueChange={(id) => {
            const franchise = franchises.find(f => f.id === id);
            if (franchise) onSelectFranchise(franchise);
          }}
        >
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Select Franchise" />
          </SelectTrigger>
          <SelectContent>
            {filteredFranchises.map(f => (
              <SelectItem key={f.id} value={f.id}>
                <span className="flex items-center gap-2">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    f.status === 'active' ? 'bg-emerald-500' :
                    f.status === 'risk' ? 'bg-amber-500' : 'bg-red-500'
                  )} />
                  {f.franchiseCode} - {f.businessName}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Franchise Profile Snapshot */}
      {selectedFranchise && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-border bg-muted/30"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-foreground">{selectedFranchise.franchiseCode}</h4>
              <p className="text-sm text-muted-foreground">{selectedFranchise.businessName}</p>
            </div>
            <Badge className={getStatusColor(selectedFranchise.status)}>
              {selectedFranchise.status.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{selectedFranchise.city}, {selectedFranchise.region}, {selectedFranchise.country}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{selectedFranchise.ownerName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Since {selectedFranchise.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn("h-3.5 w-3.5", getRiskColor(selectedFranchise.riskLevel))} />
              <span className={getRiskColor(selectedFranchise.riskLevel)}>
                Risk: {selectedFranchise.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Module Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Track Everything
          </h3>
          
          <nav className="space-y-1">
            {moduleItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.id === 'issues' && selectedFranchise && selectedFranchise.openIssues > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs px-1.5">
                    {selectedFranchise.openIssues}
                  </Badge>
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
