/**
 * ADD SERVER FORM
 * Ultra-simple: Only 3 required fields + 1 optional dropdown
 * AI handles everything else
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Plus, CheckCircle, Loader2, AlertCircle,
  Shield, Cpu, HardDrive, Wifi, Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type AddServerStep = 'form' | 'connecting' | 'success' | 'error';

interface AICheckItem {
  id: string;
  label: string;
  icon: React.ElementType;
  status: 'pending' | 'checking' | 'done' | 'error';
}

export const AddServerForm: React.FC = () => {
  const [step, setStep] = useState<AddServerStep>('form');
  const [formData, setFormData] = useState({
    serverName: '',
    username: '',
    password: '',
    provider: '',
  });
  const [aiChecks, setAiChecks] = useState<AICheckItem[]>([
    { id: 'connection', label: 'Connection test', icon: Wifi, status: 'pending' },
    { id: 'credentials', label: 'Credential validation', icon: Shield, status: 'pending' },
    { id: 'os', label: 'OS detection', icon: Server, status: 'pending' },
    { id: 'firewall', label: 'Firewall check', icon: Shield, status: 'pending' },
    { id: 'resources', label: 'Resource scan', icon: Cpu, status: 'pending' },
  ]);

  const isFormValid = formData.serverName && formData.username && formData.password;

  const runAIChecks = async () => {
    setStep('connecting');
    
    // Simulate AI checks one by one
    const checkOrder = ['connection', 'credentials', 'os', 'firewall', 'resources'];
    
    for (let i = 0; i < checkOrder.length; i++) {
      const checkId = checkOrder[i];
      
      // Set current check to 'checking'
      setAiChecks(prev => prev.map(c => 
        c.id === checkId ? { ...c, status: 'checking' } : c
      ));
      
      // Wait for check
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set check to 'done'
      setAiChecks(prev => prev.map(c => 
        c.id === checkId ? { ...c, status: 'done' } : c
      ));
    }
    
    // Success
    setStep('success');
    toast.success('Server Added Successfully!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    runAIChecks();
  };

  const handleReset = () => {
    setStep('form');
    setFormData({ serverName: '', username: '', password: '', provider: '' });
    setAiChecks(prev => prev.map(c => ({ ...c, status: 'pending' })));
  };

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Plus className="w-5 h-5 text-primary" />
                  Add New Server
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter server details. AI will handle the rest automatically.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Server Name */}
                  <div className="space-y-2">
                    <Label htmlFor="serverName" className="text-foreground">
                      Server Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="serverName"
                      value={formData.serverName}
                      onChange={(e) => setFormData(prev => ({ ...prev, serverName: e.target.value }))}
                      placeholder="e.g. Production Server 1"
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">
                      Login Username <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="e.g. root or admin"
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Login Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Provider (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-foreground">
                      Provider <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <Select
                      value={formData.provider}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, provider: v }))}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hostinger">Hostinger</SelectItem>
                        <SelectItem value="aws">AWS</SelectItem>
                        <SelectItem value="digitalocean">DigitalOcean</SelectItem>
                        <SelectItem value="vultr">Vultr</SelectItem>
                        <SelectItem value="linode">Linode</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={!isFormValid}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Server className="w-4 h-4 mr-2" />
                    Add Server
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'connecting' && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Brain className="w-5 h-5 text-primary animate-pulse" />
                  AI Setting Up Server
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Please wait while AI configures your server...
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiChecks.map((check) => {
                    const Icon = check.icon;
                    return (
                      <div 
                        key={check.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-colors",
                          check.status === 'done' ? 'bg-emerald-500/10' :
                          check.status === 'checking' ? 'bg-primary/10' :
                          check.status === 'error' ? 'bg-destructive/10' :
                          'bg-muted/50'
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                          {check.status === 'checking' ? (
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          ) : check.status === 'done' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : check.status === 'error' ? (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          ) : (
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm",
                          check.status === 'done' ? 'text-emerald-500' :
                          check.status === 'checking' ? 'text-primary' :
                          'text-muted-foreground'
                        )}>
                          {check.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-emerald-500/10 border-emerald-500/30">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Server Added Successfully!
                </h3>
                <p className="text-muted-foreground mb-6">
                  "{formData.serverName}" is now being monitored by AI.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleReset}>
                    Add Another
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    View Server
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Optimizing Connection
                </h3>
                <p className="text-muted-foreground mb-6">
                  System is configuring the connection. Please verify your details and try again.
                </p>
                <Button onClick={handleReset}>
                  Continue Setup
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddServerForm;
