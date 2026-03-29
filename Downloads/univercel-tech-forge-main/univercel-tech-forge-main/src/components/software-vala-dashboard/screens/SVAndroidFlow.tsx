/**
 * ANDROID FLOW VISUALIZATION
 * Complete mobile app flow documentation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Smartphone,
  Zap,
  Shield,
  Settings,
  Home,
  Brain,
  MessageSquare,
  Play,
  WifiOff,
  Activity,
  ArrowRight,
  ChevronDown,
  Check,
  AlertCircle,
  RefreshCw,
  Database,
  Globe,
  User
} from 'lucide-react';

interface FlowStep {
  title: string;
  description: string;
  status?: 'success' | 'warning' | 'pending';
  icon?: React.ElementType;
}

const FlowDiagram: React.FC<{ steps: FlowStep[]; title: string }> = ({ steps, title }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon || Check;
          return (
            <div key={i} className="relative">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === 'success' ? 'bg-green-100 text-green-600' :
                  step.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{step.title}</p>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-4 top-10 w-px h-4 bg-slate-200"></div>
              )}
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

export const SVAndroidFlow: React.FC = () => {
  const [activeTab, setActiveTab] = useState('launch');

  const launchSteps: FlowStep[] = [
    { title: 'App Open', description: 'User launches the application', icon: Smartphone, status: 'success' },
    { title: 'Splash Screen', description: 'Display branding and loading animation', icon: Zap, status: 'success' },
    { title: 'Environment Check', description: 'Detect Prod / Beta / Dev environment', icon: Settings, status: 'success' },
    { title: 'Internet Detection', description: 'Check network connectivity status', icon: WifiOff, status: 'warning' },
    { title: 'Load Remote Config', description: 'Fetch feature flags and configurations', icon: RefreshCw, status: 'success' },
  ];

  const authSteps: FlowStep[] = [
    { title: 'Login Screen', description: 'Display authentication options', icon: User, status: 'pending' },
    { title: 'Google One-Tap', description: 'Quick sign-in with Google account', icon: Shield, status: 'success' },
    { title: 'Mobile OTP', description: 'Phone number verification flow', icon: Smartphone, status: 'success' },
    { title: 'Email/Password', description: 'Traditional login with credentials', icon: User, status: 'success' },
    { title: 'Token Validation', description: 'Verify JWT token with server', icon: Shield, status: 'success' },
    { title: 'Role Fetch', description: 'Load user role from database', icon: Database, status: 'success' },
    { title: 'Permission Load', description: 'Apply role-based access control', icon: Settings, status: 'success' },
  ];

  const configSteps: FlowStep[] = [
    { title: 'Fetch Enabled Modules', description: 'AI Models, Support Bot, Demo, Languages, Countries', icon: Settings, status: 'success' },
    { title: 'Load AI Models', description: 'Fetch active model configurations', icon: Brain, status: 'success' },
    { title: 'Routing Rules', description: 'Load model routing and fallback rules', icon: RefreshCw, status: 'success' },
    { title: 'Prompt Versions', description: 'Fetch current prompt configurations', icon: Database, status: 'success' },
    { title: 'Offline Models', description: 'Check on-device model availability', icon: WifiOff, status: 'warning' },
  ];

  const aiRequestSteps: FlowStep[] = [
    { title: 'User Action', description: 'Capture user intent or query', icon: User, status: 'success' },
    { title: 'Prepare Request', description: 'Format input with context and metadata', icon: Settings, status: 'success' },
    { title: 'Apply Country Rules', description: 'Filter based on geographic restrictions', icon: Globe, status: 'success' },
    { title: 'Apply Language Rules', description: 'Select appropriate language model', icon: Globe, status: 'success' },
    { title: 'Select Primary Model', description: 'Route to preferred AI model', icon: Brain, status: 'success' },
    { title: 'Fallback Model', description: 'If primary fails, use fallback', icon: AlertCircle, status: 'warning' },
    { title: 'On-device Model', description: 'If offline, use local model', icon: Smartphone, status: 'warning' },
    { title: 'Response Render', description: 'Display AI response to user', icon: Check, status: 'success' },
  ];

  const supportBotSteps: FlowStep[] = [
    { title: 'Open Chat', description: 'User initiates support conversation', icon: MessageSquare, status: 'success' },
    { title: 'Assign Bot', description: 'Route to appropriate chatbot', icon: Brain, status: 'success' },
    { title: 'Load Context', description: 'Gather user, device, language info', icon: User, status: 'success' },
    { title: 'Bot Response', description: 'AI generates contextual reply', icon: MessageSquare, status: 'success' },
    { title: 'Confidence Check', description: 'Evaluate response confidence score', icon: Activity, status: 'warning' },
    { title: 'Human Handover', description: 'If low confidence, escalate to agent', icon: User, status: 'warning' },
    { title: 'Chat Logs Stored', description: 'Persist conversation for analytics', icon: Database, status: 'success' },
  ];

  const demoSteps: FlowStep[] = [
    { title: 'Open Demo', description: 'User selects product demo', icon: Play, status: 'success' },
    { title: 'Check Schedule', description: 'Verify demo availability', icon: Settings, status: 'success' },
    { title: 'Load Content', description: 'Fetch demo assets and scripts', icon: Database, status: 'success' },
    { title: 'Interactive Steps', description: 'Guide user through demo flow', icon: Play, status: 'success' },
    { title: 'Completion Tracking', description: 'Mark demo progress', icon: Check, status: 'success' },
    { title: 'Feedback Capture', description: 'Collect user feedback and rating', icon: Activity, status: 'success' },
  ];

  const offlineSteps: FlowStep[] = [
    { title: 'No Internet', description: 'Detect network disconnection', icon: WifiOff, status: 'warning' },
    { title: 'Enable Cached Models', description: 'Switch to on-device AI models', icon: Brain, status: 'success' },
    { title: 'Queue Requests', description: 'Store requests for later sync', icon: Database, status: 'success' },
    { title: 'Store Logs Locally', description: 'Cache analytics and events', icon: Database, status: 'success' },
    { title: 'Sync When Online', description: 'Upload queued data when connected', icon: RefreshCw, status: 'success' },
  ];

  const loggingSteps: FlowStep[] = [
    { title: 'AI Requests', description: 'Log all model invocations', icon: Brain, status: 'success' },
    { title: 'Errors', description: 'Capture exceptions and failures', icon: AlertCircle, status: 'warning' },
    { title: 'Latency', description: 'Track response times', icon: Activity, status: 'success' },
    { title: 'User Actions', description: 'Record user interactions', icon: User, status: 'success' },
    { title: 'Background Sync', description: 'Periodically upload logs', icon: RefreshCw, status: 'success' },
    { title: 'Server Update', description: 'Persist to analytics backend', icon: Database, status: 'success' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Android Flow</h1>
          <p className="text-slate-500">Complete mobile app flow documentation</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-700">Production Ready</Badge>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Smartphone className="w-4 h-4 mr-2" />
            Preview Flow
          </Button>
        </div>
      </div>

      {/* Flow Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Flows</p>
                <p className="text-2xl font-bold text-slate-800">8</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Steps Covered</p>
                <p className="text-2xl font-bold text-slate-800">47</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Fallback Paths</p>
                <p className="text-2xl font-bold text-slate-800">6</p>
              </div>
              <RefreshCw className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Offline Capable</p>
                <p className="text-2xl font-bold text-slate-800">Yes</p>
              </div>
              <WifiOff className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flow Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 flex-wrap h-auto p-1">
          <TabsTrigger value="launch" className="gap-1">
            <Zap className="w-3 h-3" /> Launch
          </TabsTrigger>
          <TabsTrigger value="auth" className="gap-1">
            <Shield className="w-3 h-3" /> Auth
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1">
            <Settings className="w-3 h-3" /> Config
          </TabsTrigger>
          <TabsTrigger value="home" className="gap-1">
            <Home className="w-3 h-3" /> Home
          </TabsTrigger>
          <TabsTrigger value="ai-request" className="gap-1">
            <Brain className="w-3 h-3" /> AI Request
          </TabsTrigger>
          <TabsTrigger value="support" className="gap-1">
            <MessageSquare className="w-3 h-3" /> Support Bot
          </TabsTrigger>
          <TabsTrigger value="demo" className="gap-1">
            <Play className="w-3 h-3" /> Demo
          </TabsTrigger>
          <TabsTrigger value="offline" className="gap-1">
            <WifiOff className="w-3 h-3" /> Offline
          </TabsTrigger>
          <TabsTrigger value="logging" className="gap-1">
            <Activity className="w-3 h-3" /> Logging
          </TabsTrigger>
        </TabsList>

        <TabsContent value="launch" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={launchSteps} title="App Launch Flow" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Launch Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Splash Duration</span>
                    <Badge>2s</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Minimum display time for branding</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Environment Detection</span>
                    <Badge className="bg-green-100 text-green-700">Auto</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Based on build variant</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Config Timeout</span>
                    <Badge>5s</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Fallback to cached config after timeout</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auth" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={authSteps} title="Authentication Flow" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Auth Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { method: 'Google One-Tap', status: 'enabled', priority: 1 },
                  { method: 'Mobile OTP', status: 'enabled', priority: 2 },
                  { method: 'Email/Password', status: 'enabled', priority: 3 },
                  { method: 'Apple Sign In', status: 'disabled', priority: 4 },
                ].map((auth, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-400">#{auth.priority}</span>
                      <span className="font-medium">{auth.method}</span>
                    </div>
                    <Badge className={auth.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}>
                      {auth.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={configSteps} title="Config & Feature Load" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Enabled Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { module: 'AI Models', enabled: true, count: 5 },
                  { module: 'Support Chatbot', enabled: true, count: 3 },
                  { module: 'Product Demo', enabled: true, count: 12 },
                  { module: 'Languages', enabled: true, count: 24 },
                  { module: 'Country Rules', enabled: true, count: 45 },
                  { module: 'Offline Mode', enabled: true, count: 2 },
                ].map((mod, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">{mod.module}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{mod.count}</Badge>
                      <div className={`w-2 h-2 rounded-full ${mod.enabled ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="home" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Home Dashboard Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                <div className="border-4 border-slate-800 rounded-[2rem] p-4 bg-slate-50">
                  <div className="bg-white rounded-lg p-4 space-y-4">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <WifiOff className="w-3 h-3" />
                        <span>100%</span>
                      </div>
                    </div>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">Software Vala</p>
                        <p className="text-xs text-slate-500">Welcome back, User</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                    </div>
                    {/* AI Status */}
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700">AI Models Online</span>
                      </div>
                    </div>
                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <Brain className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                        <p className="text-xs font-medium">AI Chat</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg text-center">
                        <MessageSquare className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                        <p className="text-xs font-medium">Support</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg text-center">
                        <Play className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                        <p className="text-xs font-medium">Demos</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <Settings className="w-6 h-6 mx-auto text-green-600 mb-2" />
                        <p className="text-xs font-medium">Settings</p>
                      </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="pt-4 border-t space-y-2">
                      <Button className="w-full bg-blue-600">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start AI Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-request" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={aiRequestSteps} title="AI Request Flow" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Routing Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Primary Model</p>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    <span>Gemini 2.5 Flash</span>
                    <Badge className="bg-green-100 text-green-700 ml-auto">Active</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Fallback Chain</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">1.</span>
                      <span>GPT-5 Mini</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">2.</span>
                      <span>GPT-5 Nano</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">3.</span>
                      <span>On-Device (Offline)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Rules Applied</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Country Filter</span>
                      <Badge variant="outline">45 rules</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Language Routing</span>
                      <Badge variant="outline">24 rules</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={supportBotSteps} title="Support Bot Flow" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bot Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Confidence Threshold</span>
                    <Badge>0.75</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Below this, escalate to human</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Context Window</span>
                    <Badge>Last 10 messages</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Messages included in context</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Handover Timeout</span>
                    <Badge>30 seconds</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Wait time before agent pickup</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demo" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={demoSteps} title="Product Demo Flow" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demo Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Auto-play</span>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Start demo automatically</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Skip Option</span>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Allow users to skip steps</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Feedback Required</span>
                    <Badge className="bg-amber-100 text-amber-700">Optional</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Collect rating after completion</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offline" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={offlineSteps} title="Offline Mode Flow" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Offline Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-2 border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <WifiOff className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-amber-700">Offline Models</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>gemini-nano-local</span>
                      <Badge>45 MB</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>whisper-tiny</span>
                      <Badge>39 MB</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Max Cache Size</span>
                    <Badge>100 MB</Badge>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Sync Interval</span>
                    <Badge>30 min</Badge>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Queue Max Size</span>
                    <Badge>50 requests</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logging" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <FlowDiagram steps={loggingSteps} title="Logging & Sync Flow" />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Log Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: 'AI Requests', color: 'blue', count: 1245 },
                  { type: 'Errors', color: 'red', count: 23 },
                  { type: 'Latency', color: 'amber', count: 1245 },
                  { type: 'User Actions', color: 'green', count: 3456 },
                  { type: 'Sync Events', color: 'purple', count: 89 },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${log.color}-500`}></div>
                      <span className="font-medium">{log.type}</span>
                    </div>
                    <Badge variant="outline">{log.count.toLocaleString()}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
