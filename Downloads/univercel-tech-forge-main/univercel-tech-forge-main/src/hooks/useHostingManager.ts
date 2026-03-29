import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Deployment {
  id: string;
  status: 'building' | 'deploying' | 'ready' | 'live' | 'failed';
  createdAt: string;
  projectName: string;
  domain: string;
  branch: string;
}

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  status: 'pending' | 'verified' | 'failed';
}

interface DeploymentLog {
  timestamp: string;
  message: string;
}

export const useHostingManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callHosting = async (action: string, data: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'hosting-manager',
        { body: { action, data } }
      );

      if (fnError) {
        console.error('Hosting error:', fnError);
        setError(fnError.message);
        toast.error('Hosting service temporarily unavailable');
        return null;
      }

      return result;
    } catch (err) {
      console.error('Hosting exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to connect to hosting service');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deploy = async (projectName: string, options?: {
    domain?: string;
    branch?: string;
    environment?: string;
  }): Promise<{ deployment: Deployment } | null> => {
    const result = await callHosting('deploy', { projectName, ...options });
    if (result?.success) {
      toast.success(`Deployment started for ${projectName}`);
    }
    return result;
  };

  const checkDomain = async (domain: string): Promise<{
    available: boolean;
    dnsRecords: DnsRecord[] | null;
    message: string;
  } | null> => {
    return callHosting('check_domain', { domain });
  };

  const verifyDns = async (domain: string): Promise<{
    verified: boolean;
    ssl: string;
    message: string;
  } | null> => {
    return callHosting('verify_dns', { domain });
  };

  const getDeploymentStatus = async (deploymentId: string, domain: string): Promise<{
    status: string;
    url: string | null;
    logs: DeploymentLog[];
  } | null> => {
    return callHosting('get_deployment_status', { deploymentId, domain });
  };

  const rollback = async (targetDeploymentId: string): Promise<{
    message: string;
    newDeploymentId: string;
  } | null> => {
    const result = await callHosting('rollback', { targetDeploymentId });
    if (result?.success) {
      toast.success('Rollback initiated successfully');
    }
    return result;
  };

  const getAnalytics = async (): Promise<{
    analytics: {
      requests: number;
      bandwidth: string;
      uniqueVisitors: number;
      avgResponseTime: string;
      uptime: string;
      regions: { name: string; requests: number }[];
    };
  } | null> => {
    return callHosting('get_analytics', {});
  };

  const configureSSL = async (domain: string): Promise<{
    ssl: {
      status: string;
      issuer: string;
      validFrom: string;
      validUntil: string;
      autoRenew: boolean;
    };
  } | null> => {
    return callHosting('configure_ssl', { domain });
  };

  const scaleInstance = async (currentSize: string, targetSize: string): Promise<{
    instance: {
      previousSize: string;
      newSize: string;
      cpu: string;
      memory: string;
      estimatedCost: string;
    };
  } | null> => {
    const result = await callHosting('scale_instance', { currentSize, targetSize });
    if (result?.success) {
      toast.success(`Instance scaled to ${targetSize}`);
    }
    return result;
  };

  return {
    isLoading,
    error,
    deploy,
    checkDomain,
    verifyDns,
    getDeploymentStatus,
    rollback,
    getAnalytics,
    configureSSL,
    scaleInstance
  };
};
