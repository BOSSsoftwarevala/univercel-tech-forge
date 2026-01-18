/**
 * VALA AI - NEW PROJECT
 * Full page for starting a new AI project
 * Input types: Text, File, Image, Video, Voice
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Plus, FileText, Image, Video, Mic, Upload, 
  Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type InputType = 'text' | 'file' | 'image' | 'video' | 'voice';

interface AttachedFile {
  name: string;
  type: InputType;
  size: string;
}

const inputTypes = [
  { id: 'text', label: 'Text Description', icon: FileText, active: true },
  { id: 'file', label: 'PDF / DOC', icon: Upload, active: true },
  { id: 'image', label: 'Image', icon: Image, active: true },
  { id: 'video', label: 'Video', icon: Video, active: true },
  { id: 'voice', label: 'Voice Note', icon: Mic, active: true },
] as const;

const projectTemplates = [
  { id: 'webapp', label: 'Web Application', description: 'Full-stack web app with auth, database, and API' },
  { id: 'dashboard', label: 'Dashboard', description: 'Analytics dashboard with charts and reports' },
  { id: 'ecommerce', label: 'E-Commerce', description: 'Online store with products, cart, and checkout' },
  { id: 'mobile', label: 'Mobile App UI', description: 'Mobile-first responsive application' },
  { id: 'api', label: 'API Service', description: 'Backend API with endpoints and documentation' },
  { id: 'custom', label: 'Custom Project', description: 'Describe your own project from scratch' },
];

export const ValaAINewProject: React.FC = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!projectDescription.trim() && attachedFiles.length === 0) {
      toast.error('Please provide a description or attach files');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Project submitted to AI for processing', {
      description: 'You will be notified when the build starts'
    });
    
    setIsSubmitting(false);
    setProjectDescription('');
    setSelectedTemplate(null);
    setAttachedFiles([]);
  };

  const handleFileAttach = (type: InputType) => {
    // Simulate file attachment
    const mockFile: AttachedFile = {
      name: `attachment_${Date.now()}.${type === 'file' ? 'pdf' : type === 'image' ? 'png' : type === 'video' ? 'mp4' : 'wav'}`,
      type,
      size: `${Math.floor(Math.random() * 10) + 1}MB`
    };
    setAttachedFiles([...attachedFiles, mockFile]);
    toast.success(`${type} attached successfully`);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Plus className="w-6 h-6 text-primary" />
          New Project
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tell VALA AI what you want to build or fix
        </p>
      </div>

      {/* Quick Templates */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Quick Start Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {projectTemplates.map((template) => (
              <motion.button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 hover:border-border hover:bg-muted/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="font-medium text-sm text-foreground">{template.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Input */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Project Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe what you want to build, fix, or improve. Be as detailed as possible..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="min-h-[160px] resize-none"
          />
          
          {/* Input Type Buttons */}
          <div className="flex flex-wrap gap-2">
            {inputTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleFileAttach(type.id as InputType)}
                >
                  <Icon className="w-3 h-3" />
                  {type.label}
                </Button>
              );
            })}
          </div>

          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Attached Files:</p>
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => removeFile(idx)}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {file.name} ({file.size})
                    <span className="text-destructive ml-1">×</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Processing Note */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">AI Processing</p>
              <p className="text-muted-foreground text-xs mt-1">
                VALA AI will analyze your request and may ask for additional information if needed. 
                Changes impacting server, cost, license, or security will require Boss approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="w-full gap-2"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4" />
            </motion.div>
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Submit to VALA AI
          </>
        )}
      </Button>
    </div>
  );
};
