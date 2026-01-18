/**
 * DEMO MANAGER DASHBOARD
 * Full-featured dashboard for managing LIVE SOFTWARE instances
 * 
 * NO DEMO WORD IN UI - TREAT AS LIVE SOFTWARE
 * Client can click all buttons but with dummy realistic data
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import { 
  Monitor, Search, ExternalLink, Wand2, RefreshCw,
  Filter, AlertTriangle, CheckCircle2, Users, Globe,
  Eye, EyeOff, Lock, Unlock, Bot, MessageSquare,
  TrendingUp, FileText, Shield, Activity, Play,
  Pause, Settings, BarChart3, Clock
} from "lucide-react";

// ===== LOCKED THEME COLORS =====
const THEME = {
  bg: '#0a1628',
  cardBg: 'rgba(13, 27, 42, 0.95)',
  border: '#1e3a5f',
  accent: '#2563eb',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// Stats for Demo Manager
const demoMetrics = [
  { label: 'Active Products', value: '24', icon: Monitor, color: 'from-blue-500 to-cyan-600' },
  { label: 'Live Sessions', value: '156', icon: Users, color: 'from-emerald-500 to-teal-600' },
  { label: 'Clients Viewing', value: '89', icon: Eye, color: 'from-violet-500 to-purple-600' },
  { label: 'Conversion Rate', value: '34%', icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
  { label: 'Restricted Actions', value: '12', icon: Lock, color: 'from-rose-500 to-pink-600' },
  { label: 'AI Assist Status', value: 'ON', icon: Bot, color: 'from-indigo-500 to-violet-600' },
];

// Mock live software instances
const liveInstances = [
  { 
    id: 1, 
    name: "School Management Pro", 
    product: "School ERP",
    url: "school.softwarevala.com",
    status: "active",
    viewers: 23,
    conversions: 8,
    created: "2 days ago"
  },
  { 
    id: 2, 
    name: "Hospital HMS Suite", 
    product: "Hospital Management",
    url: "hospital.softwarevala.com",
    status: "active",
    viewers: 45,
    conversions: 12,
    created: "1 week ago"
  },
  { 
    id: 3, 
    name: "Restaurant POS", 
    product: "POS System",
    url: "restaurant.softwarevala.com",
    status: "paused",
    viewers: 0,
    conversions: 5,
    created: "2 weeks ago"
  },
  { 
    id: 4, 
    name: "Hotel Booking Engine", 
    product: "Hotel Management",
    url: "hotel.softwarevala.com",
    status: "active",
    viewers: 18,
    conversions: 4,
    created: "3 days ago"
  },
  { 
    id: 5, 
    name: "Gym Management Elite", 
    product: "Gym ERP",
    url: "gym.softwarevala.com",
    status: "active",
    viewers: 12,
    conversions: 3,
    created: "1 day ago"
  },
];

// Feature visibility settings
const featureVisibility = [
  { id: 1, name: 'Payment Gateway', visible: true, locked: false },
  { id: 2, name: 'User Management', visible: true, locked: true },
  { id: 3, name: 'Reports Export', visible: false, locked: true },
  { id: 4, name: 'API Access', visible: false, locked: true },
  { id: 5, name: 'Data Import', visible: true, locked: false },
  { id: 6, name: 'Settings Panel', visible: true, locked: true },
];

// Client sessions
const clientSessions = [
  { id: 1, client: 'John D.', product: 'School ERP', duration: '15 min', status: 'active' },
  { id: 2, client: 'Sarah M.', product: 'Hospital HMS', duration: '32 min', status: 'active' },
  { id: 3, client: 'Mike R.', product: 'Restaurant POS', duration: '8 min', status: 'viewing' },
  { id: 4, client: 'Lisa K.', product: 'Hotel Booking', duration: '22 min', status: 'active' },
];

export const DemoManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showFeatureControl, setShowFeatureControl] = useState(false);
  const [features, setFeatures] = useState(featureVisibility);

  const toggleFeatureVisibility = (id: number) => {
    setFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, visible: !f.visible } : f
    ));
    toast.success('Feature visibility updated');
  };

  const toggleFeatureLock = (id: number) => {
    setFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, locked: !f.locked } : f
    ));
    toast.success('Feature lock updated');
  };

  return (
    <div 
      className="min-h-full p-6 space-y-6"
      style={{ background: THEME.bg }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: THEME.text }}>DEMO MANAGER</h1>
          <p className="text-sm" style={{ color: THEME.textMuted }}>
            LIVE SOFTWARE MODE • Real-time Instance Management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            LIVE
          </Badge>
          <Button 
            size="sm"
            className="gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
            variant="outline"
            onClick={() => toast.loading('AI fixing all errors...', { duration: 2000 })}
          >
            <Wand2 className="w-4 h-4" />
            Fix All (AI)
          </Button>
        </div>
      </div>

      {/* Stats Grid - 6 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {demoMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold" style={{ color: THEME.text }}>{metric.value}</p>
                      <p className="text-[10px]" style={{ color: THEME.textMuted }}>{metric.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList 
          className="grid w-full grid-cols-5 gap-1"
          style={{ background: THEME.cardBg }}
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instances">Live Software</TabsTrigger>
          <TabsTrigger value="sessions">Client Sessions</TabsTrigger>
          <TabsTrigger value="features">Feature Control</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Quick Actions */}
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold" style={{ color: THEME.text }}>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  onClick={() => setShowFeatureControl(true)}
                  className="h-16 flex-col gap-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30"
                  variant="outline"
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-xs">Feature Visibility</span>
                </Button>
                <Button 
                  onClick={() => toast.success('Refreshing all instances...')}
                  className="h-16 flex-col gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                  variant="outline"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-xs">Refresh All</span>
                </Button>
                <Button 
                  onClick={() => setShowAIAssistant(true)}
                  className="h-16 flex-col gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                  variant="outline"
                >
                  <Bot className="w-5 h-5" />
                  <span className="text-xs">AI Assistant</span>
                </Button>
                <Button 
                  onClick={() => toast.success('Generating report...')}
                  className="h-16 flex-col gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                  variant="outline"
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Generate Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Activity */}
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientSessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: 'rgba(30, 58, 95, 0.3)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: THEME.text }}>{session.client}</p>
                        <p className="text-xs" style={{ color: THEME.textMuted }}>{session.product}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" style={{ color: THEME.textMuted }} />
                        <span className="text-xs" style={{ color: THEME.textMuted }}>{session.duration}</span>
                      </div>
                      <Badge className={
                        session.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }>
                        {session.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Software Tab */}
        <TabsContent value="instances" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: THEME.textMuted }} />
              <Input 
                placeholder="Search instances..." 
                className="pl-9 w-[250px]" 
                style={{ background: 'rgba(30, 58, 95, 0.3)', borderColor: THEME.border, color: THEME.text }}
              />
            </div>
            <Button variant="outline" className="gap-2" style={{ borderColor: THEME.border, color: THEME.text }}>
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <Monitor className="w-4 h-4 text-blue-400" />
                Live Software Instances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveInstances.map((instance, idx) => (
                  <motion.div
                    key={instance.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ background: 'rgba(30, 58, 95, 0.2)', borderColor: THEME.border }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        instance.status === 'active' ? 'bg-emerald-500/20' : 'bg-gray-500/20'
                      }`}>
                        {instance.status === 'active' ? (
                          <Play className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Pause className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: THEME.text }}>{instance.name}</p>
                        <p className="text-xs text-blue-400">{instance.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: THEME.text }}>{instance.viewers}</p>
                        <p className="text-[10px]" style={{ color: THEME.textMuted }}>viewers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-400">{instance.conversions}</p>
                        <p className="text-[10px]" style={{ color: THEME.textMuted }}>sales</p>
                      </div>
                      <Badge className={
                        instance.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }>
                        {instance.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" style={{ color: THEME.text }}>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" style={{ color: THEME.text }}>
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" style={{ color: THEME.text }}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <Users className="w-4 h-4 text-violet-400" />
                Active Client Sessions ({clientSessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientSessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ background: 'rgba(30, 58, 95, 0.2)', borderColor: THEME.border }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-violet-400">
                          {session.client.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: THEME.text }}>{session.client}</p>
                        <p className="text-xs" style={{ color: THEME.textMuted }}>
                          Viewing: {session.product}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" style={{ color: THEME.textMuted }} />
                        <span className="text-sm" style={{ color: THEME.text }}>{session.duration}</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => toast.success('Starting chat...')}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Control Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <Shield className="w-4 h-4 text-amber-400" />
                Feature Visibility Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs mb-4" style={{ color: THEME.textMuted }}>
                Control which features are visible and which actions are locked for clients
              </p>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div 
                    key={feature.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ background: 'rgba(30, 58, 95, 0.2)', borderColor: THEME.border }}
                  >
                    <span className="font-medium" style={{ color: THEME.text }}>{feature.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {feature.visible ? (
                          <Eye className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <Switch 
                          checked={feature.visible} 
                          onCheckedChange={() => toggleFeatureVisibility(feature.id)}
                        />
                        <Label className="text-xs" style={{ color: THEME.textMuted }}>Visible</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        {feature.locked ? (
                          <Lock className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Unlock className="w-4 h-4 text-emerald-400" />
                        )}
                        <Switch 
                          checked={feature.locked} 
                          onCheckedChange={() => toggleFeatureLock(feature.id)}
                        />
                        <Label className="text-xs" style={{ color: THEME.textMuted }}>Locked</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai-assistant" className="space-y-4">
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <Bot className="w-4 h-4 text-blue-400" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="p-4 rounded-lg border"
                  style={{ background: 'rgba(37, 99, 235, 0.1)', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                >
                  <MessageSquare className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-medium mb-1" style={{ color: THEME.text }}>Chat with Clients</h3>
                  <p className="text-xs mb-3" style={{ color: THEME.textMuted }}>
                    AI-powered chat to answer client questions
                  </p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Open Chat
                  </Button>
                </div>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}
                >
                  <Wand2 className="w-6 h-6 text-emerald-400 mb-2" />
                  <h3 className="font-medium mb-1" style={{ color: THEME.text }}>Explain Features</h3>
                  <p className="text-xs mb-3" style={{ color: THEME.textMuted }}>
                    AI explains product features to clients
                  </p>
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Start Walkthrough
                  </Button>
                </div>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                >
                  <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />
                  <h3 className="font-medium mb-1" style={{ color: THEME.text }}>Route Issues</h3>
                  <p className="text-xs mb-3" style={{ color: THEME.textMuted }}>
                    AI routes client issues to support
                  </p>
                  <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
                    View Queue
                  </Button>
                </div>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                >
                  <BarChart3 className="w-6 h-6 text-violet-400 mb-2" />
                  <h3 className="font-medium mb-1" style={{ color: THEME.text }}>Answer Questions</h3>
                  <p className="text-xs mb-3" style={{ color: THEME.textMuted }}>
                    AI answers common questions automatically
                  </p>
                  <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-700">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant Sheet */}
      <Sheet open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <SheetContent className="w-[400px]" style={{ background: THEME.bg, borderColor: THEME.border }}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2" style={{ color: THEME.text }}>
              <Bot className="w-5 h-5 text-blue-400" />
              AI Assistant
            </SheetTitle>
            <SheetDescription style={{ color: THEME.textMuted }}>
              Configure AI behavior for client interactions
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
              <p className="text-sm font-medium text-blue-400 mb-2">AI Status: Active</p>
              <p className="text-xs" style={{ color: THEME.textMuted }}>
                Currently assisting 4 clients
              </p>
            </div>
            <Button className="w-full" onClick={() => {
              toast.success('AI Assistant configured');
              setShowAIAssistant(false);
            }}>
              Save Configuration
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Feature Control Sheet */}
      <Sheet open={showFeatureControl} onOpenChange={setShowFeatureControl}>
        <SheetContent className="w-[400px]" style={{ background: THEME.bg, borderColor: THEME.border }}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2" style={{ color: THEME.text }}>
              <Eye className="w-5 h-5 text-violet-400" />
              Feature Visibility
            </SheetTitle>
            <SheetDescription style={{ color: THEME.textMuted }}>
              Control what clients can see and access
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[70vh] mt-4">
            <div className="space-y-3 pr-4">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className="p-3 rounded-lg border"
                  style={{ background: 'rgba(30, 58, 95, 0.2)', borderColor: THEME.border }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: THEME.text }}>{feature.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={feature.visible} 
                        onCheckedChange={() => toggleFeatureVisibility(feature.id)}
                      />
                      <Label className="text-xs" style={{ color: THEME.textMuted }}>Show</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={feature.locked} 
                        onCheckedChange={() => toggleFeatureLock(feature.id)}
                      />
                      <Label className="text-xs" style={{ color: THEME.textMuted }}>Lock</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};
