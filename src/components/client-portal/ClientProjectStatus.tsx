import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, CheckCircle, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import ClientPaymentSection from './ClientPaymentSection';

interface ProjectData {
  id: string;
  client_name: string;
  client_email: string;
  company_name: string;
  domain_name: string;
  status: string;
  status_message: string;
  quoted_amount: number | null;
  deposit_amount: number | null;
  balance_amount: number | null;
  deposit_paid: boolean;
  balance_paid: boolean;
  assigned_ip: string | null;
  currency: string | null;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending_review: {
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-yellow-500/10 text-yellow-500',
    label: 'Under Review',
  },
  reviewing: {
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
    color: 'bg-blue-500/10 text-blue-500',
    label: 'Being Reviewed',
  },
  quoted: {
    icon: <CreditCard className="w-5 h-5" />,
    color: 'bg-purple-500/10 text-purple-500',
    label: 'Quote Ready',
  },
  deposit_pending: {
    icon: <CreditCard className="w-5 h-5" />,
    color: 'bg-orange-500/10 text-orange-500',
    label: 'Awaiting Deposit',
  },
  in_progress: {
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
    color: 'bg-blue-500/10 text-blue-500',
    label: 'In Development',
  },
  review_ready: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-green-500/10 text-green-500',
    label: 'Ready for Review',
  },
  balance_pending: {
    icon: <CreditCard className="w-5 h-5" />,
    color: 'bg-orange-500/10 text-orange-500',
    label: 'Awaiting Balance',
  },
  completed: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-green-500/10 text-green-500',
    label: 'Completed',
  },
  on_hold: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'bg-red-500/10 text-red-500',
    label: 'On Hold',
  },
};

const ClientProjectStatus = () => {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearched(true);

    try {
      // We'll use a edge function to fetch projects by email
      const { data, error } = await supabase.functions.invoke('client-project-status', {
        body: { email },
      });

      if (error) throw error;

      setProjects(data.projects || []);
      
      if (data.projects?.length === 0) {
        toast({
          title: 'No Projects Found',
          description: 'No projects found with this email address.',
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: 'Search Failed',
        description: 'Could not fetch project status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Check Project Status</CardTitle>
          <CardDescription>
            Enter your email address to view your project status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      {searched && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Projects Found</h3>
                <p className="text-sm text-muted-foreground">
                  We couldn't find any projects associated with this email.
                </p>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => {
              const config = statusConfig[project.status] || statusConfig.pending_review;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {project.company_name || project.domain_name}
                          </CardTitle>
                          <CardDescription>{project.domain_name}</CardDescription>
                        </div>
                        <Badge className={config.color}>
                          {config.icon}
                          <span className="ml-2">{config.label}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Status Message */}
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm">{project.status_message}</p>
                      </div>

                      {/* Quote Details */}
                      {project.quoted_amount && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-card border rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Total Quote</p>
                            <p className="font-bold">{project.currency === 'INR' ? '₹' : '$'}{project.quoted_amount.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-card border rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Deposit (50%)</p>
                            <p className="font-bold">
                              {project.currency === 'INR' ? '₹' : '$'}{project.deposit_amount?.toLocaleString()}
                              {project.deposit_paid && (
                                <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />
                              )}
                            </p>
                          </div>
                          <div className="p-3 bg-card border rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Balance (50%)</p>
                            <p className="font-bold">
                              {project.currency === 'INR' ? '₹' : '$'}{project.balance_amount?.toLocaleString()}
                              {project.balance_paid && (
                                <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* IP Address */}
                      {project.assigned_ip && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-sm font-medium mb-1">DNS Configuration</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Point your domain's A record to this IP:
                          </p>
                          <code className="bg-background px-3 py-1 rounded text-sm font-mono">
                            {project.assigned_ip}
                          </code>
                        </div>
                      )}

                      {/* Payment Section */}
                      {(project.status === 'deposit_pending' || project.status === 'balance_pending') && (
                        <ClientPaymentSection 
                          project={project}
                          paymentType={project.status === 'deposit_pending' ? 'deposit' : 'balance'}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      )}
      {/* Branding */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        Powered by <span className="font-medium">Software Vala</span>
      </p>
    </div>
  );
};

export default ClientProjectStatus;
