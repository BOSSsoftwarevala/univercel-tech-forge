/**
 * PD DEMO CONTENT
 * Create and manage demo content with drag & drop
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GripVertical, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Video, 
  MousePointer, 
  Star,
  Mic,
  Globe2,
  Upload,
  Edit,
  Eye,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'screen' | 'video' | 'interactive';
}

const demoSteps: DemoStep[] = [
  { id: '1', title: 'Welcome Screen', description: 'Introduction and overview', duration: '30s', type: 'screen' },
  { id: '2', title: 'Dashboard Tour', description: 'Main dashboard walkthrough', duration: '2m', type: 'interactive' },
  { id: '3', title: 'Feature Deep Dive', description: 'Key features explanation', duration: '3m', type: 'video' },
  { id: '4', title: 'Analytics Demo', description: 'Reports and insights', duration: '2m', type: 'screen' },
  { id: '5', title: 'Call to Action', description: 'Next steps and signup', duration: '30s', type: 'screen' },
];

const features = [
  { id: '1', name: 'Real-time Analytics', highlighted: true },
  { id: '2', name: 'Multi-language Support', highlighted: true },
  { id: '3', name: 'Custom Integrations', highlighted: false },
  { id: '4', name: 'AI-Powered Insights', highlighted: true },
  { id: '5', name: 'Mobile App', highlighted: false },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
];

export const PDDemoContent: React.FC = () => {
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [steps, setSteps] = useState(demoSteps);

  const handleAddStep = () => {
    toast({
      title: "Add Step",
      description: "Opening step creator...",
    });
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
    toast({
      title: "Step Removed",
      description: "The step has been deleted.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview Demo",
      description: "Launching demo preview...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Demo Content</h1>
          <p className="text-slate-500 mt-1">Create engaging product demonstrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="flow" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="flow" className="data-[state=active]:bg-white">Screen Flow</TabsTrigger>
          <TabsTrigger value="video" className="data-[state=active]:bg-white">Pre-recorded</TabsTrigger>
          <TabsTrigger value="interactive" className="data-[state=active]:bg-white">Interactive</TabsTrigger>
          <TabsTrigger value="highlights" className="data-[state=active]:bg-white">Highlights</TabsTrigger>
        </TabsList>

        {/* Screen Flow Tab */}
        <TabsContent value="flow" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Steps List */}
            <Card className="border-0 shadow-sm lg:col-span-2">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-700">Demo Steps</CardTitle>
                <Button size="sm" variant="outline" onClick={handleAddStep}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                    >
                      <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{step.title}</p>
                        <p className="text-xs text-slate-500">{step.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {step.type}
                      </Badge>
                      <span className="text-xs text-slate-400 w-12 text-right">{step.duration}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteStep(step.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">
                  Drag and drop to reorder steps
                </p>
              </CardContent>
            </Card>

            {/* Settings Panel */}
            <div className="space-y-4">
              {/* Voice Over */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-blue-500" />
                    Voice Over
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Enable voice-over</span>
                    <Switch checked={voiceOverEnabled} onCheckedChange={setVoiceOverEnabled} />
                  </div>
                  {voiceOverEnabled && (
                    <div className="space-y-2">
                      <Select defaultValue="natural">
                        <SelectTrigger>
                          <SelectValue placeholder="Voice type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="natural">Natural (AI)</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" className="w-full" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Custom
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Language */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-green-500" />
                    Language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Duration */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Duration</span>
                    <span className="text-lg font-bold text-slate-800">8m 0s</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-3/4 rounded-full" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Recommended: 5-10 minutes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Pre-recorded Video Tab */}
        <TabsContent value="video">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Video className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload Pre-recorded Video</h3>
                <p className="text-sm text-slate-500 mb-4">Drag and drop or click to upload your demo video</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Video
                </Button>
                <p className="text-xs text-slate-400 mt-4">Supports MP4, MOV, WebM • Max 500MB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Walkthrough Tab */}
        <TabsContent value="interactive">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <MousePointer className="w-5 h-5 text-blue-500" />
                    Interactive Walkthrough
                  </h3>
                  <p className="text-sm text-slate-600">
                    Create an interactive tour that guides users through your product with clickable hotspots and tooltips.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600">1</span>
                      </div>
                      <span className="text-sm text-slate-700">Add hotspots on key UI elements</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600">2</span>
                      </div>
                      <span className="text-sm text-slate-700">Add descriptions and actions</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600">3</span>
                      </div>
                      <span className="text-sm text-slate-700">Preview and publish</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Interactive Demo
                  </Button>
                </div>
                <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <MousePointer className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Preview will appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Highlights Tab */}
        <TabsContent value="highlights">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Feature Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">Select features to highlight in your demo</p>
              <div className="space-y-2">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700">{feature.name}</span>
                    <Switch defaultChecked={feature.highlighted} />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
