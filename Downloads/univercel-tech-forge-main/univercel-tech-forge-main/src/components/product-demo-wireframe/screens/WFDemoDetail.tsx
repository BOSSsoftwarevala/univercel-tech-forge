/**
 * SCREEN 3: DEMO DETAIL
 * Left panel (info) + Right panel (preview)
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, Globe, Smartphone, Monitor, 
  Link as LinkIcon, Copy, ExternalLink, Edit, Play, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface WFDemoDetailProps {
  demoId: string | null;
  onBack: () => void;
}

export const WFDemoDetail: React.FC<WFDemoDetailProps> = ({ demoId, onBack }) => {
  const [apkEnabled, setApkEnabled] = useState(false);
  const [webEnabled, setWebEnabled] = useState(true);

  // Mock demo data
  const demo = {
    id: demoId,
    name: 'CRM Pro Demo',
    product: 'CRM Suite',
    type: 'Live',
    status: 'live',
    manager: 'John Doe',
    description: 'Complete walkthrough of CRM Pro features including lead management, pipeline tracking, and reporting.',
    createdAt: '2024-01-15',
    nextSchedule: '2024-01-20 10:00 AM',
    timezone: 'UTC+5:30',
    joinLink: 'https://demo.softwarevala.com/crm-pro-demo',
  };

  const copyLink = () => {
    navigator.clipboard.writeText(demo.joinLink);
    toast.success('Demo link copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{demo.name}</h1>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              {demo.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{demo.product}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Demo Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{demo.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{demo.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Next:</span>
                  <span className="font-medium">{demo.nextSchedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-medium">{demo.timezone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'Jan 20, 2024', time: '10:00 AM', attendees: 5 },
                  { date: 'Jan 22, 2024', time: '2:00 PM', attendees: 8 },
                  { date: 'Jan 25, 2024', time: '11:00 AM', attendees: 3 },
                ].map((schedule, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{schedule.date}</p>
                        <p className="text-xs text-muted-foreground">{schedule.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{schedule.attendees} attendees</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="steps">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="steps">Steps</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="highlights">Highlights</TabsTrigger>
                </TabsList>
                <TabsContent value="steps" className="mt-4 space-y-2">
                  {['Introduction', 'Dashboard Overview', 'Lead Management', 'Pipeline View', 'Reports'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="videos" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No videos uploaded yet
                  </div>
                </TabsContent>
                <TabsContent value="highlights" className="mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {['AI-Powered', 'Real-time Sync', 'Custom Reports', 'Mobile Ready'].map((h, i) => (
                      <Badge key={i} variant="outline" className="justify-center py-2">{h}</Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* APK/Web Toggle */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Android APK</p>
                    <p className="text-xs text-muted-foreground">Enable in-app demo access</p>
                  </div>
                </div>
                <Switch checked={apkEnabled} onCheckedChange={setApkEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Web Embed</p>
                    <p className="text-xs text-muted-foreground">Allow web browser access</p>
                  </div>
                </div>
                <Switch checked={webEnabled} onCheckedChange={setWebEnabled} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to preview demo</p>
                </div>
              </div>

              {/* Join Link */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Join Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-xs truncate">
                    {demo.joinLink}
                  </div>
                  <Button variant="outline" size="icon" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Open
                </Button>
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
