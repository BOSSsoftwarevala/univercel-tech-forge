/**
 * WHOIS & DNS TOOLS
 * Domain lookup, DNS records, nameserver management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Globe, Server, Shield, CheckCircle, AlertTriangle,
  Copy, ExternalLink, RefreshCw, Loader2, Clock, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface WhoisResult {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  nameservers: string[];
  status: string;
  registrant: string;
  country: string;
}

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export const WhoisDnsTools: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [whoisResult, setWhoisResult] = useState<WhoisResult | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);

  const handleLookup = async () => {
    if (!domain.trim()) { toast.error('Enter a domain name'); return; }
    setLoading(true);

    // Simulate API call — will be replaced with real WHOIS API
    setTimeout(() => {
      setWhoisResult({
        domain: domain.trim(),
        registrar: 'GoDaddy.com, LLC',
        createdDate: '2020-03-15',
        expiryDate: '2027-03-15',
        nameservers: ['ns1.hostinger.com', 'ns2.hostinger.com'],
        status: 'clientTransferProhibited',
        registrant: 'REDACTED FOR PRIVACY',
        country: 'IN',
      });
      setDnsRecords([
        { type: 'A', name: '@', value: '185.199.108.153', ttl: 3600 },
        { type: 'A', name: 'www', value: '185.199.108.153', ttl: 3600 },
        { type: 'CNAME', name: 'api', value: 'api.softwarevala.com', ttl: 3600 },
        { type: 'MX', name: '@', value: 'mail.softwarevala.com', ttl: 3600, priority: 10 },
        { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 },
        { type: 'NS', name: '@', value: 'ns1.hostinger.com', ttl: 86400 },
        { type: 'NS', name: '@', value: 'ns2.hostinger.com', ttl: 86400 },
      ]);
      setLoading(false);
      toast.success('Lookup complete');
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const typeColors: Record<string, string> = {
    A: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    AAAA: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    CNAME: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    MX: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    TXT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    NS: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    SOA: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">WHOIS & DNS Tools</h2>
        <p className="text-sm text-muted-foreground">Domain lookup, DNS records, and nameserver management</p>
      </div>

      {/* Search Bar */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
                placeholder="Enter domain name (e.g. softwarevala.com)"
                className="pl-10 bg-background border-border"
              />
            </div>
            <Button onClick={handleLookup} disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-2" /> Lookup</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {whoisResult && (
        <Tabs defaultValue="whois" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="whois">WHOIS Info</TabsTrigger>
            <TabsTrigger value="dns">DNS Records ({dnsRecords.length})</TabsTrigger>
            <TabsTrigger value="nameservers">Nameservers</TabsTrigger>
          </TabsList>

          {/* WHOIS Tab */}
          <TabsContent value="whois">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="w-5 h-5 text-blue-400" />
                    {whoisResult.domain}
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs ml-2">
                      <CheckCircle className="w-3 h-3 mr-1" /> Registered
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Registrar', value: whoisResult.registrar, icon: Shield },
                      { label: 'Created', value: whoisResult.createdDate, icon: Clock },
                      { label: 'Expires', value: whoisResult.expiryDate, icon: AlertTriangle },
                      { label: 'Country', value: whoisResult.country, icon: MapPin },
                      { label: 'Status', value: whoisResult.status, icon: CheckCircle },
                      { label: 'Registrant', value: whoisResult.registrant, icon: Shield },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground truncate">{item.value}</span>
                            <button onClick={() => copyToClipboard(item.value)} className="text-muted-foreground hover:text-foreground">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* DNS Records Tab */}
          <TabsContent value="dns">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">DNS Records</CardTitle>
                  <Button size="sm" variant="outline" onClick={handleLookup}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dnsRecords.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:border-blue-500/30 transition-colors"
                      >
                        <Badge variant="outline" className={`text-[10px] font-mono min-w-[50px] justify-center ${typeColors[rec.type] || ''}`}>
                          {rec.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground w-16 font-mono">{rec.name}</span>
                        <span className="text-sm text-foreground flex-1 font-mono truncate">{rec.value}</span>
                        {rec.priority !== undefined && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">P:{rec.priority}</Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">TTL:{rec.ttl}</span>
                        <button onClick={() => copyToClipboard(rec.value)} className="text-muted-foreground hover:text-foreground">
                          <Copy className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Nameservers Tab */}
          <TabsContent value="nameservers">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" /> Nameservers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {whoisResult.nameservers.map((ns, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Server className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-sm font-mono text-foreground">{ns}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">Active</Badge>
                          <button onClick={() => copyToClipboard(ns)} className="text-muted-foreground hover:text-foreground">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Tools */}
      {!whoisResult && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'WHOIS Lookup', desc: 'Check domain ownership & registration', icon: Search, color: 'text-blue-400' },
            { title: 'DNS Propagation', desc: 'Check DNS records worldwide', icon: Globe, color: 'text-emerald-400' },
            { title: 'SSL Check', desc: 'Verify SSL certificate status', icon: Shield, color: 'text-amber-400' },
          ].map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${tool.color}`} />
                    <p className="text-sm font-medium text-foreground">{tool.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WhoisDnsTools;
