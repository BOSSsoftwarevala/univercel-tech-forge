import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  List, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Play,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const allPromises = [
  { id: 'PRM-001', title: 'Feature Delivery - CRM Module', category: 'Delivery', subCategory: 'Go-Live', owner: 'Dev Team A', receiver: 'Client ABC', deadline: '2024-01-20', priority: 'high', status: 'active' },
  { id: 'PRM-002', title: 'Price Lock - Enterprise Client', category: 'Sales', subCategory: 'Price Lock', owner: 'Sales Team', receiver: 'Enterprise Corp', deadline: '2024-01-18', priority: 'critical', status: 'delayed' },
  { id: 'PRM-003', title: 'Response Time - Ticket #4521', category: 'Support', subCategory: 'Response Time', owner: 'Support Lead', receiver: 'Customer XYZ', deadline: '2024-01-17', priority: 'medium', status: 'fulfilled' },
  { id: 'PRM-004', title: 'Refund Promise - Order #8812', category: 'Payment', subCategory: 'Refund Promise', owner: 'Finance Team', receiver: 'Customer DEF', deadline: '2024-01-19', priority: 'high', status: 'active' },
  { id: 'PRM-005', title: 'NDA Delivery - Partner XYZ', category: 'Legal', subCategory: 'NDA', owner: 'Legal Team', receiver: 'Partner XYZ', deadline: '2024-01-21', priority: 'medium', status: 'pending' },
  { id: 'PRM-006', title: 'SLA Commitment - Premium Plan', category: 'SLA', subCategory: 'Response Time', owner: 'Operations', receiver: 'Premium Client', deadline: '2024-01-22', priority: 'high', status: 'active' },
  { id: 'PRM-007', title: 'Demo Timeline - Prospect ABC', category: 'Sales', subCategory: 'Demo Timeline', owner: 'Sales Rep', receiver: 'Prospect ABC', deadline: '2024-01-16', priority: 'critical', status: 'broken' },
  { id: 'PRM-008', title: 'Update Release - v2.5', category: 'Delivery', subCategory: 'Update Release', owner: 'Dev Team B', receiver: 'All Clients', deadline: '2024-01-25', priority: 'medium', status: 'active' },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    active: { color: 'bg-blue-500/20 text-blue-400', label: 'Active' },
    pending: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Pending' },
    delayed: { color: 'bg-orange-500/20 text-orange-400', label: 'Delayed' },
    fulfilled: { color: 'bg-green-500/20 text-green-400', label: 'Fulfilled' },
    broken: { color: 'bg-red-500/20 text-red-400', label: 'Broken' },
  };
  return statusMap[status] || { color: 'bg-slate-500/20 text-slate-400', label: status };
};

const getPriorityBadge = (priority: string) => {
  const priorityMap: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-slate-500/20 text-slate-400',
  };
  return priorityMap[priority] || 'bg-slate-500/20 text-slate-400';
};

export default function PTAllPromises() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const logAction = (action: string, target: string) => {
    toast.success(`✓ ${action}`, {
      description: `${target} • ${new Date().toLocaleTimeString()}`,
    });
  };

  const filteredPromises = allPromises.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <List className="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">All Promises</h1>
            <p className="text-slate-400">Complete promise registry</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">RUNNING</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">AI ACTIVE</Badge>
          <Button variant="outline" size="sm" onClick={() => logAction('Export', 'All Promises')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search promises..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="broken">Broken</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="SLA">SLA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="text-slate-400">
              {filteredPromises.length} results
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Promise Table */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Promise Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Sub Category</th>
                  <th className="text-left py-3 px-4">Owner</th>
                  <th className="text-left py-3 px-4">Receiver</th>
                  <th className="text-left py-3 px-4">Deadline</th>
                  <th className="text-left py-3 px-4">Priority</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromises.map((promise) => {
                  const statusConfig = getStatusBadge(promise.status);
                  return (
                    <tr key={promise.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono text-sm text-slate-300">{promise.id}</td>
                      <td className="py-3 px-4 text-white">{promise.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-slate-300">{promise.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{promise.subCategory}</td>
                      <td className="py-3 px-4 text-slate-400">{promise.owner}</td>
                      <td className="py-3 px-4 text-slate-400">{promise.receiver}</td>
                      <td className="py-3 px-4 text-slate-400">{promise.deadline}</td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityBadge(promise.priority)}>{promise.priority}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View', promise.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Edit', promise.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-400" onClick={() => logAction('Fulfill', promise.id)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-yellow-400" onClick={() => logAction('Delay', promise.id)}>
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-orange-400" onClick={() => logAction('Escalate', promise.id)}>
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-400" onClick={() => logAction('Apply Fine', promise.id)}>
                            <DollarSign className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-400" onClick={() => logAction('Add Tip', promise.id)}>
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
