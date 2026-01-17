import React, { useState } from 'react';
import { ServerSetupPanel, ConnectedServer } from './ServerSetupPanel';
import { ServerStatusDashboard } from './ServerStatusDashboard';
import ServerManagerSidebar from './ServerManagerSidebar';
import type { ServerSection } from './ServerManagerSidebar';
import { Badge } from '@/components/ui/badge';
import { Server, AlertTriangle, Activity, Sparkles } from 'lucide-react';

export const SimpleServerDashboard: React.FC = () => {
  const [servers, setServers] = useState<ConnectedServer[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [activePage, setActivePage] = useState<ServerSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleServerConnected = (server: ConnectedServer) => {
    setServers(prev => [...prev, server]);
    setShowSetup(false);
  };

  const handleAddServer = () => {
    setShowSetup(true);
  };

  // Calculate global stats
  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'online').length;
  const riskLevel = servers.some(s => s.status === 'risk' || s.securityStatus === 'action_needed') 
    ? 'medium' 
    : 'low';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ServerManagerSidebar 
        activeSection={activePage} 
        onSectionChange={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Status Bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <span className="font-semibold">Server Management</span>
              </div>
              {totalServers > 0 && (
                <Badge variant="secondary" className="gap-1">
                  {onlineServers}/{totalServers} Online
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Live Alerts */}
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">0 Alerts</span>
              </div>

              {/* Risk Level */}
              <Badge 
                variant="outline"
                className={
                  riskLevel === 'low' 
                    ? 'border-green-500/50 text-green-500' 
                    : riskLevel === 'medium'
                      ? 'border-yellow-500/50 text-yellow-500'
                      : 'border-red-500/50 text-red-500'
                }
              >
                Risk: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </Badge>

              {/* AI Status */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {showSetup ? (
            <div className="max-w-xl mx-auto py-12">
              <ServerSetupPanel onServerConnected={handleServerConnected} />
            </div>
          ) : (
            <ServerStatusDashboard 
              servers={servers} 
              onAddServer={handleAddServer} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleServerDashboard;
