/**
 * START NEW BUILD
 * Core feature - One input box for all build types
 * AI auto-builds based on input
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Upload, 
  Image, 
  FileText, 
  Loader2,
  CheckCircle,
  Sparkles,
  Clock,
  Code,
  Layers,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type BuildPhase = 'input' | 'analyzing' | 'confirm' | 'building' | 'complete';

interface AIAnalysis {
  projectType: string;
  coreFeatures: string[];
  optionalFeatures: string[];
  buildType: 'demo' | 'product';
  estimatedTime: string;
}

export const StartNewBuild: React.FC = () => {
  const [phase, setPhase] = useState<BuildPhase>('input');
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [buildProgress, setBuildProgress] = useState(0);

  const handleStartBuild = async () => {
    if (!inputText.trim() && uploadedFiles.length === 0) {
      toast.error('Please describe what you want to build or upload a file');
      return;
    }

    setPhase('analyzing');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAnalysis({
      projectType: 'CRM Dashboard',
      coreFeatures: ['User Management', 'Lead Tracking', 'Analytics Dashboard', 'Email Integration'],
      optionalFeatures: ['AI Insights', 'Mobile App', 'Custom Reports'],
      buildType: 'demo',
      estimatedTime: '~15 minutes'
    });
    
    setPhase('confirm');
  };

  const handleConfirmBuild = async () => {
    setPhase('building');
    
    // Simulate build progress
    const stages = [0, 20, 40, 60, 80, 100];
    for (const progress of stages) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBuildProgress(progress);
    }
    
    setPhase('complete');
    toast.success('Build completed successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded`);
  };

  const resetBuild = () => {
    setPhase('input');
    setInputText('');
    setUploadedFiles([]);
    setAnalysis(null);
    setBuildProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Start New Build
        </h1>
        <p className="text-sm text-muted-foreground">One input → Full AI build</p>
      </div>

      <AnimatePresence mode="wait">
        {/* INPUT PHASE */}
        {phase === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Tell us what to build or fix</span>
                </div>
                
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe your project, feature, or issue...&#10;&#10;Examples:&#10;• Build a CRM with lead tracking and email integration&#10;• Fix the login button not working on mobile&#10;• Create a demo for restaurant management"
                  className="min-h-[160px] bg-background/50 border-border/50 text-foreground resize-none"
                />

                {/* File Upload Area */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload File</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <span className="text-xs text-muted-foreground">PDF, DOC, Image, or ZIP</span>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={handleStartBuild}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Build
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ANALYZING PHASE */}
        {phase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Bot className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mt-4">AI Analyzing...</h3>
                <p className="text-sm text-muted-foreground mt-2">Understanding your requirements</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CONFIRM PHASE */}
        {phase === 'confirm' && analysis && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">AI Understanding</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-xs text-muted-foreground">Project Type</p>
                    <p className="text-sm font-medium text-foreground mt-1">{analysis.projectType}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-xs text-muted-foreground">Build Type</p>
                    <Badge className={cn(
                      "mt-1",
                      analysis.buildType === 'demo' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    )}>
                      {analysis.buildType === 'demo' ? 'Demo' : 'Product'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Core Features</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.coreFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Optional Features</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.optionalFeatures.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-muted-foreground border-border/50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Estimated Time: <strong className="text-foreground">{analysis.estimatedTime}</strong></span>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleConfirmBuild}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={resetBuild}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* BUILDING PHASE */}
        {phase === 'building' && (
          <motion.div
            key="building"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Building...</h3>
                  <span className="text-2xl font-bold text-primary">{buildProgress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${buildProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Build Stages */}
                <div className="space-y-3">
                  {[
                    { progress: 0, label: 'Project Created', icon: Layers },
                    { progress: 20, label: 'Structure Ready', icon: Code },
                    { progress: 40, label: 'Features Added', icon: Sparkles },
                    { progress: 60, label: 'AI / API Integrated', icon: Bot },
                    { progress: 80, label: 'Testing & Fix', icon: CheckCircle },
                    { progress: 100, label: 'Ready', icon: Rocket },
                  ].map((stage) => {
                    const isComplete = buildProgress >= stage.progress;
                    const isActive = buildProgress === stage.progress;
                    const Icon = stage.icon;
                    
                    return (
                      <div 
                        key={stage.progress}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg transition-all",
                          isActive && "bg-primary/10 border border-primary/30",
                          isComplete && !isActive && "opacity-50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          isComplete ? "bg-emerald-500/20" : "bg-muted/50"
                        )}>
                          {isComplete ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : isActive ? (
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          ) : (
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm",
                          isComplete ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-card/80 border-emerald-500/30">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mt-4">Build Complete!</h3>
                <p className="text-sm text-muted-foreground mt-2">Your project is ready for review</p>
                
                <div className="flex gap-3 mt-6">
                  <Button className="bg-primary hover:bg-primary/90">
                    View Project
                  </Button>
                  <Button variant="outline" onClick={resetBuild}>
                    Start Another Build
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
