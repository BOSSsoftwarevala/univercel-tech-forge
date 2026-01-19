/**
 * DEMO LIST SCREEN
 * View all demos with status and controls
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  List,
  Search,
  Filter,
  ExternalLink,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const DMEDemoListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const demos = [
    { id: 1, name: 'E-Commerce Pro', category: 'E-Commerce', subCategory: 'B2C Store', url: 'https://ecom-demo.softwarevala.com', status: 'active', health: 100, issues: 0 },
    { id: 2, name: 'Hospital Management', category: 'Healthcare', subCategory: 'Hospital', url: 'https://hospital-demo.softwarevala.com', status: 'active', health: 98, issues: 1 },
    { id: 3, name: 'School ERP', category: 'Education', subCategory: 'School', url: 'https://school-demo.softwarevala.com', status: 'under-work', health: 85, issues: 3 },
    { id: 4, name: 'Sales CRM', category: 'CRM', subCategory: 'Sales CRM', url: 'https://crm-demo.softwarevala.com', status: 'active', health: 100, issues: 0 },
    { id: 5, name: 'Fleet Manager', category: 'Logistics', subCategory: 'Fleet Management', url: 'https://fleet-demo.softwarevala.com', status: 'active', health: 95, issues: 2 },
    { id: 6, name: 'Property Portal', category: 'Real Estate', subCategory: 'Listing Portal', url: 'https://property-demo.softwarevala.com', status: 'under-work', health: 70, issues: 5 },
  ];

  const filteredDemos = demos.filter(demo =>
    demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demo.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'under-work': return 'bg-neon-orange/20 text-neon-orange border-neon-orange/30';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-neon-green';
    if (health >= 80) return 'text-neon-orange';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <List className="w-5 h-5 text-primary" />
            </div>
            Demo List
          </h1>
          <p className="text-muted-foreground text-sm mt-1">All running software demos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search demos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-background border-border"
            />
          </div>
          <Button variant="outline" className="border-border">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
          <p className="text-xs text-muted-foreground mb-1">Active Demos</p>
          <p className="text-2xl font-bold text-neon-green">{demos.filter(d => d.status === 'active').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/30">
          <p className="text-xs text-muted-foreground mb-1">Under Work</p>
          <p className="text-2xl font-bold text-neon-orange">{demos.filter(d => d.status === 'under-work').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-neon-teal/10 border border-neon-teal/30">
          <p className="text-xs text-muted-foreground mb-1">Avg Health</p>
          <p className="text-2xl font-bold text-neon-teal">{Math.round(demos.reduce((a, b) => a + b.health, 0) / demos.length)}%</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-xs text-muted-foreground mb-1">Total Issues</p>
          <p className="text-2xl font-bold text-red-400">{demos.reduce((a, b) => a + b.issues, 0)}</p>
        </div>
      </div>

      {/* Demo List */}
      <div className="space-y-3">
        {filteredDemos.map((demo, index) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  demo.status === 'active' ? 'bg-neon-green/10' : 'bg-neon-orange/10'
                }`}>
                  {demo.status === 'active' ? (
                    <CheckCircle className="w-6 h-6 text-neon-green" />
                  ) : (
                    <Clock className="w-6 h-6 text-neon-orange" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{demo.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {demo.category} → {demo.subCategory}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className={`text-lg font-bold font-mono ${getHealthColor(demo.health)}`}>{demo.health}%</p>
                  <p className="text-xs text-muted-foreground">Health</p>
                </div>
                
                {demo.issues > 0 && (
                  <div className="flex items-center gap-1 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{demo.issues}</span>
                  </div>
                )}

                <Badge className={getStatusColor(demo.status)}>
                  {demo.status === 'active' ? 'ACTIVE' : 'UNDER WORK'}
                </Badge>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border h-8"
                    onClick={() => window.open(demo.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Demo
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
