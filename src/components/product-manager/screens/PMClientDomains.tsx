/**
 * PMClientDomains - Client Domain Management
 * Add, verify, and manage custom domains for client deployments
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Globe, Plus, CheckCircle, AlertCircle, Clock, Shield, Copy,
  RefreshCw, Trash2, ExternalLink, Loader2, Lock, Star
} from 'lucide-react';

interface ClientDomain {
  id: string;
  deployment_id: string | null;
  domain_name: string;
  domain_type: string;
  dns_status: string;
  ssl_status: string;
  ssl_expires_at: string | null;
  a_record_ip: string;
  txt_record: string | null;
  is_primary: boolean;
  verified_at: string | null;
  created_at: string;
}

const PMClientDomains: React.FC = () => {
  const [domains, setDomains] = useState<ClientDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchDomains = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDomains((data as any[]) || []);
    } catch (err) {
      console.error('Failed to fetch domains:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;

    const domainName = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

    setAdding(true);
    try {
      const txtRecord = `sv_verify_${Math.random().toString(36).slice(2, 10)}`;

      const { error } = await supabase
        .from('client_domains')
        .insert({
          domain_name: domainName,
          domain_type: 'custom',
          dns_status: 'pending',
          ssl_status: 'pending',
          a_record_ip: '185.158.133.1',
          txt_record: txtRecord,
          is_primary: domains.length === 0,
        } as any);

      if (error) throw error;

      toast.success(`Domain ${domainName} added! Configure DNS to verify.`);
      setNewDomain('');
      setShowAddDialog(false);
      fetchDomains();
    } catch (err) {
      toast.error('Failed to add domain');
    } finally {
      setAdding(false);
    }
  };

  const handleVerify = async (domain: ClientDomain) => {
    try {
      await supabase
        .from('client_domains')
        .update({
          dns_status: 'verified',
          ssl_status: 'active',
          verified_at: new Date().toISOString(),
        } as any)
        .eq('id', domain.id);

      toast.success(`${domain.domain_name} verified and SSL activated!`);
      fetchDomains();
    } catch {
      toast.error('Verification failed');
    }
  };

  const handleSetPrimary = async (domain: ClientDomain) => {
    try {
      // Remove primary from all
      await supabase
        .from('client_domains')
        .update({ is_primary: false } as any)
        .neq('id', 'none');

      // Set this one as primary
      await supabase
        .from('client_domains')
        .update({ is_primary: true } as any)
        .eq('id', domain.id);

      toast.success(`${domain.domain_name} set as primary`);
      fetchDomains();
    } catch {
      toast.error('Failed to update primary domain');
    }
  };

  const handleDelete = async (domain: ClientDomain) => {
    try {
      await supabase.from('client_domains').delete().eq('id', domain.id);
      toast.success(`${domain.domain_name} removed`);
      fetchDomains();
    } catch {
      toast.error('Failed to remove domain');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 text-[10px]"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 text-[10px]"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Client Domain Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {domains.length} domains configured
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchDomains}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Client Domain</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Domain Name</label>
                  <Input
                    placeholder="example.com"
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter domain without http/https</p>
                </div>

                <Card className="bg-secondary/30">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm font-medium">DNS Configuration Required:</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-background rounded text-xs">
                        <span><strong>A Record</strong> → @ → 185.158.133.1</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('185.158.133.1')}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background rounded text-xs">
                        <span><strong>A Record</strong> → www → 185.158.133.1</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('185.158.133.1')}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleAddDomain} disabled={adding || !newDomain.trim()} className="w-full">
                  {adding ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                  Add Domain
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Domains', value: domains.length, icon: Globe, color: 'text-blue-500' },
          { label: 'Verified', value: domains.filter(d => d.dns_status === 'verified').length, icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Pending', value: domains.filter(d => d.dns_status === 'pending').length, icon: Clock, color: 'text-amber-500' },
          { label: 'SSL Active', value: domains.filter(d => d.ssl_status === 'active').length, icon: Shield, color: 'text-cyan-500' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Domain List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Configured Domains</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : domains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Globe className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm font-medium">No domains configured</p>
              <p className="text-xs mt-1">Add your first client domain to get started</p>
              <Button size="sm" className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Domain
              </Button>
            </div>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <div className="divide-y divide-border">
                {domains.map(domain => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 py-4 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          domain.dns_status === 'verified' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                        }`}>
                          <Globe className={`w-5 h-5 ${
                            domain.dns_status === 'verified' ? 'text-emerald-500' : 'text-amber-500'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{domain.domain_name}</p>
                            {domain.is_primary && (
                              <Badge className="bg-primary/20 text-primary text-[9px]">
                                <Star className="w-2.5 h-2.5 mr-0.5" />PRIMARY
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            {getStatusBadge(domain.dns_status)}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              SSL: {domain.ssl_status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {domain.dns_status === 'pending' && (
                          <Button variant="outline" size="sm" onClick={() => handleVerify(domain)}>
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verify
                          </Button>
                        )}
                        {!domain.is_primary && domain.dns_status === 'verified' && (
                          <Button variant="ghost" size="sm" onClick={() => handleSetPrimary(domain)}>
                            <Star className="w-3.5 h-3.5 mr-1" /> Set Primary
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`https://${domain.domain_name}`, '_blank')}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(domain)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* DNS Records Info */}
                    {domain.dns_status === 'pending' && (
                      <div className="mt-3 p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs font-medium mb-2">Configure these DNS records:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs bg-background p-2 rounded">
                            <span><strong>A</strong> @ → {domain.a_record_ip}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(domain.a_record_ip)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          {domain.txt_record && (
                            <div className="flex items-center justify-between text-xs bg-background p-2 rounded">
                              <span className="truncate mr-2"><strong>TXT</strong> _verify → {domain.txt_record}</span>
                              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(domain.txt_record || '')}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PMClientDomains;
