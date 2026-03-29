/**
 * ANDROID APK SCREEN
 * APK management with version control and flow documentation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Smartphone,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  Mic,
  Brain,
  Languages,
  Package,
  GitBranch,
  Activity,
  Settings
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SVAndroidFlow } from './SVAndroidFlow';

interface APKFeature {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
}

export const SVAndroidAPK: React.FC = () => {
  const [activeTab, setActiveTab] = useState('releases');
  const [releaseChannel, setReleaseChannel] = useState('production');
  const [features, setFeatures] = useState<APKFeature[]>([
    { id: '1', name: 'AI Chat', icon: Brain, enabled: true },
    { id: '2', name: 'Voice Recording', icon: Mic, enabled: true },
    { id: '3', name: 'Translation', icon: Languages, enabled: true },
  ]);

  const handleFeatureToggle = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    toast({ title: 'Feature Updated' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Android APK</h1>
          <p className="text-slate-500 text-sm mt-1">Manage Android application builds and releases</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload New APK
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Current Version</p>
                <p className="text-lg font-bold text-slate-800">v2.4.1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Build Status</p>
                <p className="text-lg font-bold text-emerald-600">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Release Channel</p>
                <p className="text-lg font-bold text-slate-800">Production</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="text-lg font-bold text-slate-800">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Releases, Features, Flow */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="releases" className="gap-1">
            <Package className="w-3 h-3" /> Releases
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-1">
            <Settings className="w-3 h-3" /> Features
          </TabsTrigger>
          <TabsTrigger value="flow" className="gap-1">
            <Activity className="w-3 h-3" /> App Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="releases" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Release Channel */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Release Channel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">Select Channel</label>
                  <Select value={releaseChannel} onValueChange={setReleaseChannel}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          Production
                        </div>
                      </SelectItem>
                      <SelectItem value="beta">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          Beta
                        </div>
                      </SelectItem>
                      <SelectItem value="alpha">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Alpha
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-sm font-medium text-slate-700">Version History</p>
                  {[
                    { version: 'v2.4.1', date: 'Jan 16, 2026', channel: 'Production' },
                    { version: 'v2.4.0', date: 'Jan 10, 2026', channel: 'Production' },
                    { version: 'v2.3.5', date: 'Jan 2, 2026', channel: 'Beta' },
                  ].map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">{v.version}</Badge>
                        <span className="text-sm text-slate-600">{v.date}</span>
                      </div>
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                        {v.channel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Build Config */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Build Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Min SDK</p>
                    <p className="font-bold text-slate-800">21 (Lollipop)</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Target SDK</p>
                    <p className="font-bold text-slate-800">34 (Android 14)</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">APK Size</p>
                    <p className="font-bold text-slate-800">24.5 MB</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Version Code</p>
                    <p className="font-bold text-slate-800">241</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Current APK
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Features */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Enabled AI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={feature.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-800">{feature.name}</span>
                      </div>
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Offline Configuration */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Offline Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-800">Offline Mode</span>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-800">On-device AI</span>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-800">Analytics</span>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-slate-500">Max Cache</p>
                      <p className="font-medium">100 MB</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-slate-500">Sync Interval</p>
                      <p className="font-medium">30 min</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flow" className="mt-4">
          <SVAndroidFlow />
        </TabsContent>
      </Tabs>
    </div>
  );
};
