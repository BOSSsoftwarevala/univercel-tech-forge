/**
 * DEMO ISSUES SCREEN
 * Report and track demo issues with AI fix suggestions
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bug,
  AlertTriangle,
  Plus,
  Bot,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const DMEDemoIssuesScreen: React.FC = () => {
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: '', demo: '', description: '' });

  const issues = [
    { 
      id: 1, 
      demo: 'E-Commerce Pro', 
      title: 'Cart total not updating correctly', 
      status: 'open', 
      severity: 'high',
      aiSuggestion: 'Fix discount calculation in CartService.calculateTotal() method',
      createdAt: '2 hours ago'
    },
    { 
      id: 2, 
      demo: 'Hospital Management', 
      title: 'Patient search returns empty', 
      status: 'ai-fixing', 
      severity: 'medium',
      aiSuggestion: 'Index optimization needed on patients table',
      createdAt: '5 hours ago'
    },
    { 
      id: 3, 
      demo: 'School ERP', 
      title: 'Login page not loading on mobile', 
      status: 'resolved', 
      severity: 'high',
      aiSuggestion: 'Applied responsive fix to LoginForm component',
      createdAt: '1 day ago'
    },
    { 
      id: 4, 
      demo: 'Sales CRM', 
      title: 'Dashboard charts not rendering', 
      status: 'open', 
      severity: 'low',
      aiSuggestion: 'Update Chart.js dependency to version 4.x',
      createdAt: '3 hours ago'
    },
  ];

  const demos = ['E-Commerce Pro', 'Hospital Management', 'School ERP', 'Sales CRM', 'Fleet Manager'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ai-fixing': return 'bg-neon-teal/20 text-neon-teal border-neon-teal/30';
      case 'resolved': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-neon-green';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4" />;
      case 'ai-fixing': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Bug className="w-5 h-5 text-red-400" />
            </div>
            Demo Issues
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Report & track issues with AI assistance</p>
        </div>
        <Button
          onClick={() => setShowNewIssue(true)}
          className="bg-neon-teal/20 text-neon-teal hover:bg-neon-teal/30 border border-neon-teal/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Report Issue
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-xs text-muted-foreground mb-1">Open Issues</p>
          <p className="text-2xl font-bold text-red-400">{issues.filter(i => i.status === 'open').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-neon-teal/10 border border-neon-teal/30">
          <p className="text-xs text-muted-foreground mb-1">AI Fixing</p>
          <p className="text-2xl font-bold text-neon-teal">{issues.filter(i => i.status === 'ai-fixing').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
          <p className="text-xs text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-bold text-neon-green">{issues.filter(i => i.status === 'resolved').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs text-muted-foreground mb-1">High Severity</p>
          <p className="text-2xl font-bold text-amber-400">{issues.filter(i => i.severity === 'high').length}</p>
        </div>
      </div>

      {/* New Issue Form */}
      {showNewIssue && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-card border border-neon-teal/30"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Report New Issue</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Select
                value={newIssue.demo}
                onValueChange={(val) => setNewIssue({ ...newIssue, demo: val })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select demo" />
                </SelectTrigger>
                <SelectContent>
                  {demos.map(demo => (
                    <SelectItem key={demo} value={demo}>{demo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Issue title"
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                className="bg-background border-border"
              />
            </div>
          </div>
          <Textarea
            placeholder="Describe the issue in detail..."
            value={newIssue.description}
            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
            className="min-h-[100px] bg-background border-border resize-none mb-4"
          />
          <div className="flex items-center gap-2">
            <Button className="bg-neon-teal/20 text-neon-teal hover:bg-neon-teal/30 border border-neon-teal/30">
              Submit Issue
            </Button>
            <Button variant="outline" onClick={() => setShowNewIssue(false)} className="border-border">
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Issues List */}
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(issue.status)}`}>
                  {getStatusIcon(issue.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{issue.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">{issue.demo}</span>
                    <span className={`text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                      {issue.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">{issue.createdAt}</span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(issue.status)}>
                {issue.status === 'ai-fixing' ? 'AI FIXING' : issue.status.toUpperCase()}
              </Badge>
            </div>

            {/* AI Suggestion */}
            <div className="p-3 rounded-lg bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-3">
              <Bot className="w-5 h-5 text-neon-teal mt-0.5" />
              <div>
                <p className="text-xs text-neon-teal font-medium mb-1">Vala AI Suggestion</p>
                <p className="text-sm text-foreground">{issue.aiSuggestion}</p>
              </div>
            </div>

            {/* Actions */}
            {issue.status !== 'resolved' && (
              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Apply Fix
                </Button>
                <Button size="sm" variant="outline" className="border-border">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
