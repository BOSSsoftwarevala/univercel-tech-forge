import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Layers, FileText, MessageSquare, Send, 
  Loader2, CheckCircle, Server, Link2, Rocket, Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { z } from 'zod';

// Validation schema
const suggestionSchema = z.object({
  domainName: z.string().min(3, 'Domain must be at least 3 characters').max(255, 'Domain too long'),
  featureRequests: z.string().max(2000, 'Feature requests too long').optional(),
  notes: z.string().max(1000, 'Notes too long').optional()
});

interface SuggestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  demo: { id: string; title: string } | null;
  isUpdateRequest?: boolean;
  parentSuggestionId?: string;
}

const availableModules = [
  'User Management',
  'Payment Gateway',
  'Analytics Dashboard',
  'Inventory System',
  'CRM Module',
  'Email Integration',
  'API Access',
  'Multi-language',
  'Mobile App',
  'Reporting',
  'Notifications',
  'Custom Branding'
];

interface SetupProgress {
  domainConnected: boolean;
  serverLinked: boolean;
  setupStarted: boolean;
  estimatedTime: string;
  assignedServer: string;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({
  isOpen,
  onClose,
  demo,
  isUpdateRequest = false,
  parentSuggestionId
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'complete'>('form');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [domainName, setDomainName] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [featureRequests, setFeatureRequests] = useState('');
  const [notes, setNotes] = useState('');
  
  // Auto-captured data
  const [userIP, setUserIP] = useState('');
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  
  // Progress state
  const [progress, setProgress] = useState<SetupProgress>({
    domainConnected: false,
    serverLinked: false,
    setupStarted: false,
    estimatedTime: '',
    assignedServer: ''
  });
  
  const [suggestionId, setSuggestionId] = useState<string | null>(null);

  // Fetch user IP on mount
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        setUserIP('Unknown');
      }
    };
    fetchIP();
  }, []);

  // Poll for progress updates
  useEffect(() => {
    if (step !== 'processing' || !suggestionId) return;

    const pollProgress = async () => {
      const { data } = await supabase
        .from('demo_suggestions')
        .select('*')
        .eq('id', suggestionId)
        .single();

      if (data) {
        setProgress({
          domainConnected: data.domain_connected || false,
          serverLinked: data.server_linked || false,
          setupStarted: data.setup_started || false,
          estimatedTime: data.estimated_completion 
            ? format(new Date(data.estimated_completion), 'h:mm a') 
            : '',
          assignedServer: data.assigned_server || ''
        });

        // Simulate progress steps
        if (!data.domain_connected) {
          setTimeout(async () => {
            await supabase
              .from('demo_suggestions')
              .update({ domain_connected: true, domain_connected_at: new Date().toISOString() })
              .eq('id', suggestionId);
          }, 2000);
        } else if (!data.server_linked) {
          setTimeout(async () => {
            await supabase
              .from('demo_suggestions')
              .update({ server_linked: true, server_linked_at: new Date().toISOString() })
              .eq('id', suggestionId);
          }, 2000);
        } else if (!data.setup_started) {
          setTimeout(async () => {
            await supabase
              .from('demo_suggestions')
              .update({ 
                setup_started: true, 
                setup_started_at: new Date().toISOString(),
                setup_status: 'in_progress'
              })
              .eq('id', suggestionId);
          }, 2000);
        } else {
          setStep('complete');
        }
      }
    };

    const interval = setInterval(pollProgress, 1500);
    return () => clearInterval(interval);
  }, [step, suggestionId]);

  const validateForm = (): boolean => {
    try {
      suggestionSchema.parse({ domainName, featureRequests, notes });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!demo) return;

    setLoading(true);
    setSubmittedAt(new Date());

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('demo_suggestions')
        .insert({
          demo_id: demo.id,
          demo_name: demo.title,
          user_id: user?.id || null,
          domain_name: domainName.trim(),
          required_modules: selectedModules,
          feature_requests: featureRequests.trim() || null,
          notes: notes.trim() || null,
          user_ip: userIP,
          is_update_request: isUpdateRequest,
          parent_suggestion_id: parentSuggestionId || null
        })
        .select()
        .single();

      if (error) throw error;

      setSuggestionId(data.id);
      setProgress({
        ...progress,
        assignedServer: data.assigned_server || '',
        estimatedTime: data.estimated_completion 
          ? format(new Date(data.estimated_completion), 'h:mm a')
          : ''
      });
      
      setStep('processing');
      toast.success('Suggestion submitted successfully!');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit suggestion');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (module: string) => {
    setSelectedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handleClose = () => {
    setStep('form');
    setDomainName('');
    setSelectedModules([]);
    setFeatureRequests('');
    setNotes('');
    setSuggestionId(null);
    setProgress({
      domainConnected: false,
      serverLinked: false,
      setupStarted: false,
      estimatedTime: '',
      assignedServer: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {isUpdateRequest ? 'Update Request' : 'Setup Suggestion'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {demo?.title || 'Demo'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {step === 'form' && (
              <div className="space-y-6">
                {/* Auto-captured info */}
                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    IP: {userIP || 'Loading...'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(), 'MMM dd, yyyy h:mm a')}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                    {demo?.title}
                  </Badge>
                </div>

                {/* Domain Name */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Domain Name *
                  </Label>
                  <Input
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="yourdomain.com"
                    className={errors.domainName ? 'border-red-500' : ''}
                  />
                  {errors.domainName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.domainName}
                    </p>
                  )}
                </div>

                {/* Required Modules */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Required Modules
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableModules.map((module) => (
                      <label
                        key={module}
                        className={`
                          flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                          ${selectedModules.includes(module)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                          }
                        `}
                      >
                        <Checkbox
                          checked={selectedModules.includes(module)}
                          onCheckedChange={() => toggleModule(module)}
                        />
                        <span className="text-sm">{module}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Feature Requests */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Feature Requests
                  </Label>
                  <Textarea
                    value={featureRequests}
                    onChange={(e) => setFeatureRequests(e.target.value)}
                    placeholder="Describe any custom features you need..."
                    rows={3}
                    className={errors.featureRequests ? 'border-red-500' : ''}
                  />
                  {errors.featureRequests && (
                    <p className="text-xs text-red-500">{errors.featureRequests}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Additional Notes
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any other information..."
                    rows={2}
                    className={errors.notes ? 'border-red-500' : ''}
                  />
                  {errors.notes && (
                    <p className="text-xs text-red-500">{errors.notes}</p>
                  )}
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="space-y-6 py-8">
                <div className="text-center mb-8">
                  <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-semibold">Processing Your Request</h3>
                  <p className="text-sm text-muted-foreground">
                    Auto-configuring your setup...
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-4">
                  <ProgressStep
                    icon={Link2}
                    label="Domain Connected"
                    sublabel={domainName}
                    completed={progress.domainConnected}
                    active={!progress.domainConnected}
                  />
                  <ProgressStep
                    icon={Server}
                    label="Server Linked"
                    sublabel={progress.assignedServer}
                    completed={progress.serverLinked}
                    active={progress.domainConnected && !progress.serverLinked}
                  />
                  <ProgressStep
                    icon={Rocket}
                    label="Setup Started"
                    sublabel={`Estimated completion: ${progress.estimatedTime}`}
                    completed={progress.setupStarted}
                    active={progress.serverLinked && !progress.setupStarted}
                  />
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Setup Complete!</h3>
                <p className="text-muted-foreground mb-6">
                  Your demo is being prepared on <span className="text-primary font-medium">{progress.assignedServer}</span>
                </p>
                
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 max-w-sm mx-auto">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domain:</span>
                      <span className="text-foreground font-medium">{domainName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Server:</span>
                      <span className="text-foreground font-medium">{progress.assignedServer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modules:</span>
                      <span className="text-foreground font-medium">{selectedModules.length}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-6">
                  Use this same form to submit update requests later.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-secondary/30">
            {step === 'form' && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !domainName}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Suggestion
                </Button>
              </div>
            )}
            
            {step === 'complete' && (
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Progress Step Component
interface ProgressStepProps {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  completed: boolean;
  active: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  icon: Icon,
  label,
  sublabel,
  completed,
  active
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`
      flex items-center gap-4 p-4 rounded-xl border transition-all
      ${completed 
        ? 'bg-green-500/10 border-green-500/30' 
        : active 
          ? 'bg-primary/10 border-primary/30' 
          : 'bg-secondary/50 border-border'
      }
    `}
  >
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center
      ${completed 
        ? 'bg-green-500 text-white' 
        : active 
          ? 'bg-primary text-white' 
          : 'bg-secondary text-muted-foreground'
      }
    `}>
      {completed ? (
        <CheckCircle className="w-5 h-5" />
      ) : active ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
    </div>
    <div className="flex-1">
      <p className={`font-medium ${completed ? 'text-green-500' : active ? 'text-primary' : 'text-muted-foreground'}`}>
        {label}
      </p>
      {sublabel && (
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      )}
    </div>
    {completed && (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        Done
      </Badge>
    )}
  </motion.div>
);

export default SuggestionForm;
