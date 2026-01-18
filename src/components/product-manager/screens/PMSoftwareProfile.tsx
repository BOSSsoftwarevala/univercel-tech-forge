import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  FileText, Save, Edit3, Eye, History, Lock, Unlock, Package,
  GitBranch, Cpu, Users, Globe2, Calendar, CheckCircle2
} from 'lucide-react';

const mockSoftware = {
  id: 'SW-001',
  name: 'Enterprise ERP Suite',
  version: 'v3.2.1',
  status: 'active',
  description: 'Complete enterprise resource planning solution with modules for finance, HR, inventory, and more.',
  modules: ['Finance', 'HR', 'Inventory', 'CRM', 'Analytics', 'Reports'],
  ownership: 'Software Vala',
  createdAt: '2023-01-15',
  updatedAt: '2024-01-15',
  deployedTo: 45,
  activeUsers: 1250,
};

const PMSoftwareProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [software, setSoftware] = useState(mockSoftware);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Software profile saved', {
      description: software.name
    });
  };

  const handleAction = (action: string) => {
    toast.success(`${action} action triggered`, {
      description: software.name
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{software.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {software.status}
              </Badge>
              <Badge variant="outline">{software.version}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="gap-2" onClick={() => handleAction('View')}>
                <Eye className="w-4 h-4" /> View
              </Button>
              <Button className="gap-2" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4" /> Edit
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" /> Software Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Software Name</label>
                  {isEditing ? (
                    <Input 
                      value={software.name}
                      onChange={(e) => setSoftware({...software, name: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{software.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Version</label>
                  {isEditing ? (
                    <Input 
                      value={software.version}
                      onChange={(e) => setSoftware({...software, version: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{software.version}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Description</label>
                {isEditing ? (
                  <Textarea 
                    value={software.description}
                    onChange={(e) => setSoftware({...software, description: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{software.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Status</label>
                  {isEditing ? (
                    <Select value={software.status} onValueChange={(v) => setSoftware({...software, status: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="development">In Development</SelectItem>
                        <SelectItem value="locked">Locked</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{software.status}</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Ownership</label>
                  <p className="font-medium">{software.ownership}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Mapping */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Module Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {software.modules.map((module) => (
                  <Badge key={module} variant="secondary" className="px-3 py-1">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                    {module}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Deployments</span>
                </div>
                <span className="font-bold">{software.deployedTo}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Active Users</span>
                </div>
                <span className="font-bold">{software.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">Modules</span>
                </div>
                <span className="font-bold">{software.modules.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{software.createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span>{software.updatedAt}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('Version Control')}>
                <GitBranch className="w-4 h-4" /> Version Control
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('Lock')}>
                <Lock className="w-4 h-4" /> Lock Software
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('History')}>
                <History className="w-4 h-4" /> View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PMSoftwareProfile;
