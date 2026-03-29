/**
 * PD INTEGRATION
 * Android APK and Web integration settings
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Globe2, 
  Copy, 
  Link2, 
  Clock, 
  Code2, 
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const embedCode = `<script src="https://demo.softwarevala.com/embed.js"></script>
<div id="sv-demo-widget" data-demo-id="demo_12345"></div>`;

const demoLinks = [
  { id: '1', name: 'Enterprise CRM Demo', url: 'https://demo.sv.com/crm-tour', views: 1234, expires: '2025-02-15' },
  { id: '2', name: 'Mobile SDK Walkthrough', url: 'https://demo.sv.com/mobile-sdk', views: 856, expires: '2025-02-28' },
  { id: '3', name: 'API Integration Guide', url: 'https://demo.sv.com/api-guide', views: 421, expires: '2025-03-10' },
];

export const PDIntegration: React.FC = () => {
  const [inAppDemoEnabled, setInAppDemoEnabled] = useState(true);
  const [floatingButtonEnabled, setFloatingButtonEnabled] = useState(true);
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(true);
  const [offlineHandlingEnabled, setOfflineHandlingEnabled] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Code Copied!",
      description: "Embed code copied to clipboard",
    });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Demo link copied to clipboard",
    });
  };

  const handleGenerateLink = () => {
    toast({
      title: "Generate Demo Link",
      description: "Creating new shareable demo link...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Integration</h1>
        <p className="text-slate-500 mt-1">Configure Android APK and Web integration</p>
      </div>

      <Tabs defaultValue="android" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="android" className="data-[state=active]:bg-white">
            <Smartphone className="w-4 h-4 mr-2" />
            Android APK
          </TabsTrigger>
          <TabsTrigger value="web" className="data-[state=active]:bg-white">
            <Globe2 className="w-4 h-4 mr-2" />
            Web Embed
          </TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-white">
            <Link2 className="w-4 h-4 mr-2" />
            Demo Links
          </TabsTrigger>
        </TabsList>

        {/* Android APK Tab */}
        <TabsContent value="android" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settings */}
            <div className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-700">In-App Demo Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">In-App Demo Widget</p>
                        <p className="text-xs text-slate-500">Show demo tours within the app</p>
                      </div>
                    </div>
                    <Switch checked={inAppDemoEnabled} onCheckedChange={setInAppDemoEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Floating Button</p>
                        <p className="text-xs text-slate-500">Quick access demo button</p>
                      </div>
                    </div>
                    <Switch checked={floatingButtonEnabled} onCheckedChange={setFloatingButtonEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Push Notifications</p>
                        <p className="text-xs text-slate-500">Demo reminders and updates</p>
                      </div>
                    </div>
                    <Switch checked={pushNotificationEnabled} onCheckedChange={setPushNotificationEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Offline Handling</p>
                        <p className="text-xs text-slate-500">Cache demos for offline viewing</p>
                      </div>
                    </div>
                    <Switch checked={offlineHandlingEnabled} onCheckedChange={setOfflineHandlingEnabled} />
                  </div>
                </CardContent>
              </Card>

              {/* SDK Version */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">SDK Version</p>
                      <p className="text-xs text-slate-500">Current: v2.4.1</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Up to date
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Phone Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] p-2 shadow-xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-8 bg-slate-100 flex items-center justify-center">
                      <div className="w-20 h-5 bg-slate-900 rounded-full" />
                    </div>
                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-32 bg-blue-50 rounded-xl flex items-center justify-center">
                        <span className="text-xs text-blue-500 font-medium">Demo Content</span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                    </div>
                    {/* Floating Button */}
                    {floatingButtonEnabled && (
                      <div className="absolute bottom-6 right-4 w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Web Embed Tab */}
        <TabsContent value="web" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500" />
                Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Copy and paste this code into your website to embed the demo widget
              </p>
              <div className="relative">
                <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-sm overflow-x-auto">
                  {embedCode}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={handleCopyCode}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 mb-2">Widget Position</p>
                  <Select defaultValue="bottom-right">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 mb-2">Widget Theme</p>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demo Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-700">Generated Demo Links</CardTitle>
              <Button size="sm" onClick={handleGenerateLink} className="bg-blue-600 hover:bg-blue-700">
                <Link2 className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-800">{link.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {link.url}
                        </span>
                        <span>|</span>
                        <span>{link.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Expires</p>
                        <div className="flex items-center gap-1 text-xs text-slate-700">
                          <Clock className="w-3 h-3" />
                          {link.expires}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Access Expiry Control */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Access Expiry Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Set default expiration time for new demo links
              </p>
              <Select defaultValue="30">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="never">Never expire</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
