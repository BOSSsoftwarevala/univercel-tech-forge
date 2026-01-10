import React, { useState } from 'react';
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
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface CodeSession {
  id: string;
  type: 'demo' | 'fix' | 'enhancement';
  title: string;
  status: 'active' | 'completed' | 'pending';
  timestamp: Date;
  user?: string;
}

interface IssueReport {
  id: string;
  source: 'chatbot' | 'manual' | 'auto-detect';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'fixing' | 'fixed' | 'verified';
  reportedAt: Date;
  fixedAt?: Date;
}

export function CodePilot() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessions] = useState<CodeSession[]>([
    { id: '1', type: 'demo', title: 'Client Onboarding Demo', status: 'active', timestamp: new Date() },
    { id: '2', type: 'fix', title: 'Dashboard loading fix', status: 'completed', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', type: 'enhancement', title: 'Add export feature', status: 'pending', timestamp: new Date(Date.now() - 7200000) },
  ]);
  
  const [issues] = useState<IssueReport[]>([
    { id: '1', source: 'chatbot', description: 'Button not responding on mobile', severity: 'high', status: 'fixing', reportedAt: new Date(Date.now() - 1800000) },
    { id: '2', source: 'auto-detect', description: 'Memory leak in chart component', severity: 'critical', status: 'pending', reportedAt: new Date(Date.now() - 900000) },
    { id: '3', source: 'manual', description: 'Improve table loading speed', severity: 'medium', status: 'fixed', reportedAt: new Date(Date.now() - 86400000), fixedAt: new Date(Date.now() - 3600000) },
  ]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPrompt('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/40';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixing': return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'fixed': return <CheckCircle className="w-3 h-3" />;
      case 'verified': return <CheckCircle className="w-3 h-3 text-green-400" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              CodePilot
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/40 text-xs">
                Internal Only
              </Badge>
            </h1>
            <p className="text-white/50 text-sm">AI-Powered Development Engine • No External Branding</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-sm">Engine Active</span>
          </div>
          <Button variant="outline" size="sm" className="border-violet-500/40 text-violet-300 hover:bg-violet-500/20">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          { label: 'Active Sessions', value: '3', icon: Terminal, color: 'violet' },
          { label: 'Issues Fixed Today', value: '12', icon: Bug, color: 'green' },
          { label: 'Demo Projects', value: '8', icon: Eye, color: 'blue' },
          { label: 'Auto-Fixes', value: '45', icon: Zap, color: 'amber' },
        ].map((stat, i) => (
          <div 
            key={i}
            className={cn(
              "p-4 rounded-xl border backdrop-blur-sm",
              `bg-${stat.color}-500/10 border-${stat.color}-500/30`
            )}
            style={{
              background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))`,
              borderColor: 'rgba(139, 92, 246, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 text-violet-400/50" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="workspace" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
            <Terminal className="w-4 h-4 mr-2" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
            <Bug className="w-4 h-4 mr-2" />
            Auto-Fix Queue
          </TabsTrigger>
          <TabsTrigger value="demos" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
            <Eye className="w-4 h-4 mr-2" />
            Demo Projects
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
            <Bot className="w-4 h-4 mr-2" />
            Support Integration
          </TabsTrigger>
        </TabsList>

        {/* Workspace Tab */}
        <TabsContent value="workspace" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-4"
          >
            {/* AI Prompt Area */}
            <div className="col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="text-white font-medium">CodePilot AI</span>
                  <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/40 text-xs ml-auto">
                    Gemini 3 Flash
                  </Badge>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to build or fix... (e.g., 'Create a dashboard widget for real-time analytics' or 'Fix the login button alignment issue')"
                  className="min-h-[120px] bg-black/30 border-violet-500/30 text-white placeholder:text-white/40 resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                      <FileCode className="w-4 h-4 mr-2" />
                      Import Code
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || isProcessing}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'New Demo', icon: Play, action: 'Create branded demo' },
                  { label: 'Fix Issue', icon: Wrench, action: 'Auto-fix from queue' },
                  { label: 'Branch', icon: GitBranch, action: 'Create feature branch' },
                ].map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 border-white/10 hover:bg-violet-500/20 hover:border-violet-500/40"
                  >
                    <action.icon className="w-5 h-5 text-violet-400" />
                    <span className="text-white text-sm">{action.label}</span>
                    <span className="text-white/40 text-xs">{action.action}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Sessions */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-violet-400" />
                Active Sessions
              </h3>
              <ScrollArea className="h-[280px]">
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all cursor-pointer hover:bg-white/5",
                        session.status === 'active' 
                          ? 'bg-violet-500/10 border-violet-500/40' 
                          : 'bg-white/5 border-white/10'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">{session.title}</span>
                        <Badge 
                          className={cn(
                            "text-xs",
                            session.status === 'active' && 'bg-green-500/20 text-green-300 border-green-500/40',
                            session.status === 'completed' && 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                            session.status === 'pending' && 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          )}
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <span>{session.type}</span>
                        <span>{session.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Bug className="w-5 h-5 text-violet-400" />
                Auto-Fix Issue Queue
              </h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/20 text-red-300 border-red-500/40">
                  {issues.filter(i => i.status === 'pending').length} Pending
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40">
                  {issues.filter(i => i.status === 'fixing').length} In Progress
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {issues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "p-4 rounded-lg border flex items-center gap-4",
                      issue.status === 'fixed' ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
                    )}
                  >
                    <div className={cn("p-2 rounded-lg border", getSeverityColor(issue.severity))}>
                      {issue.source === 'chatbot' && <MessageSquare className="w-4 h-4" />}
                      {issue.source === 'auto-detect' && <Zap className="w-4 h-4" />}
                      {issue.source === 'manual' && <Bug className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white text-sm">{issue.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                        <span className="capitalize">{issue.source}</span>
                        <span>•</span>
                        <span>{new Date(issue.reportedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      <Badge 
                        className={cn(
                          "flex items-center gap-1",
                          issue.status === 'fixed' && 'bg-green-500/20 text-green-300 border-green-500/40',
                          issue.status === 'fixing' && 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
                          issue.status === 'pending' && 'bg-white/20 text-white/60 border-white/20'
                        )}
                      >
                        {getStatusIcon(issue.status)}
                        {issue.status}
                      </Badge>
                    </div>

                    {issue.status !== 'fixed' && (
                      <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white">
                        <Wrench className="w-3 h-3 mr-1" />
                        Fix Now
                      </Button>
                    )}
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
            className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/30 text-center"
          >
            <Eye className="w-12 h-12 text-violet-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Demo Project Manager</h3>
            <p className="text-white/50 mb-4">
              Create custom-branded demo projects for clients without external tool branding.
              Perfect for presentations and client showcases.
            </p>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
              <Play className="w-4 h-4 mr-2" />
              Create New Demo
            </Button>
          </motion.div>
        </TabsContent>

        {/* Chatbot Integration Tab */}
        <TabsContent value="chatbot" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-8 h-8 text-violet-400" />
              <div>
                <h3 className="text-white font-bold">Support Chatbot Integration</h3>
                <p className="text-white/50 text-sm">Auto-activate when clients report issues via chatbot</p>
              </div>
              <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-sm">Connected</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">How It Works</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Client reports issue via support chatbot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    CodePilot auto-detects and analyzes the issue
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    AI generates fix and applies in real-time
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Client notified when fix is deployed
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">Auto-Fix Settings</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Auto-fix low severity', enabled: true },
                    { label: 'Auto-fix medium severity', enabled: true },
                    { label: 'Require approval for high', enabled: true },
                    { label: 'Critical: Manual only', enabled: true },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">{setting.label}</span>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-colors",
                        setting.enabled ? 'bg-violet-500' : 'bg-white/20'
                      )}>
                        <div className={cn(
                          "w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all",
                          setting.enabled ? 'right-0.5' : 'left-0.5'
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
