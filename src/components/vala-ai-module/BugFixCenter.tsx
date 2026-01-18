/**
 * BUG FIX CENTER
 * AI-powered bug detection and auto-fix
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bug, 
  Upload, 
  Image, 
  FileText,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Eye,
  Bot,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BugReport {
  id: string;
  title: string;
  status: 'fixed' | 'pending' | 'analyzing';
  project: string;
  fixedAt?: string;
}

const recentBugs: BugReport[] = [
  { id: '1', title: 'Login button not responding on mobile', status: 'fixed', project: 'CRM-Pro', fixedAt: '5 min ago' },
  { id: '2', title: 'Cart total calculation error', status: 'fixed', project: 'Shop-Demo', fixedAt: '15 min ago' },
  { id: '3', title: 'Dashboard chart not loading', status: 'analyzing', project: 'Analytics-Hub' },
  { id: '4', title: 'Form validation bypass issue', status: 'pending', project: 'CRM-Pro' },
];

export const BugFixCenter: React.FC = () => {
  const [bugDescription, setBugDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmitBug = async () => {
    if (!bugDescription.trim() && uploadedFiles.length === 0) {
      toast.error('Please describe the issue or upload a screenshot');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    toast.success('Bug analyzed and fix applied!');
    setBugDescription('');
    setUploadedFiles([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-400" />
            Bug Fix Center
          </h1>
          <p className="text-sm text-muted-foreground">AI-powered auto-fix system</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          12 bugs fixed today
        </Badge>
      </div>

      {/* Report Bug */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <Bug className="w-4 h-4" />
            <span className="text-sm font-medium">Report a Bug</span>
          </div>

          <Textarea
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            placeholder="Describe the issue...&#10;&#10;Example: The login button doesn't work when clicked on mobile devices"
            className="min-h-[100px] bg-background/50 border-border/50 resize-none"
          />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
              <Image className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Screenshot</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".png,.jpg,.jpeg,.gif"
                onChange={handleFileUpload}
              />
            </label>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Error Log</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".txt,.log,.json"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <Badge key={index} variant="secondary">
                  {file.name}
                </Badge>
              ))}
            </div>
          )}

          <Button 
            onClick={handleSubmitBug}
            disabled={isAnalyzing}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing & Fixing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Auto Fix with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Fix Process */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card/80 border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Bot className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="font-medium text-foreground">AI is working...</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Root cause analysis complete
                </p>
                <p className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  Applying fix...
                </p>
                <p className="flex items-center gap-2 text-muted-foreground/50">
                  <span className="w-4 h-4" />
                  Retesting all buttons...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Bugs */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Bug Fixes</h3>
          
          <div className="space-y-3">
            {recentBugs.map((bug, index) => (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    bug.status === 'fixed' ? 'bg-emerald-500/20' : 
                    bug.status === 'analyzing' ? 'bg-blue-500/20' : 'bg-amber-500/20'
                  )}>
                    {bug.status === 'fixed' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : bug.status === 'analyzing' ? (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{bug.title}</p>
                    <p className="text-xs text-muted-foreground">{bug.project}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {bug.fixedAt && (
                    <span className="text-xs text-emerald-400">{bug.fixedAt}</span>
                  )}
                  <Badge className={cn(
                    "text-xs",
                    bug.status === 'fixed' ? 'bg-emerald-500/20 text-emerald-400' :
                    bug.status === 'analyzing' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                  )}>
                    {bug.status === 'fixed' ? 'Fixed' : bug.status === 'analyzing' ? 'Analyzing' : 'Needs Review'}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-7">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
