import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Globe, User, Mail, Phone, Code2, Github, 
  CheckCircle, AlertCircle, Copy, Eye, EyeOff, Loader2,
  RefreshCw, ExternalLink, Shield, Key, Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Deployment {
  id: string;
  client_name: string;
  client_email: string;
  subdomain: string;
  deploy_url: string;
  status: string;
  created_at: string;
  client_username: string;
}

interface DeployCredentials {
  username: string;
  password: string;
}

const PMDeployScreen = () => {
  const [tab, setTab] = useState<'deploy' | 'history'>('deploy');
  
  // Deploy form
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [notes, setNotes] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  // History
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadDeployments = async () => {
    setLoadingHistory(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deploy-client-project`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ action: 'list' }),
        }
      );

      const data = await response.json();
      if (data.deployments) {
        setDeployments(data.deployments);
      }
    } catch (err) {
      console.error('Failed to load deployments:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (tab === 'history') loadDeployments();
  }, [tab]);

  const handleDeploy = async () => {
    if (!clientName || !clientEmail || !subdomain) {
      toast.error('Client name, email, and subdomain are required');
      return;
    }

    if (!githubRepo && !sourceCode) {
      toast.error('Either GitHub repo URL or source code is required');
      return;
    }

    setDeploying(true);
    setDeployResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deploy-client-project`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            action: 'deploy',
            clientName,
            clientEmail,
            clientPhone,
            subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
            githubRepoUrl: githubRepo,
            sourceCode,
            notes,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setDeployResult(data.deployment);
        toast.success(`🚀 Deployment created for ${clientName}!`);
        // Reset form
        setClientName('');
        setClientEmail('');
        setClientPhone('');
        setSubdomain('');
        setGithubRepo('');
        setSourceCode('');
        setNotes('');
      } else {
        toast.error(data.error || 'Deployment failed');
      }
    } catch (err) {
      toast.error('Network error — please try again');
    } finally {
      setDeploying(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ready': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-6 h-6 text-emerald-400" />
            Client Deploy Center
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Source code deploy → Live subdomain → Auto credentials
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={tab === 'deploy' ? 'default' : 'outline'}
            onClick={() => setTab('deploy')}
            size="sm"
          >
            <Rocket className="w-4 h-4 mr-1" /> New Deploy
          </Button>
          <Button
            variant={tab === 'history' ? 'default' : 'outline'}
            onClick={() => setTab('history')}
            size="sm"
          >
            <Server className="w-4 h-4 mr-1" /> Deployments
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'deploy' && (
          <motion.div
            key="deploy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left: Deploy Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Client Details</CardTitle>
                <CardDescription>Enter client info + source code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Client Name *</label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="John Doe"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="client@email.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="pl-9"
                        type="email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="+91 9876543210"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Subdomain *</label>
                    <div className="relative">
                      <Globe className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="clientname"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="pl-9"
                      />
                    </div>
                    {subdomain && (
                      <p className="text-xs text-emerald-400 mt-1">
                        → {subdomain}.softwarewala.net
                      </p>
                    )}
                  </div>
                </div>

                {/* Source */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">GitHub Repo URL</label>
                  <div className="relative">
                    <Github className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://github.com/BOSSsoftwarevala/project-name"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Code2 className="w-3 h-3" /> Source Code (paste here)
                  </label>
                  <Textarea
                    placeholder="Paste your source code, build config, or deployment script here..."
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                  <Input
                    placeholder="Any special instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleDeploy}
                  disabled={deploying || !clientName || !clientEmail || !subdomain}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white"
                  size="lg"
                >
                  {deploying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Deploy & Generate Credentials
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Right: Result */}
            <div className="space-y-4">
              {deployResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-emerald-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Deployment Created!
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* URL */}
                      <div className="bg-background/50 rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Live URL</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-emerald-400 flex-1">{deployResult.url}</code>
                          <Button size="icon" variant="ghost" className="h-7 w-7"
                            onClick={() => copyToClipboard(deployResult.url, 'URL')}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7"
                            onClick={() => window.open(deployResult.url, '_blank')}>
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Credentials */}
                      <div className="bg-background/50 rounded-lg p-3 border border-amber-500/20">
                        <p className="text-xs text-amber-400 mb-2 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Client Credentials
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Username:</span>
                            <div className="flex items-center gap-1">
                              <code className="text-sm text-foreground">{deployResult.credentials.username}</code>
                              <Button size="icon" variant="ghost" className="h-6 w-6"
                                onClick={() => copyToClipboard(deployResult.credentials.username, 'Username')}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Password:</span>
                            <div className="flex items-center gap-1">
                              <code className="text-sm text-foreground">
                                {showPassword ? deployResult.credentials.password : '••••••••••'}
                              </code>
                              <Button size="icon" variant="ghost" className="h-6 w-6"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6"
                                onClick={() => copyToClipboard(deployResult.credentials.password, 'Password')}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <Badge className={statusColor(deployResult.status)}>
                          {deployResult.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{deployResult.message}</span>
                      </div>

                      {/* Copy All */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const text = `🔗 URL: ${deployResult.url}\n👤 Username: ${deployResult.credentials.username}\n🔑 Password: ${deployResult.credentials.password}`;
                          copyToClipboard(text, 'All credentials');
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All (URL + Credentials)
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="bg-card/50 border-border border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Rocket className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Ready to Deploy</h3>
                    <p className="text-sm text-muted-foreground/60 mt-1 max-w-xs">
                      Fill client details and paste source code → credentials will auto-generate here
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="bg-card border-border">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Auto Credentials</p>
                    </div>
                    <div>
                      <Globe className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">VPS Subdomain</p>
                    </div>
                    <div>
                      <Server className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Hostinger Deploy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {tab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Deployment History</CardTitle>
                  <CardDescription>{deployments.length} total deployments</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadDeployments} disabled={loadingHistory}>
                  <RefreshCw className={`w-4 h-4 mr-1 ${loadingHistory ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : deployments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Server className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No deployments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deployments.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-border/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{d.client_name}</p>
                            <p className="text-xs text-muted-foreground">{d.subdomain}.softwarewala.net</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusColor(d.status)}>
                            {d.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(d.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PMDeployScreen;
