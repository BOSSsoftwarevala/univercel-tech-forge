import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Send, FileText, Image, Mic, Plus, Clock, CheckCircle2,
  XCircle, Pause, RefreshCw, AlertTriangle, Bot, Shield,
  LayoutDashboard, Settings, Users, Package, Activity, TrendingUp,
  ChevronRight, Sparkles, Code2, Bug, TestTube, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';
import { toast } from 'sonner';
import { createUnifiedFactoryProject } from '@/lib/api/vala-factory';
import { createValaBuildPlan } from '@/ai/orchestrator';
import ValaRequestQueue from '@/components/vala-builder/ValaRequestQueue';
import ValaBuildProgress from '@/components/vala-builder/ValaBuildProgress';
import ValaAIBots from '@/components/vala-builder/ValaAIBots';
import ValaDemoFactory from '@/components/vala-builder/ValaDemoFactory';
import ValaAuditLogs from '@/components/vala-builder/ValaAuditLogs';

type TabType = 'create' | 'queue' | 'builds' | 'bots' | 'demos' | 'audit' | 'settings';

const ValaBuilderDashboard = () => {
  const { logAction } = useEnterpriseAudit();
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [requirement, setRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buildPlan = useMemo(() => requirement.trim() ? createValaBuildPlan({ prompt: requirement }) : null, [requirement]);

  const menuItems = [
    { id: 'create' as TabType, label: 'Create Software', icon: Plus, highlight: true },
    { id: 'queue' as TabType, label: 'Request Queue', icon: Clock, badge: '5' },
    { id: 'builds' as TabType, label: 'Active Builds', icon: Activity, badge: '3' },
    { id: 'bots' as TabType, label: 'AI Bots', icon: Bot },
    { id: 'demos' as TabType, label: 'Demo Factory', icon: Package },
    { id: 'audit' as TabType, label: 'Audit Logs', icon: Shield },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Detected Modules', value: buildPlan?.modules.length || 0, icon: Clock, color: 'amber' },
    { label: 'Generated Routes', value: buildPlan?.routing.routes.length || 0, icon: Zap, color: 'teal' },
    { label: 'DB Tables', value: buildPlan?.database.tables.length || 0, icon: CheckCircle2, color: 'emerald' },
    { label: 'Auto-Fix Issues', value: buildPlan?.selfHeal.issues.length || 0, icon: Bot, color: 'purple' },
  ];

  const handleSubmitRequest = useCallback(async () => {
    if (!requirement.trim()) {
      toast.error('Please describe what you want to build');
      return;
    }

    setIsSubmitting(true);
    await logAction({
      action: 'submit_build_request',
      module: 'vala_builder',
      severity: 'medium',
      new_values: { requirement: requirement.substring(0, 100) }
    });

    try {
      const response = await createUnifiedFactoryProject({
        prompt: requirement,
        project_name: buildPlan ? `${buildPlan.systemType.toUpperCase()} Builder Project` : undefined,
        project_type: buildPlan?.systemType || 'web_app',
        source_type: 'prompt',
        target_platform: requirement.toLowerCase().includes('apk') ? 'apk' : 'web',
        build_type: requirement.toLowerCase().includes('apk') ? 'apk-release' : 'pwa',
      });

      setRequirement('');
      setActiveTab('builds');
      toast.success('VALA build created', {
        description: `Project ${response.data.project.project_name} is now active in the factory pipeline.`,
      });
    } catch (error) {
      console.error('VALA builder submission failed', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create VALA build');
    } finally {
      setIsSubmitting(false);
    }
  }, [requirement, logAction]);

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`bg-slate-900/50 border-${stat.color}-500/20`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-${stat.color}-100`}>{stat.value}</div>
                        <div className="text-xs text-slate-400">{stat.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Create Interface - Enterprise Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 border-purple-500/30 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-300">AI-Powered Builder</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Create or Update Software
                    </h2>
                    <p className="text-slate-400">
                      Describe what you want in plain language. AI will handle the rest.
                    </p>
                  </div>

                  <div className="relative">
                    <Textarea
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      placeholder="Tell us what you want to build...&#10;&#10;Example: Create a restaurant POS with table management, kitchen display, and inventory tracking. Include multi-language support for English and Arabic."
                      className="min-h-[200px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none text-lg"
                    />
                    
                    {/* Attachment Options */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="text-slate-400 border-slate-700 hover:bg-slate-800">
                        <FileText className="w-4 h-4 mr-2" />
                        Attach File
                      </Button>
                      <Button variant="outline" size="sm" className="text-slate-400 border-slate-700 hover:bg-slate-800">
                        <Image className="w-4 h-4 mr-2" />
                        Screenshot
                      </Button>
                      <Button variant="outline" size="sm" className="text-slate-400 border-slate-700 hover:bg-slate-800">
                        <Mic className="w-4 h-4 mr-2" />
                        Voice
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleSubmitRequest}
                      disabled={isSubmitting || !requirement.trim()}
                      className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit for Approval
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-xs text-slate-500 mt-4">
                    <Lock className="w-3 h-3 inline mr-1" />
                    All requests require Boss approval before building
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Analysis Preview */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  AI Understanding Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Detected Software Type</h4>
                    <p className="text-white">{buildPlan?.systemType || '—'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Estimated Features</h4>
                    <p className="text-white">{buildPlan ? `${buildPlan.modules.length} modules, ${buildPlan.database.tables.length} tables` : '—'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Risk Level</h4>
                    <p className="text-white">{buildPlan ? (buildPlan.selfHeal.retryRecommended ? 'Retry Required' : 'Stable') : '—'}</p>
                  </div>
                </div>
                {buildPlan && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Pipeline</h4>
                      <p className="text-white text-sm">{buildPlan.pipeline.join(' -> ')}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">AI Routing</h4>
                      <p className="text-white text-sm">{buildPlan.providers.reasoning}, {buildPlan.providers.architecture}, {buildPlan.providers.ui}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Auto-Heal</h4>
                      <p className="text-white text-sm">{buildPlan.selfHeal.issues.length === 0 ? 'No blocking issues detected' : buildPlan.selfHeal.issues.map((issue) => issue.fixAction).join(', ')}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'queue':
        return <ValaRequestQueue />;
      case 'builds':
        return <ValaBuildProgress />;
      case 'bots':
        return <ValaAIBots />;
      case 'demos':
        return <ValaDemoFactory />;
      case 'audit':
        return <ValaAuditLogs />;
      case 'settings':
        return (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Builder Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Settings panel - Coming soon</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-slate-900/80 border-r border-purple-500/20 p-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">VALA Builder</h1>
                <p className="text-xs text-purple-400">Internal Only</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === item.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                } ${item.highlight ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.badge && (
                  <Badge className="bg-purple-500/30 text-purple-300 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Security Notice */}
          <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Internal Only</span>
            </div>
            <p className="text-xs text-red-300/70">
              This system is not for sale. All actions are logged and audited.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ValaBuilderDashboard;
