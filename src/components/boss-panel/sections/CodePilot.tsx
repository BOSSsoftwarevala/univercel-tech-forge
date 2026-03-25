import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Sparkles, 
  Send, 
  Bug, 
  Wrench, 
  FileCode, 
  GitBranch, 
  Terminal,
  Play,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MessageSquare,
  Bot,
  Zap,
  Eye,
  History,
  Upload,
  Cpu,
  Layers,
  Braces,
  Database,
  Globe,
  Shield,
  Rocket,
  Settings,
  RefreshCw,
  PlusCircle,
  FolderOpen,
  Save,
  Download,
  Monitor,
  Smartphone,
  Tablet,
  ChevronRight,
  Circle,
  Copy,
  ExternalLink,
  MoreVertical,
  Trash2,
  Edit3,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  Activity,
  TrendingUp,
  TestTube,
  CloudCog,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCodePilotAI } from '@/hooks/useCodePilotAI';
import { toast } from 'sonner';

interface CodeSession {
  id: string;
  type: 'demo' | 'fix' | 'enhancement' | 'new-project';
  title: string;
  status: 'active' | 'completed' | 'pending' | 'building';
  timestamp: Date;
  progress?: number;
  preview?: string;
}

interface IssueReport {
  id: string;
  source: 'chatbot' | 'manual' | 'auto-detect';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'fixing' | 'fixed' | 'verified';
  reportedAt: Date;
  fixedAt?: Date;
  autoFixEligible?: boolean;
}

interface DemoProject {
  id: string;
  name: string;
  client: string;
  status: 'draft' | 'building' | 'ready' | 'deployed';
  createdAt: Date;
  lastUpdated: Date;
  preview?: string;
}

type ActionType = 'generate' | 'review' | 'optimize' | 'test' | 'devops' | 'fix';

export function CodePilot() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workspace');
  const [prompt, setPrompt] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [codeOutput, setCodeOutput] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionType>('generate');
  const [codeToReview, setCodeToReview] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { isLoading, generateCode, fixIssue, reviewCode, optimizeCode, generateTests, devOpsTask, chat } = useCodePilotAI();
  
  const [sessions] = useState<CodeSession[]>([
    { id: '1', type: 'demo', title: 'E-Commerce Dashboard Demo', status: 'building', timestamp: new Date(), progress: 67 },
    { id: '2', type: 'fix', title: 'Authentication Flow Fix', status: 'completed', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', type: 'new-project', title: 'CRM System Build', status: 'active', timestamp: new Date(Date.now() - 7200000), progress: 23 },
    { id: '4', type: 'enhancement', title: 'Analytics Module Upgrade', status: 'pending', timestamp: new Date(Date.now() - 86400000) },
  ]);
  
  const [issues] = useState<IssueReport[]>([
    { id: '1', source: 'chatbot', description: 'Mobile navigation menu not closing after selection', severity: 'high', status: 'fixing', reportedAt: new Date(Date.now() - 1800000), autoFixEligible: true },
    { id: '2', source: 'auto-detect', description: 'Memory optimization needed in chart rendering', severity: 'critical', status: 'pending', reportedAt: new Date(Date.now() - 900000), autoFixEligible: false },
    { id: '3', source: 'chatbot', description: 'Button hover state not working on Safari', severity: 'medium', status: 'pending', reportedAt: new Date(Date.now() - 2700000), autoFixEligible: true },
    { id: '4', source: 'manual', description: 'Improve table loading performance', severity: 'medium', status: 'fixed', reportedAt: new Date(Date.now() - 86400000), fixedAt: new Date(Date.now() - 3600000), autoFixEligible: true },
    { id: '5', source: 'auto-detect', description: 'Form validation error message overlap', severity: 'low', status: 'fixed', reportedAt: new Date(Date.now() - 172800000), fixedAt: new Date(Date.now() - 86400000), autoFixEligible: true },
  ]);

  const [demoProjects] = useState<DemoProject[]>([
    { id: '1', name: 'Healthcare Portal', client: 'MedCorp Inc', status: 'ready', createdAt: new Date(Date.now() - 86400000 * 3), lastUpdated: new Date(Date.now() - 3600000) },
    { id: '2', name: 'Real Estate Platform', client: 'PropMax', status: 'building', createdAt: new Date(Date.now() - 86400000 * 2), lastUpdated: new Date() },
    { id: '3', name: 'Logistics Dashboard', client: 'FastShip', status: 'deployed', createdAt: new Date(Date.now() - 86400000 * 7), lastUpdated: new Date(Date.now() - 86400000) },
    { id: '4', name: 'Restaurant POS', client: 'FoodChain Group', status: 'draft', createdAt: new Date(Date.now() - 86400000), lastUpdated: new Date(Date.now() - 7200000) },
  ]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setCodeOutput('');
    
    let result: string | null = null;
    
    switch (selectedAction) {
      case 'generate':
        result = await generateCode(prompt);
        break;
      case 'review':
        result = await reviewCode(codeToReview || prompt);
        break;
      case 'optimize':
        result = await optimizeCode(codeToReview || prompt);
        break;
      case 'test':
        result = await generateTests(codeToReview || prompt);
        break;
      case 'devops':
        result = await devOpsTask(prompt);
        break;
      case 'fix':
        result = await fixIssue(prompt);
        break;
      default:
        result = await generateCode(prompt);
    }
    
    if (result) {
      setCodeOutput(result);
      toast.success('Code generated successfully!');
    }
  };

  const handleAutoFix = async (issue: IssueReport) => {
    const result = await fixIssue(issue.description);
    if (result) {
      setCodeOutput(result);
      setActiveTab('workspace');
      toast.success(`Auto-fix generated for: ${issue.description}`);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      default: return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fixing': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'fixed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'verified': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'building': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'ready': return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'deployed': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'draft': return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
      default: return 'bg-white/20 text-white/60 border-white/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixing': return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'fixed': return <CheckCircle className="w-3 h-3" />;
      case 'verified': return <Shield className="w-3 h-3" />;
      case 'building': return <Loader2 className="w-3 h-3 animate-spin" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen -m-6 p-6 bg-gradient-to-br from-[#0a0a12] via-[#0d1117] to-[#0a0f16]">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl" />
        {/* Code grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <Braces className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d1117] flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 flex items-center gap-3">
                CodePilot
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs font-normal">
                  <Terminal className="w-3 h-3 mr-1" />
                  Internal Lab
                </Badge>
              </h1>
              <p className="text-slate-500 text-sm mt-1">AI-Powered Development Engine • Your Own CodeLab</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Engine Online</span>
              <span className="text-emerald-500/60 text-xs">•</span>
              <span className="text-emerald-500/60 text-xs">GPU Ready</span>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
              <Settings className="w-4 h-4" />
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
            { label: 'Active Builds', value: '4', change: '+2', icon: Rocket, gradient: 'from-cyan-500 to-blue-500' },
            { label: 'Issues Fixed', value: '127', change: '+12 today', icon: Bug, gradient: 'from-emerald-500 to-green-500' },
            { label: 'Demo Projects', value: '23', change: '8 deployed', icon: Eye, gradient: 'from-purple-500 to-fuchsia-500' },
            { label: 'Auto-Fixes', value: '89%', change: 'success rate', icon: Zap, gradient: 'from-amber-500 to-orange-500' },
            { label: 'Avg Build Time', value: '3.2m', change: '-18%', icon: Clock, gradient: 'from-blue-500 to-indigo-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm hover:border-slate-700/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-slate-500 text-xs">{stat.label}</p>
                <p className="text-emerald-400 text-xs">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1">
            <TabsTrigger value="workspace" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30">
              <Terminal className="w-4 h-4 mr-2" />
              AI Workspace
            </TabsTrigger>
            <TabsTrigger value="issues" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30">
              <Bug className="w-4 h-4 mr-2" />
              Auto-Fix Queue
              <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/40 text-[10px]">
                {issues.filter(i => i.status === 'pending').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="demos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30">
              <Eye className="w-4 h-4 mr-2" />
              Demo Projects
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30">
              <Bot className="w-4 h-4 mr-2" />
              Support Bot
            </TabsTrigger>
            <TabsTrigger value="builds" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30">
              <Activity className="w-4 h-4 mr-2" />
              Build Queue
            </TabsTrigger>
          </TabsList>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-12 gap-4"
            >
              {/* AI Prompt Area */}
              <div className="col-span-8 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-semibold">CodePilot AI</span>
                      <p className="text-slate-500 text-xs">Build anything with natural language</p>
                    </div>
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs">
                      <Cpu className="w-3 h-3 mr-1" />
                      Gemini 3 Pro
                    </Badge>
                  </div>
                  
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to build, fix, or enhance... 

Example: 'Create a real-time analytics dashboard with user activity charts, conversion funnel, and revenue metrics. Use a dark theme with cyan accents.'"
                    className="min-h-[140px] bg-slate-950/50 border-slate-700/50 text-white placeholder:text-slate-600 resize-none text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Select value={selectedAction} onValueChange={(v) => setSelectedAction(v as ActionType)}>
                        <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="generate" className="text-white hover:bg-slate-800">
                            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate</div>
                          </SelectItem>
                          <SelectItem value="review" className="text-white hover:bg-slate-800">
                            <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> Review</div>
                          </SelectItem>
                          <SelectItem value="optimize" className="text-white hover:bg-slate-800">
                            <div className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Optimize</div>
                          </SelectItem>
                          <SelectItem value="test" className="text-white hover:bg-slate-800">
                            <div className="flex items-center gap-2"><TestTube className="w-4 h-4" /> Tests</div>
                          </SelectItem>
                          <SelectItem value="devops" className="text-white hover:bg-slate-800">
                            <div className="flex items-center gap-2"><CloudCog className="w-4 h-4" /> DevOps</div>
                          </SelectItem>
                          <SelectItem value="fix" className="text-white hover:bg-slate-800">
                            <div className="flex items-center gap-2"><Wrench className="w-4 h-4" /> Fix</div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white hover:bg-slate-800">
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Templates
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-400 hover:bg-slate-800"
                        onClick={() => setPrompt('')}
                      >
                        Clear
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={!prompt.trim() || isLoading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {selectedAction === 'generate' ? 'Generate Code' : 
                             selectedAction === 'review' ? 'Review Code' :
                             selectedAction === 'optimize' ? 'Optimize' :
                             selectedAction === 'test' ? 'Generate Tests' :
                             selectedAction === 'devops' ? 'Execute DevOps' : 'Fix Issue'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Code Output Area */}
                {(codeOutput || isLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-medium">Generated Code</span>
                        {isLoading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-500 hover:text-white"
                          onClick={() => {
                            navigator.clipboard.writeText(codeOutput);
                            toast.success('Code copied to clipboard!');
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                      <code>{codeOutput || '// Waiting for generation...'}</code>
                    </pre>
                  </motion.div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'New Demo', desc: 'Custom branded', icon: Play, color: 'cyan' },
                    { label: 'Fix Issue', desc: 'From queue', icon: Wrench, color: 'amber' },
                    { label: 'Branch', desc: 'Create feature', icon: GitBranch, color: 'purple' },
                    { label: 'Deploy', desc: 'Push live', icon: Rocket, color: 'green' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-cyan-500/40 group"
                    >
                      <action.icon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-white text-sm">{action.label}</span>
                      <span className="text-slate-600 text-xs">{action.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 space-y-4">
                {/* Preview Window */}
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800/50 overflow-hidden">
                  <div className="p-3 border-b border-slate-800/50 flex items-center justify-between">
                    <span className="text-white text-sm font-medium">Live Preview</span>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("p-1.5", selectedDevice === 'desktop' && 'bg-slate-800 text-cyan-400')}
                        onClick={() => setSelectedDevice('desktop')}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("p-1.5", selectedDevice === 'tablet' && 'bg-slate-800 text-cyan-400')}
                        onClick={() => setSelectedDevice('tablet')}
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("p-1.5", selectedDevice === 'mobile' && 'bg-slate-800 text-cyan-400')}
                        onClick={() => setSelectedDevice('mobile')}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="aspect-video bg-slate-950 flex items-center justify-center">
                    <div className="text-center text-slate-600">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Preview will appear here</p>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/50">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Active Sessions
                  </h3>
                  <ScrollArea className="h-[240px]">
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className={cn(
                            "p-3 rounded-xl border transition-all cursor-pointer hover:border-cyan-500/40",
                            session.status === 'active' || session.status === 'building'
                              ? 'bg-cyan-500/5 border-cyan-500/20' 
                              : 'bg-slate-800/30 border-slate-700/30'
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white text-sm font-medium truncate flex-1">{session.title}</span>
                            <Badge className={getStatusColor(session.status)}>
                              {getStatusIcon(session.status)}
                              <span className="ml-1">{session.status}</span>
                            </Badge>
                          </div>
                          {session.progress !== undefined && (
                            <div className="space-y-1">
                              <Progress value={session.progress} className="h-1.5 bg-slate-800" />
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{session.type}</span>
                                <span>{session.progress}%</span>
                              </div>
                            </div>
                          )}
                          {session.progress === undefined && (
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="capitalize">{session.type}</span>
                              <span>{session.timestamp.toLocaleTimeString()}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Filter Bar */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input 
                      placeholder="Search issues..." 
                      className="pl-10 w-64 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-400">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                    {issues.filter(i => i.severity === 'critical').length} Critical
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                    {issues.filter(i => i.severity === 'high').length} High
                  </Badge>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">
                    {issues.filter(i => i.status === 'pending').length} Pending
                  </Badge>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {issues.map((issue, i) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "p-4 rounded-xl border flex items-center gap-4 group hover:border-cyan-500/30 transition-all",
                        issue.status === 'fixed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/70 border-slate-800/50'
                      )}
                    >
                      <div className={cn("p-3 rounded-xl border", getSeverityColor(issue.severity))}>
                        {issue.source === 'chatbot' && <MessageSquare className="w-5 h-5" />}
                        {issue.source === 'auto-detect' && <Zap className="w-5 h-5" />}
                        {issue.source === 'manual' && <Bug className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{issue.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="capitalize flex items-center gap-1">
                            {issue.source === 'chatbot' && <MessageSquare className="w-3 h-3" />}
                            {issue.source === 'auto-detect' && <Zap className="w-3 h-3" />}
                            {issue.source}
                          </span>
                          <span>•</span>
                          <span>{new Date(issue.reportedAt).toLocaleString()}</span>
                          {issue.autoFixEligible && (
                            <>
                              <span>•</span>
                              <span className="text-cyan-400 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Auto-fix eligible
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {getStatusIcon(issue.status)}
                          <span className="ml-1">{issue.status}</span>
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {issue.status !== 'fixed' && issue.status !== 'verified' && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                            onClick={() => handleAutoFix(issue)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Wrench className="w-3 h-3 mr-1" />
                            )}
                            Fix Now
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </TabsContent>

          {/* Demos Tab */}
          <TabsContent value="demos" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold">Demo Projects</h3>
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Demo
                </Button>
              </div>

              {/* Demo Grid */}
              <div className="grid grid-cols-2 gap-4">
                {demoProjects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/50 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="aspect-video rounded-xl bg-slate-950 mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="text-slate-700">
                        <Globe className="w-12 h-12" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                      <Badge className={cn("absolute top-3 right-3", getStatusColor(project.status))}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold">{project.name}</h4>
                      <p className="text-slate-500 text-sm">Client: {project.client}</p>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Created {project.createdAt.toLocaleDateString()}</span>
                        <span>Updated {project.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                        onClick={async () => {
                          try {
                            window.open(`/demo/${project.id}`, '_blank');
                            toast.success(`Opening ${project.name} demo preview...`);
                          } catch (error) {
                            toast.error('Failed to open demo preview');
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                        onClick={() => {
                          setEditingProjectId(project.id);
                          setShowCreateDialog(true);
                        }}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={async () => {
                          try {
                            await fetch(`/api/demos/${project.id}`, { method: 'DELETE' });
                            toast.success(`Demo "${project.name}" has been deleted`);
                          } catch (error) {
                            toast.error(`Failed to delete demo "${project.name}"`);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Chatbot Integration Tab */}
          <TabsContent value="chatbot" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* Main Info */}
              <div className="col-span-2 space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 border border-cyan-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-bold">Support Bot Integration</h3>
                      <p className="text-slate-500">Auto-activate CodePilot when clients report issues</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-medium">Connected</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Issues Today', value: '23', icon: Bug },
                      { label: 'Auto-Fixed', value: '18', icon: Zap },
                      { label: 'Avg Fix Time', value: '2.3m', icon: Clock },
                      { label: 'Success Rate', value: '94%', icon: TrendingUp },
                    ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                        <stat.icon className="w-5 h-5 text-cyan-400 mb-2" />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-slate-500 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How it Works */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/50">
                  <h4 className="text-white font-semibold mb-4">Workflow</h4>
                  <div className="flex items-center gap-4">
                    {[
                      { icon: MessageSquare, label: 'Client reports issue', color: 'cyan' },
                      { icon: Bot, label: 'Bot captures details', color: 'blue' },
                      { icon: Zap, label: 'CodePilot analyzes', color: 'purple' },
                      { icon: Wrench, label: 'Auto-fix applied', color: 'amber' },
                      { icon: CheckCircle, label: 'Client notified', color: 'green' },
                    ].map((step, i) => (
                      <React.Fragment key={i}>
                        <div className="flex-1 text-center">
                          <div className={`w-12 h-12 rounded-xl bg-${step.color}-500/20 border border-${step.color}-500/30 flex items-center justify-center mx-auto mb-2`}>
                            <step.icon className={`w-5 h-5 text-${step.color}-400`} />
                          </div>
                          <p className="text-white text-xs">{step.label}</p>
                        </div>
                        {i < 4 && <ChevronRight className="w-5 h-5 text-slate-600" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/50">
                <h4 className="text-white font-semibold mb-4">Auto-Fix Settings</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Auto-fix low severity', enabled: true, desc: 'Immediate fix' },
                    { label: 'Auto-fix medium severity', enabled: true, desc: 'With review' },
                    { label: 'High severity approval', enabled: true, desc: 'Needs approval' },
                    { label: 'Critical: Manual only', enabled: true, desc: 'Always manual' },
                    { label: 'Send fix notifications', enabled: true, desc: 'Email + chat' },
                    { label: 'Log all fixes', enabled: true, desc: 'Audit trail' },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                      <div>
                        <p className="text-white text-sm">{setting.label}</p>
                        <p className="text-slate-600 text-xs">{setting.desc}</p>
                      </div>
                      <div className={cn(
                        "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                        setting.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                      )}>
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm",
                          setting.enabled ? 'right-0.5' : 'left-0.5'
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Build Queue Tab */}
          <TabsContent value="builds" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Build Queue
                </h3>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-400">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="space-y-4">
                {sessions.filter(s => s.status === 'building' || s.status === 'active').map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-xl bg-slate-800/30 border border-cyan-500/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{session.title}</p>
                          <p className="text-slate-500 text-sm capitalize">{session.type}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1">{session.status}</span>
                      </Badge>
                    </div>
                    {session.progress !== undefined && (
                      <div className="space-y-2">
                        <Progress value={session.progress} className="h-2 bg-slate-800" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-cyan-400 font-medium">{session.progress}%</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Demo Dialog */}
        <AnimatePresence>
          {showCreateDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowCreateDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-white text-xl font-semibold mb-4">
                  {editingProjectId ? 'Edit Demo Project' : 'Create New Demo'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm mb-1 block">Project Name</label>
                    <Input 
                      placeholder="e.g., Healthcare Portal" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm mb-1 block">Client Name</label>
                    <Input 
                      placeholder="e.g., MedCorp Inc" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <Button 
                      variant="outline"
                      className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setEditingProjectId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                        onClick={async () => {
                          try {
                            const method = editingProjectId ? 'PUT' : 'POST';
                            const endpoint = editingProjectId ? `/api/demos/${editingProjectId}` : '/api/demos';
                            const response = await fetch(endpoint, { method });
                          
                            if (response.ok) {
                              toast.success(editingProjectId ? 'Demo project updated!' : 'Demo project created!');
                            } else {
                              throw new Error('API request failed');
                            }
                          } catch (error) {
                            toast.error(editingProjectId ? 'Failed to update demo' : 'Failed to create demo');
                          }
                        setShowCreateDialog(false);
                        setEditingProjectId(null);
                      }}
                    >
                      {editingProjectId ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
