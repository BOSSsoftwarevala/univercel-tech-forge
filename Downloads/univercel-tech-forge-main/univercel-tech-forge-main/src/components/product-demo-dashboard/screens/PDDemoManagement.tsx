/**
 * PD DEMO MANAGEMENT
 * Manage all product demos
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Edit, 
  Eye, 
  Plus, 
  Search, 
  Monitor, 
  Smartphone, 
  MessageCircle,
  Video,
  Zap,
  Users
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Demo {
  id: string;
  name: string;
  product: string;
  type: 'live' | 'recorded' | 'interactive';
  status: 'draft' | 'live' | 'expired';
  channel: 'web' | 'android' | 'whatsapp';
  manager: string;
  views: number;
  languages: number;
}

const demos: Demo[] = [
  { id: '1', name: 'Enterprise CRM Tour', product: 'CRM Suite', type: 'interactive', status: 'live', channel: 'web', manager: 'Sarah K.', views: 1234, languages: 5 },
  { id: '2', name: 'Mobile App Walkthrough', product: 'Mobile SDK', type: 'recorded', status: 'live', channel: 'android', manager: 'Mike P.', views: 856, languages: 3 },
  { id: '3', name: 'API Integration Guide', product: 'Developer Tools', type: 'live', status: 'draft', channel: 'web', manager: 'Anna L.', views: 0, languages: 2 },
  { id: '4', name: 'WhatsApp Bot Demo', product: 'Chatbot Platform', type: 'interactive', status: 'live', channel: 'whatsapp', manager: 'David R.', views: 2341, languages: 8 },
  { id: '5', name: 'Analytics Dashboard', product: 'BI Suite', type: 'recorded', status: 'expired', channel: 'web', manager: 'Lisa M.', views: 567, languages: 4 },
  { id: '6', name: 'Payment Gateway Setup', product: 'Payment SDK', type: 'live', status: 'live', channel: 'web', manager: 'John D.', views: 1089, languages: 6 },
];

const getTypeIcon = (type: Demo['type']) => {
  switch (type) {
    case 'live': return <Video className="w-4 h-4" />;
    case 'recorded': return <Play className="w-4 h-4" />;
    case 'interactive': return <Zap className="w-4 h-4" />;
  }
};

const getChannelIcon = (channel: Demo['channel']) => {
  switch (channel) {
    case 'web': return <Monitor className="w-4 h-4" />;
    case 'android': return <Smartphone className="w-4 h-4" />;
    case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: Demo['status']) => {
  switch (status) {
    case 'live': return 'bg-green-100 text-green-700';
    case 'draft': return 'bg-amber-100 text-amber-700';
    case 'expired': return 'bg-slate-100 text-slate-600';
  }
};

export const PDDemoManagement: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDemos = demos.filter(demo => {
    const matchesFilter = filter === 'all' || demo.status === filter;
    const matchesSearch = demo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demo.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (demo: Demo) => {
    toast({
      title: "Edit Demo",
      description: `Opening editor for "${demo.name}"...`,
    });
  };

  const handlePreview = (demo: Demo) => {
    toast({
      title: "Preview Demo",
      description: `Launching preview for "${demo.name}"...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Demo Management</h1>
          <p className="text-slate-500 mt-1">Create and manage your product demos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Demo
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{demos.filter(d => d.status === 'live').length}</p>
              <p className="text-xs text-slate-500">Live Demos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Pause className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{demos.filter(d => d.status === 'draft').length}</p>
              <p className="text-xs text-slate-500">Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{demos.reduce((acc, d) => acc + d.views, 0).toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total Views</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">5</p>
              <p className="text-xs text-slate-500">Demo Managers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search demos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Demo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemos.map((demo) => (
          <Card key={demo.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    {getTypeIcon(demo.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-800">{demo.name}</CardTitle>
                    <p className="text-xs text-slate-500">{demo.product}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(demo.status)} border-0 capitalize`}>
                  {demo.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Demo Info */}
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    {getChannelIcon(demo.channel)}
                    <span className="capitalize">{demo.channel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{demo.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                      {demo.languages} langs
                    </span>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Type:</span>
                  <Badge variant="outline" className="capitalize text-xs">
                    {demo.type}
                  </Badge>
                </div>

                {/* Manager */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{demo.manager.charAt(0)}</span>
                  </div>
                  <span className="text-sm text-slate-600">{demo.manager}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(demo)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handlePreview(demo)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
