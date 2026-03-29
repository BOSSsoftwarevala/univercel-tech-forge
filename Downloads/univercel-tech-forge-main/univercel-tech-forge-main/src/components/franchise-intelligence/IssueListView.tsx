import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FranchiseIssue, IssueCategory, IssuePriority, IssueStatus } from './types';

interface IssueListViewProps {
  issues: FranchiseIssue[];
  selectedIssue: FranchiseIssue | null;
  onSelectIssue: (issue: FranchiseIssue) => void;
}

export function IssueListView({ issues, selectedIssue, onSelectIssue }: IssueListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high': return <AlertCircle className="h-4 w-4 text-orange-400" />;
      case 'medium': return <Clock className="h-4 w-4 text-amber-400" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400';
      case 'in_progress': return 'bg-amber-500/20 text-amber-400';
      case 'escalated': return 'bg-red-500/20 text-red-400';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operations': return 'border-blue-500/30';
      case 'finance': return 'border-emerald-500/30';
      case 'staff': return 'border-amber-500/30';
      case 'supply': return 'border-purple-500/30';
      case 'tech': return 'border-cyan-500/30';
      case 'compliance': return 'border-red-500/30';
      case 'customer': return 'border-pink-500/30';
      default: return 'border-border';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background/50 overflow-hidden">
      {/* Header & Filters */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Issues & Complaints</h2>
            <p className="text-sm text-muted-foreground">{filteredIssues.length} issues found</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as IssueCategory | 'all')}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="supply">Supply</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as IssuePriority | 'all')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as IssueStatus | 'all')}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issue List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No issues found matching your filters</p>
            </div>
          ) : (
            filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all hover:bg-muted/50 border-l-4",
                    getCategoryColor(issue.category),
                    selectedIssue?.id === issue.id && "ring-2 ring-primary bg-muted/30"
                  )}
                  onClick={() => onSelectIssue(issue)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getPriorityIcon(issue.priority)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{issue.id}</span>
                            <Badge className={getStatusColor(issue.status)} variant="outline">
                              {issue.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-foreground truncate">{issue.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>By: {issue.reportedBy}</span>
                            <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                            <Badge variant="outline" className="capitalize text-xs">
                              {issue.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
