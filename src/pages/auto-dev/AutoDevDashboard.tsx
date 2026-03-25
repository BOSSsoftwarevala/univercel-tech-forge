import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Upload, FileText, Image, Video, Send, 
  Sparkles, Bot, Loader2, CheckCircle2, AlertCircle,
  HelpCircle, Lightbulb, Play, Pause, RotateCcw, Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UniversalInputBox } from "@/components/auto-dev/UniversalInputBox";
import { AIConversation } from "@/components/auto-dev/AIConversation";
import { BuildProgress } from "@/components/auto-dev/BuildProgress";
import { QuickActions } from "@/components/auto-dev/QuickActions";
import { AutoDevHelp } from "@/components/auto-dev/AutoDevHelp";
import { AIModelsPanel } from "@/components/auto-dev/AIModelsPanel";
import { APIsPanel } from "@/components/auto-dev/APIsPanel";
import { APKGeneratorPanel } from "@/components/auto-dev/APKGeneratorPanel";
import { PlatformOutputPanel } from "@/components/auto-dev/PlatformOutputPanel";
import { useEnterpriseAudit } from "@/hooks/useEnterpriseAudit";
import { createUnifiedFactoryProject, controlFactoryPipeline, getFactoryProject, type FactoryProjectDetail } from "@/lib/api/vala-factory";

export type BuildStatus = 'idle' | 'understanding' | 'clarifying' | 'building' | 'testing' | 'deploying' | 'complete' | 'paused' | 'error';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'voice' | 'file' | 'image' | 'video';
  attachments?: { name: string; type: string; url?: string }[];
  timestamp: Date;
  isTyping?: boolean;
}

const mapFactoryStageToBuildStatus = (detail: FactoryProjectDetail | null): BuildStatus => {
  if (!detail) return 'idle';
  if (detail.project.pipeline_status === 'paused') return 'paused';
  if (detail.project.status === 'failed' || detail.project.active_errors > 0) return 'error';
  if (detail.project.status === 'deployed' || detail.project.pipeline_status === 'completed') return 'complete';
  if (detail.project.current_stage === 'deployment' || detail.deployments[0]?.status === 'live') return 'deploying';
  if (detail.project.current_stage === 'testing' || detail.testRuns[0]?.status === 'running') return 'testing';
  if (detail.project.pipeline_status === 'running' || detail.project.current_stage !== 'intake') return 'building';
  return 'understanding';
};

const estimateFactoryProgress = (detail: FactoryProjectDetail | null): number => {
  if (!detail) return 0;
  if (detail.project.pipeline_status === 'completed' || detail.project.status === 'deployed') return 100;

  const latestBuild = detail.mobileBuilds[0];
  const latestTest = detail.testRuns[0];
  const latestDeployment = detail.deployments[0];

  if (latestDeployment?.status === 'live') return 100;
  if (detail.project.current_stage === 'deployment') return 90;
  if (latestTest?.status === 'passed') return 82;
  if (latestTest?.status === 'running' || detail.project.current_stage === 'testing') return 70;
  if (latestBuild?.status === 'completed' || latestBuild?.status === 'signed') return 62;
  if (latestBuild?.status === 'running') return 52;
  if (detail.project.current_stage === 'blueprint') return 24;
  if (detail.project.current_stage === 'modules') return 38;
  if (detail.project.current_stage === 'api') return 46;
  if (detail.project.current_stage === 'database') return 54;
  if (detail.project.current_stage === 'flows') return 60;
  if (detail.project.current_stage === 'approval') return 88;
  return 16;
};

const buildProjectStatusText = (detail: FactoryProjectDetail): string => {
  const latestLog = detail.runtimeLogs[0]?.message;
  const latestBuild = detail.mobileBuilds[0]?.status;
  const latestTest = detail.testRuns[0]?.status;

  if (detail.project.pipeline_status === 'paused') return 'Pipeline paused';
  if (detail.project.status === 'deployed') return 'Deployed and live';
  if (latestLog) return latestLog;
  if (latestTest === 'passed') return 'Tests passed';
  if (latestBuild) return `Mobile build ${latestBuild}`;
  return `Stage: ${detail.project.current_stage}`;
};

const AutoDevDashboard = () => {
  const { logButtonClick } = useEnterpriseAudit();
  const [buildStatus, setBuildStatus] = useState<BuildStatus>('idle');
  const [buildProgress, setBuildProgress] = useState(0);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentProject, setCurrentProject] = useState<{
    id: string;
    name: string;
    description: string;
    status: string;
  } | null>(null);
  const [activeFactoryProjectId, setActiveFactoryProjectId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!activeFactoryProjectId) return;

    let cancelled = false;

    const syncProject = async () => {
      try {
        const response = await getFactoryProject(activeFactoryProjectId);
        if (cancelled) return;
        const detail = response.data;
        setCurrentProject({
          id: detail.project.id,
          name: detail.project.project_name,
          description: detail.project.prompt,
          status: buildProjectStatusText(detail),
        });
        setBuildStatus(mapFactoryStageToBuildStatus(detail));
        setBuildProgress(estimateFactoryProgress(detail));
      } catch (error) {
        if (cancelled) return;
        console.error('Failed to sync factory project', error);
        setBuildStatus('error');
      }
    };

    void syncProject();
    const interval = window.setInterval(() => void syncProject(), 8000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeFactoryProjectId]);

  const handleUserInput = useCallback(async (
    content: string, 
    type: 'text' | 'voice' | 'file' | 'image' | 'video',
    attachments?: { name: string; type: string; url?: string }[]
  ) => {
    await logButtonClick('auto_dev_input', 'User Input', 'vala_builder', { type });

    // Add user message
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      type,
      attachments,
      timestamp: new Date(),
    };
    setConversation(prev => [...prev, userMessage]);

    setBuildStatus('understanding');
    
    const aiTypingMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: '',
      type: 'text',
      timestamp: new Date(),
      isTyping: true,
    };
    setConversation(prev => [...prev, aiTypingMessage]);

    const aiResponse = generateAIResponse(content, type, attachments);
    
    setConversation(prev => prev.map(msg => 
      msg.id === aiTypingMessage.id 
        ? { ...msg, content: aiResponse.message, isTyping: false }
        : msg
    ));

    if (aiResponse.needsClarification) {
      setBuildStatus('clarifying');
    } else if (aiResponse.canBuild) {
      // Start auto-build
      startBuild(aiResponse.projectName || 'New Project', aiResponse.description || content);
    } else {
      setBuildStatus('idle');
    }
  }, [logButtonClick]);

  const generateAIResponse = (content: string, type: string, attachments?: any[]) => {
    const hasImage = type === 'image' || attachments?.some(a => a.type.startsWith('image'));
    const hasVideo = type === 'video' || attachments?.some(a => a.type.startsWith('video'));
    const hasFile = type === 'file' || attachments?.some(a => !a.type.startsWith('image') && !a.type.startsWith('video'));

    if (content.toLowerCase().includes('create') || content.toLowerCase().includes('build') || content.toLowerCase().includes('make')) {
      return {
        message: `I understand you want to create something. Let me help!\n\n📋 **What I understood:**\n${content}\n\n${hasImage ? '🖼️ I see you uploaded a reference image - I\'ll match that design.\n' : ''}${hasVideo ? '🎬 I\'ll analyze the video for reference.\n' : ''}${hasFile ? '📄 I\'ll extract requirements from your document.\n' : ''}\n\n✅ Ready to start building? Just say "OK" or "Go ahead"!`,
        needsClarification: false,
        canBuild: true,
        projectName: extractProjectName(content),
        description: content,
      };
    }

    if (content.toLowerCase().includes('fix') || content.toLowerCase().includes('bug') || content.toLowerCase().includes('error')) {
      return {
        message: `🔧 I understand you're reporting an issue.\n\n${hasImage ? '📸 I see the screenshot - analyzing the problem...\n' : ''}\n\n**Detected Issue:** UI rendering problem\n**Suggested Fix:** Auto-correcting component styles\n\nShould I apply this fix automatically?`,
        needsClarification: true,
        canBuild: false,
      };
    }

    return {
      message: `I'm here to help! 🤖\n\nYou can:\n• Describe what you want to build\n• Upload a design image\n• Share a reference video\n• Upload requirements document\n• Report a bug with a screenshot\n\nWhat would you like to create today?`,
      needsClarification: false,
      canBuild: false,
    };
  };

  const extractProjectName = (content: string): string => {
    const words = content.toLowerCase().split(' ');
    const createIndex = words.findIndex(w => ['create', 'build', 'make'].includes(w));
    if (createIndex !== -1 && words[createIndex + 1]) {
      return words.slice(createIndex + 1, createIndex + 4).join(' ');
    }
    return 'New Project';
  };

  const startBuild = async (name: string, description: string) => {
    setBuildStatus('building');
    setBuildProgress(12);

    await logButtonClick('auto_dev_build_start', 'Start Build', 'vala_builder', { name });

    try {
      const response = await createUnifiedFactoryProject({
        prompt: description,
        project_name: name,
        project_type: 'mobile_app',
        source_type: 'prompt',
        target_platform: 'apk',
        build_type: 'apk-release',
      });

      const projectId = response.data.project.id;
      setActiveFactoryProjectId(projectId);
      setCurrentProject({
        id: projectId,
        name: response.data.project.project_name,
        description,
        status: 'Factory project created',
      });

      await controlFactoryPipeline(projectId, { action: 'start' });
      toast.success('Real factory pipeline started', {
        description: 'Project, blueprint, modules, and build orchestration were stored.',
      });
    } catch (error) {
      console.error('Failed to start real factory build', error);
      setBuildStatus('error');
      setBuildProgress(100);
      toast.error(error instanceof Error ? error.message : 'Failed to start real factory build');
    }
  };

  const handlePauseBuild = async () => {
    await logButtonClick('auto_dev_pause', 'Pause Build', 'vala_builder');

    if (!activeFactoryProjectId) {
      toast.error('No active factory project to pause');
      return;
    }

    try {
      await controlFactoryPipeline(activeFactoryProjectId, { action: 'pause' });
      setBuildStatus('paused');
      toast.warning('Build paused', { description: 'Pipeline control stored in the factory.' });
    } catch (error) {
      console.error('Failed to pause build', error);
      toast.error(error instanceof Error ? error.message : 'Failed to pause build');
    }
  };

  const handleResumeBuild = async () => {
    await logButtonClick('auto_dev_resume', 'Resume Build', 'vala_builder');

    if (!activeFactoryProjectId) {
      toast.error('No active factory project to resume');
      return;
    }

    try {
      await controlFactoryPipeline(activeFactoryProjectId, { action: 'start' });
      setBuildStatus('building');
      toast.success('Build resumed');
    } catch (error) {
      console.error('Failed to resume build', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resume build');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Auto Development</h1>
              <p className="text-sm text-purple-400">Voice • Text • Image • Video • Unlimited Possibilities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/50">
              <Bot className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(!showHelp)}
              className="text-muted-foreground hover:text-white"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Universal Input & Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Universal Input Box */}
          <UniversalInputBox 
            onSubmit={handleUserInput}
            isProcessing={buildStatus === 'understanding'}
          />

          {/* AI Conversation */}
          <AIConversation 
            messages={conversation}
            buildStatus={buildStatus}
          />

          {/* Quick Actions */}
          <QuickActions 
            onAction={(action) => {
              handleUserInput(`${action}`, 'text');
            }}
          />
        </div>

        {/* Right Column - Build Progress, AI Models, APIs, APK */}
        <div className="space-y-6">
          {/* Build Progress */}
          <BuildProgress 
            status={buildStatus}
            progress={buildProgress}
            project={currentProject}
            onPause={handlePauseBuild}
            onResume={handleResumeBuild}
          />

          {/* Extended Panels - Tabbed */}
          <Tabs defaultValue="ai-models" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
              <TabsTrigger value="ai-models" className="text-xs">AI Models</TabsTrigger>
              <TabsTrigger value="apis" className="text-xs">APIs</TabsTrigger>
              <TabsTrigger value="apk" className="text-xs">Mobile</TabsTrigger>
              <TabsTrigger value="platforms" className="text-xs">Platforms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-models" className="mt-3">
              <AIModelsPanel />
            </TabsContent>
            
            <TabsContent value="apis" className="mt-3">
              <APIsPanel />
            </TabsContent>
            
            <TabsContent value="apk" className="mt-3">
              <APKGeneratorPanel 
                projectName={currentProject?.name}
                projectId={currentProject?.id}
                onApprovalRequest={() => {
                  toast.info('APK generation requires Boss approval');
                }}
              />
            </TabsContent>
            
            <TabsContent value="platforms" className="mt-3">
              <PlatformOutputPanel />
            </TabsContent>
          </Tabs>

          {/* Contextual Help */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AutoDevHelp />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Suggestions */}
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-violet-300">
                <Lightbulb className="w-4 h-4" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {buildStatus === 'idle' 
                  ? 'Try: "Create school app" or "Make Android APK"'
                  : buildStatus === 'complete'
                  ? 'Your software is live! Want to add more features or generate APK?'
                  : 'I\'m working on your request...'}
              </p>
              {buildStatus === 'idle' && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {['School System', 'E-commerce', 'Generate APK', 'Deploy Server'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      size="sm"
                      className="text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300"
                      onClick={() => handleUserInput(suggestion.startsWith('Generate') || suggestion.startsWith('Deploy') 
                        ? suggestion 
                        : `Create a ${suggestion}`, 'text')}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutoDevDashboard;
