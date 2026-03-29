import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Download, Play, CheckCircle2, Loader2,
  Shield, Globe, Key, Package, Rocket, AlertTriangle,
  FileCode, Lock, Fingerprint
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buildFactoryMobile, createUnifiedFactoryProject } from "@/lib/api/vala-factory";

interface APKGeneratorPanelProps {
  projectName?: string;
  projectId?: string;
  onApprovalRequest?: () => void;
}

type BuildType = 'apk-debug' | 'apk-release' | 'aab' | 'pwa';
type BuildStatus = 'idle' | 'queued' | 'running' | 'signing' | 'complete' | 'pending-approval' | 'failed';

export const APKGeneratorPanel = ({ projectName = "My Project", projectId, onApprovalRequest }: APKGeneratorPanelProps) => {
  const [selectedType, setSelectedType] = useState<BuildType>('apk-release');
  const [buildStatus, setBuildStatus] = useState<BuildStatus>('idle');
  const [progress, setProgress] = useState(0);

  const buildTypes = [
    { id: 'apk-debug' as BuildType, label: 'Debug APK', icon: FileCode, description: 'Testing only' },
    { id: 'apk-release' as BuildType, label: 'Release APK', icon: Package, description: 'Production ready' },
    { id: 'aab' as BuildType, label: 'AAB Bundle', icon: Play, description: 'Play Store ready' },
    { id: 'pwa' as BuildType, label: 'PWA', icon: Globe, description: 'Installable web' },
  ];

  const startBuild = async () => {
    setBuildStatus('queued');
    setProgress(15);

    try {
      if (projectId) {
        const response = await buildFactoryMobile(projectId, { build_type: selectedType });
        const status = response.data.mobileBuild.status;
        const nextStatus: BuildStatus = status === 'completed' ? 'complete' : status === 'signed' ? 'complete' : status === 'failed' ? 'failed' : status === 'running' ? 'running' : status === 'pending_configuration' ? 'pending-approval' : 'queued';
        setBuildStatus(nextStatus);
        setProgress(nextStatus === 'complete' ? 100 : nextStatus === 'running' ? 60 : nextStatus === 'pending-approval' ? 35 : 25);
        toast.success(`Mobile build status: ${status}`);
        onApprovalRequest?.();
        return;
      }

      const response = await createUnifiedFactoryProject({
        prompt: `Build an APK-ready mobile app for ${projectName} with auth, payments, admin, reporting, testing, backup, and deployment.`,
        project_name: projectName,
        project_type: 'mobile_app',
        source_type: 'prompt',
        target_platform: selectedType === 'pwa' ? 'pwa' : selectedType === 'aab' ? 'aab' : 'apk',
        build_type: selectedType,
      });
      const build = response.data.project.raw_input_saved?.build_type || selectedType;
      setBuildStatus(selectedType === 'pwa' ? 'complete' : 'pending-approval');
      setProgress(selectedType === 'pwa' ? 100 : 35);
      toast.success(`Factory project created for ${build}`);
      onApprovalRequest?.();
    } catch (error) {
      console.error('Failed to generate mobile app', error);
      setBuildStatus('failed');
      setProgress(100);
      toast.error(error instanceof Error ? error.message : 'Failed to generate mobile app');
    }
  };

  const getStatusMessage = () => {
    switch (buildStatus) {
      case 'queued': return 'Factory build request stored...';
      case 'running': return 'Mobile build hook is running...';
      case 'signing': return 'Signing APK internally...';
      case 'complete': return 'Ready for download!';
      case 'pending-approval': return 'Awaiting Boss approval...';
      case 'failed': return 'Build failed. Retry after fixing logs.';
      default: return 'Select build type and start';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-zinc-900/80 border-emerald-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            Mobile App Generator
          </CardTitle>
          <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/50">
            Exclusive Feature
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Build Types */}
        <div className="grid grid-cols-2 gap-2">
          {buildTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              disabled={buildStatus !== 'idle' && buildStatus !== 'complete'}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                selectedType === type.id
                  ? "bg-emerald-500/20 border-emerald-500/50"
                  : "bg-muted/10 border-border/50 hover:border-emerald-500/30"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <type.icon className={cn(
                  "w-4 h-4",
                  selectedType === type.id ? "text-emerald-400" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  selectedType === type.id ? "text-white" : "text-muted-foreground"
                )}>
                  {type.label}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{type.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Security Features */}
        <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">Security Features</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Key className="w-3 h-3" />
              Internal Signing
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              License Lock
            </div>
            <div className="flex items-center gap-1">
              <Fingerprint className="w-3 h-3" />
              Anti-Tamper
            </div>
          </div>
        </div>

        {/* Build Progress */}
        <AnimatePresence mode="wait">
          {buildStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{getStatusMessage()}</span>
                {buildStatus === 'pending-approval' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : buildStatus === 'complete' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : buildStatus === 'failed' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                )}
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {buildStatus === 'complete' ? (
          <Button 
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white"
            onClick={() => toast.success('Download started!')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download {selectedType.toUpperCase()}
          </Button>
        ) : buildStatus === 'pending-approval' ? (
          <Button variant="outline" className="w-full" disabled>
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-400" />
            Awaiting Approval
          </Button>
        ) : buildStatus === 'failed' ? (
          <Button variant="outline" className="w-full" onClick={startBuild}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Build
          </Button>
        ) : buildStatus !== 'idle' ? (
          <Button variant="outline" className="w-full" disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Building...
          </Button>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white"
            onClick={startBuild}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Generate Mobile App
          </Button>
        )}

        {/* Info Text */}
        <p className="text-[10px] text-center text-muted-foreground">
          User just says "Make Android app" — System does everything else
        </p>
      </CardContent>
    </Card>
  );
};
