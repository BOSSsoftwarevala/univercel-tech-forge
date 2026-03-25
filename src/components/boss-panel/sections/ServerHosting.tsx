import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Globe,
  Rocket,
  Shield,
  Activity,
  Cloud,
  Cpu,
  HardDrive,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Plus,
  ExternalLink,
  RefreshCw,
  Settings,
  Trash2,
  MoreVertical,
  ArrowUpRight,
  Link,
  Lock,
  Unlock,
  BarChart3,
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Eye,
  Upload,
  Terminal,
  Layers,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useHostingManager } from '@/hooks/useHostingManager';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  domain: string;
  status: 'live' | 'building' | 'stopped' | 'error';
  lastDeployed: Date;
  branch: string;
  ssl: boolean;
  instance: 'free' | 'small' | 'medium' | 'large';
  visits: number;
}

interface Deployment {
  id: string;
  projectId: string;
  status: 'success' | 'failed' | 'building';
  createdAt: Date;
  duration: string;
  commit: string;
  branch: string;
}

export function ServerHosting() {
  const [activeTab, setActiveTab] = useState('projects');
  const [newDomain, setNewDomain] = useState('');
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [selectedInstance, setSelectedInstance] = useState('medium');
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>([]);
  
  const { isLoading, deploy, checkDomain, verifyDns, getAnalytics, scaleInstance, getDeploymentStatus } = useHostingManager();

  const [projects] = useState<Project[]>([
    { id: '1', name: 'E-Commerce Platform', domain: 'shop.codelab.app', status: 'live', lastDeployed: new Date(Date.now() - 3600000), branch: 'main', ssl: true, instance: 'medium', visits: 12450 },
    { id: '2', name: 'CRM Dashboard', domain: 'crm.codelab.app', status: 'live', lastDeployed: new Date(Date.now() - 86400000), branch: 'main', ssl: true, instance: 'small', visits: 5230 },
    { id: '3', name: 'Analytics Portal', domain: 'analytics.codelab.app', status: 'building', lastDeployed: new Date(), branch: 'develop', ssl: true, instance: 'large', visits: 28900 },
    { id: '4', name: 'Mobile API', domain: 'api.codelab.app', status: 'live', lastDeployed: new Date(Date.now() - 7200000), branch: 'main', ssl: true, instance: 'medium', visits: 156000 },
    { id: '5', name: 'Demo Showcase', domain: 'demo.codelab.app', status: 'stopped', lastDeployed: new Date(Date.now() - 172800000), branch: 'main', ssl: false, instance: 'free', visits: 890 },
  ]);

  const [deployments] = useState<Deployment[]>([
    { id: 'd1', projectId: '1', status: 'success', createdAt: new Date(Date.now() - 3600000), duration: '1m 23s', commit: 'a1b2c3d', branch: 'main' },
    { id: 'd2', projectId: '3', status: 'building', createdAt: new Date(), duration: '--', commit: 'e4f5g6h', branch: 'develop' },
    { id: 'd3', projectId: '2', status: 'success', createdAt: new Date(Date.now() - 86400000), duration: '2m 05s', commit: 'i7j8k9l', branch: 'main' },
    { id: 'd4', projectId: '1', status: 'failed', createdAt: new Date(Date.now() - 172800000), duration: '45s', commit: 'm0n1o2p', branch: 'feature/auth' },
    { id: 'd5', projectId: '4', status: 'success', createdAt: new Date(Date.now() - 7200000), duration: '1m 45s', commit: 'q3r4s5t', branch: 'main' },
  ]);

  const handleDeploy = async (project: Project) => {
    setSelectedProject(project);
    setShowDeployDialog(true);
    setDeployLogs(['🚀 Starting deployment for ' + project.name + '...']);
    
    const result = await deploy(project.name, { domain: project.domain, branch: project.branch });
    
    if (result) {
      const deploymentResult = await getDeploymentStatus(result.deployment.id, project.domain);
      if (deploymentResult?.logs) {
        setDeployLogs(prev => [...prev, ...deploymentResult.logs.map((log: any) => log.message)]);
      }
    }
  };

  const handleCheckDomain = async () => {
    if (!newDomain) return;
    const result = await checkDomain(newDomain);
    if (result?.available) {
      if (result.available) {
        toast.success(`Domain ${newDomain} is available and verified`);
      } else {
        toast.error(`Domain ${newDomain} is not available: ${result.message}`);
      }
    } else {
      toast.error(`Failed to check domain: ${result?.message || 'Unknown error'}`);
    }
  };

  const handleScaleInstance = async (size: string) => {
    setSelectedInstance(size);
    const result = await scaleInstance('medium', size);
    if (result) {
      toast.success(`Instance scaled to ${size.toUpperCase()}`);
    }
  };

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const handleSaveEnvVars = () => {
    toast.success('Environment variables saved!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': case 'success': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'building': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'stopped': return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
      case 'error': case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': case 'success': return <CheckCircle className="w-3 h-3" />;
      case 'building': return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'stopped': return <Pause className="w-3 h-3" />;
      case 'error': case 'failed': return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen -m-6 p-6 bg-gradient-to-br from-[#0a0a12] via-[#0d1117] to-[#0a0f16]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="space-y-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <Server className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d1117] flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 flex items-center gap-3">
                CodeLab Cloud
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-normal">
                  <Cloud className="w-3 h-3 mr-1" />
                  Hosting Platform
                </Badge>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Deploy & Host Your Apps • Custom Domains • Auto SSL</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">All Systems Operational</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20"
              onClick={() => toast.info('New project wizard coming soon!')}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-5 gap-4"
        >
          {[
            { label: 'Active Projects', value: projects.filter(p => p.status === 'live').length.toString(), icon: Rocket, gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Total Deployments', value: '847', icon: Upload, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Custom Domains', value: '12', icon: Globe, gradient: 'from-purple-500 to-fuchsia-500' },
            { label: 'SSL Certificates', value: '12', icon: Shield, gradient: 'from-amber-500 to-orange-500' },
            { label: 'Total Visits', value: '203K', icon: BarChart3, gradient: 'from-pink-500 to-rose-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm hover:border-slate-700/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1">
            <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-400">
              <Layers className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="deployments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-400">
              <Rocket className="w-4 h-4 mr-2" />
              Deployments
            </TabsTrigger>
            <TabsTrigger value="domains" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-400">
              <Globe className="w-4 h-4 mr-2" />
              Domains
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-400">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        project.status === 'live' ? 'bg-emerald-500/20' : 
                        project.status === 'building' ? 'bg-amber-500/20' : 'bg-slate-500/20'
                      )}>
                        <Server className={cn(
                          "w-6 h-6",
                          project.status === 'live' ? 'text-emerald-400' :
                          project.status === 'building' ? 'text-amber-400' : 'text-slate-400'
                        )} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          {project.name}
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1">{project.status}</span>
                          </Badge>
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {project.domain}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {project.branch}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {project.ssl ? <Lock className="w-3 h-3 text-emerald-400" /> : <Unlock className="w-3 h-3 text-amber-400" />}
                            {project.ssl ? 'SSL Active' : 'No SSL'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-medium">{project.visits.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">visits</p>
                      </div>
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700">
                        <Cpu className="w-3 h-3 mr-1" />
                        {project.instance}
                      </Badge>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white"
                          onClick={() => window.open(`https://${project.domain}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                          onClick={() => handleDeploy(project)}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4 mr-1" />}
                          Deploy
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Deployments Tab */}
          <TabsContent value="deployments" className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/50">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Recent Deployments
              </h3>
              <div className="space-y-3">
                {deployments.map((deployment, i) => {
                  const project = projects.find(p => p.id === deployment.projectId);
                  return (
                    <motion.div
                      key={deployment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(deployment.status)}>
                          {getStatusIcon(deployment.status)}
                          <span className="ml-1">{deployment.status}</span>
                        </Badge>
                        <div>
                          <p className="text-white font-medium">{project?.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono bg-slate-700/50 px-1.5 py-0.5 rounded">{deployment.commit}</span>
                            <span>on</span>
                            <span className="text-emerald-400">{deployment.branch}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{deployment.duration}</span>
                        <span>{deployment.createdAt.toLocaleString()}</span>
                        {deployment.status === 'success' && (
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Link className="w-5 h-5 text-emerald-400" />
                  Add Custom Domain
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="yourdomain.com"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                    <Button
                      onClick={handleCheckDomain}
                      disabled={isLoading || !newDomain}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
                    </Button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <p className="text-slate-400 text-sm mb-2">Point your domain to:</p>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900/50">
                        <span className="text-emerald-400">A Record</span>
                        <span className="text-white">185.199.108.153</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                          navigator.clipboard.writeText('185.199.108.153');
                          toast.success('Copied!');
                        }}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900/50">
                        <span className="text-emerald-400">CNAME (www)</span>
                        <span className="text-white">codelab.app</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                          navigator.clipboard.writeText('codelab.app');
                          toast.success('Copied!');
                        }}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Connected Domains
                </h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {projects.filter(p => p.status === 'live').map(project => (
                      <div key={project.id} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {project.ssl ? (
                            <Lock className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Unlock className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="text-white">{project.domain}</span>
                        </div>
                        <Badge className={project.ssl ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                          {project.ssl ? 'SSL Active' : 'No SSL'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Traffic Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Requests</span>
                    <span className="text-white font-bold">2.4M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bandwidth</span>
                    <span className="text-white font-bold">128 GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Unique Visitors</span>
                    <span className="text-white font-bold">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Response</span>
                    <span className="text-emerald-400 font-bold">42ms</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  Top Regions
                </h3>
                <div className="space-y-3">
                  {[
                    { region: 'United States', percent: 45 },
                    { region: 'Europe', percent: 28 },
                    { region: 'Asia Pacific', percent: 18 },
                    { region: 'Other', percent: 9 },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{item.region}</span>
                        <span className="text-white">{item.percent}%</span>
                      </div>
                      <Progress value={item.percent} className="h-1.5 bg-slate-800" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  Resource Usage
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">CPU</span>
                      <span className="text-white">23%</span>
                    </div>
                    <Progress value={23} className="h-2 bg-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Memory</span>
                      <span className="text-white">58%</span>
                    </div>
                    <Progress value={58} className="h-2 bg-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Storage</span>
                      <span className="text-white">34%</span>
                    </div>
                    <Progress value={34} className="h-2 bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                  Instance Scaling
                </h3>
                <div className="space-y-4">
                  <Select value={selectedInstance} onValueChange={handleScaleInstance}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select instance size" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="free" className="text-white">Free - 1 vCPU, 512MB RAM</SelectItem>
                      <SelectItem value="small" className="text-white">Small - 1 vCPU, 2GB RAM - $9/mo</SelectItem>
                      <SelectItem value="medium" className="text-white">Medium - 2 vCPU, 4GB RAM - $19/mo</SelectItem>
                      <SelectItem value="large" className="text-white">Large - 4 vCPU, 8GB RAM - $49/mo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                    onClick={() => handleScaleInstance(selectedInstance)}
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  Environment Variables
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input placeholder="KEY" className="bg-slate-800/50 border-slate-700 text-white font-mono" />
                    <Input placeholder="value" type="password" className="bg-slate-800/50 border-slate-700 text-white" />
                    <Button 
                      variant="outline" 
                      className="border-slate-700 text-slate-400 hover:bg-slate-800"
                      onClick={handleAddEnvVar}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                    onClick={handleSaveEnvVars}
                  >
                    Save Environment Variables
                  </Button>
                  <div className="text-xs text-slate-500">
                    Environment variables are encrypted and available during build and runtime.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Deploy Dialog */}
      <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-emerald-400" />
              Deploying {selectedProject?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Deploying to {selectedProject?.domain}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-sm max-h-64 overflow-y-auto">
            {deployLogs.map((log, i) => (
              <div key={i} className="text-slate-300 py-0.5">{log}</div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-emerald-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
