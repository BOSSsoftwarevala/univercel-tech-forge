import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { LiveActivityStream } from '@/components/boss-panel/sections/LiveActivityStream';
import { LiveReportsDashboard } from '@/components/live-reports/LiveReportsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Radio } from 'lucide-react';

const WhatIsHappening = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Kya Ho Rha Hai
          </h1>
          <p className="text-muted-foreground">Real-time system activity — what's happening right now</p>
        </div>

        <Tabs defaultValue="stream">
          <TabsList>
            <TabsTrigger value="stream" className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Live Stream
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stream" className="mt-4">
            <LiveActivityStream streamingOn={true} />
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <LiveReportsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default WhatIsHappening;
