import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Server,
  Database,
  Layers,
  MessageSquare,
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { serverManagerAPI } from '@/hooks/useServerManagerAPI';

interface Service {
  id: string;
  name: string;
  type: 'app' | 'database' | 'cache' | 'queue' | 'api';
  status: 'running' | 'degraded' | 'stopped' | 'starting' | 'stopping';
  version: string;
  uptime: string;
  latency: number;
  lastRestart: string;
  connections: number;
  errors24h: number;
}

interface ServicesResponse {
  services: Service[];
}

export function SMServicesStatus() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restartingService, setRestartingService] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async (silent = false) => {
      try {
        const data = await serverManagerAPI.getServicesStatus() as ServicesResponse;
        if (!cancelled) {
          setServices(data.services || []);
        }
      } catch (error) {
        if (!silent) {
          toast.error(error instanceof Error ? error.message : 'Failed to load services');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadServices();
    const interval = window.setInterval(() => {
      void loadServices(true);
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'app':
        return Server;
      case 'database':
        return Database;
      case 'cache':
        return Layers;
      case 'queue':
        return MessageSquare;
      case 'api':
        return Globe;
      default:
        return Server;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return CheckCircle;
      case 'degraded':
        return AlertTriangle;
      case 'stopped':
        return XCircle;
      case 'starting':
      case 'stopping':
        return RefreshCw;
      default:
        return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'stopped':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'starting':
      case 'stopping':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleRestart = async (serviceId: string, serviceName: string) => {
    try {
      setRestartingService(serviceId);
      await serverManagerAPI.restartService(serviceId);
      toast.success(`${serviceName} restart queued`);

      const data = await serverManagerAPI.getServicesStatus() as ServicesResponse;
      setServices(data.services || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to restart service');
    } finally {
      setRestartingService(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Services Status
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-400">
            {services.filter((service) => service.status === 'running').length} Running
          </Badge>
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
            {services.filter((service) => service.status === 'degraded').length} Degraded
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((service) => {
          const ServiceIcon = getServiceIcon(service.type);
          const StatusIcon = getStatusIcon(service.status);
          const isRestarting = restartingService === service.id;

          return (
            <Card key={service.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <ServiceIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{service.name}</span>
                        <Badge variant="outline" className="text-xs font-mono">
                          {service.version}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Uptime: {service.uptime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {service.latency}ms
                        </span>
                        <span>Connections: {service.connections}</span>
                        <span className={service.errors24h > 10 ? 'text-yellow-400' : ''}>
                          Errors (24h): {service.errors24h}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(service.status)}>
                      <StatusIcon className={`h-3 w-3 mr-1 ${isRestarting ? 'animate-spin' : ''}`} />
                      {isRestarting ? 'RESTARTING' : service.status.toUpperCase()}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestart(service.id, service.name)}
                      disabled={isRestarting}
                      className="text-xs"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${isRestarting ? 'animate-spin' : ''}`} />
                      Restart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {!services.length && (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-sm text-muted-foreground text-center">
              No managed services found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}