import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Mic, Sparkles, Loader2, X, FileUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface RequirementInputProps {
  onSubmit: (requirement: string, projectType?: string) => Promise<void>;
  isLoading: boolean;
}

const PROJECT_TYPES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'erp', label: 'ERP System' },
  { value: 'crm', label: 'CRM System' },
  { value: 'pos', label: 'POS System' },
  { value: 'healthcare', label: 'Healthcare Software' },
  { value: 'education', label: 'Education Software' },
];

export function RequirementInput({ onSubmit, isLoading }: RequirementInputProps) {
  const [requirement, setRequirement] = useState('');
  const [projectType, setProjectType] = useState('auto');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!requirement.trim()) {
      toast.error('Please enter your requirement');
      return;
    }
    await onSubmit(requirement, projectType === 'auto' ? undefined : projectType);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    // Read text files directly
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const text = await file.text();
      setRequirement(prev => prev + (prev ? '\n\n' : '') + text);
      toast.success('File content added');
    } else {
      toast.info('File attached. AI will analyze it with your description.');
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Voice input failed');
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRequirement(prev => prev + (prev ? ' ' : '') + transcript);
      toast.success('Voice input added');
    };

    recognition.start();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="w-5 h-5 text-primary" />
          Describe Your Software Requirement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Type Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Project Type:</span>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Input */}
        <Textarea
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder={`Describe what you want to build in plain language...

Example: "I need a hospital management system with patient registration, appointment booking, doctor scheduling, billing with GST, pharmacy inventory, and lab reports. It should have a mobile app for patients to book appointments and view their reports. Admin should be able to generate reports and manage staff."`}
          className="min-h-[200px] bg-background border-input"
        />

        {/* Attached File Badge */}
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <Badge variant="secondary" className="flex items-center gap-2">
              <FileUp className="w-3 h-3" />
              {uploadedFile.name}
              <button onClick={removeFile} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.doc,.docx,.pdf"
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>

          <Button
            variant="outline"
            onClick={handleVoiceInput}
            disabled={isLoading || isRecording}
            className={isRecording ? 'animate-pulse border-destructive' : ''}
          >
            <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-destructive' : ''}`} />
            {isRecording ? 'Recording...' : 'Voice Input'}
          </Button>

          <div className="flex-1" />

          <Button
            onClick={handleSubmit}
            disabled={!requirement.trim() || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze & Generate Specs
              </>
            )}
          </Button>
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tips:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-0.5">
            <li>Be specific about user roles and permissions</li>
            <li>Mention any integrations (payment, SMS, email)</li>
            <li>Specify if mobile app is needed</li>
            <li>Include compliance requirements (GST, HIPAA, etc.)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
