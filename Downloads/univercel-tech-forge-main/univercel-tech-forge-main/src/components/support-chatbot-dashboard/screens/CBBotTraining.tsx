/**
 * BOT TRAINING SCREEN
 * Train and improve your chatbot
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload,
  FileText,
  Link,
  Plus,
  Save,
  RefreshCw,
  CheckCircle2,
  Clock,
  Database,
  Sparkles,
  Brain,
  History,
  Undo2,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Intent {
  id: string;
  name: string;
  examples: string[];
  response: string;
}

const mockIntents: Intent[] = [
  { 
    id: '1', 
    name: 'Password Reset', 
    examples: ['forgot password', 'reset password', 'can\'t login'],
    response: 'I can help you reset your password. Would you like me to send a reset link to your email?'
  },
  { 
    id: '2', 
    name: 'Billing Inquiry', 
    examples: ['check my bill', 'payment status', 'billing question'],
    response: 'I can help with billing questions. Let me pull up your account details.'
  },
  { 
    id: '3', 
    name: 'Feature Request', 
    examples: ['suggest feature', 'new feature', 'can you add'],
    response: 'Thanks for the suggestion! I\'ll forward this to our product team.'
  },
];

const trainingVersions = [
  { version: 'v2.1', date: 'Jan 18, 2026', status: 'active', accuracy: 94 },
  { version: 'v2.0', date: 'Jan 10, 2026', status: 'archived', accuracy: 91 },
  { version: 'v1.9', date: 'Jan 2, 2026', status: 'archived', accuracy: 88 },
];

export const CBBotTraining: React.FC = () => {
  const [intents, setIntents] = useState<Intent[]>(mockIntents);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [newIntentName, setNewIntentName] = useState('');
  const [newResponse, setNewResponse] = useState('');

  const handleUpload = () => {
    toast({ title: 'Upload started', description: 'Processing your file...' });
  };

  const handleRetrain = () => {
    toast({ title: 'Training started', description: 'This may take a few minutes' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Train Your Bot</h1>
          <p className="text-slate-500 text-sm mt-1">Teach your chatbot to answer questions better</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRetrain}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retrain Bot
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Auto-Improve
          </Button>
        </div>
      </div>

      {/* Training Status */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800">Knowledge Base: Healthy</h3>
                <p className="text-sm text-emerald-600">Last trained 2 hours ago • 94% accuracy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-700">156</p>
                <p className="text-xs text-emerald-600">Intents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-700">1,247</p>
                <p className="text-xs text-emerald-600">Training Examples</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-700">45</p>
                <p className="text-xs text-emerald-600">Documents</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="upload">📄 Upload Content</TabsTrigger>
          <TabsTrigger value="intents">💬 Intents & Responses</TabsTrigger>
          <TabsTrigger value="versions">📜 Version History</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upload FAQ */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Upload FAQ Document
                </CardTitle>
                <CardDescription>PDF, DOC, or TXT files</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                  onClick={handleUpload}
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 font-medium">Drop files here or click to upload</p>
                  <p className="text-xs text-slate-400 mt-1">Max 10MB per file</p>
                </div>
              </CardContent>
            </Card>

            {/* Import from URL */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Link className="w-5 h-5 text-blue-600" />
                  Import from URL
                </CardTitle>
                <CardDescription>Crawl website content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="https://yoursite.com/faq" className="bg-slate-50" />
                <Button className="w-full" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Fetch & Import
                </Button>
              </CardContent>
            </Card>

            {/* Training Progress */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Training Status
                </CardTitle>
                <CardDescription>Current model training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Model Accuracy</span>
                    <span className="font-semibold text-emerald-600">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>Last trained: 2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Uploaded Documents */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['FAQ_2024.pdf', 'Product_Guide.docx', 'Troubleshooting.txt'].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-slate-700">{doc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Processed</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intents Tab */}
        <TabsContent value="intents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Intent List */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Intents</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Intent
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {intents.map((intent) => (
                  <button
                    key={intent.id}
                    onClick={() => setSelectedIntent(intent)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedIntent?.id === intent.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">{intent.name}</span>
                      <Badge variant="outline" className="text-xs">{intent.examples.length} examples</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{intent.response}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Intent Editor */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedIntent ? `Edit: ${selectedIntent.name}` : 'Select an Intent'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedIntent ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Intent Name</label>
                      <Input value={selectedIntent.name} className="bg-slate-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Training Examples</label>
                      <div className="space-y-2">
                        {selectedIntent.examples.map((ex, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input value={ex} className="bg-slate-50 text-sm" />
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Example
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Bot Response</label>
                      <Textarea value={selectedIntent.response} className="bg-slate-50" rows={4} />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Select an intent to edit</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Versions Tab */}
        <TabsContent value="versions">
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Training Version History
              </CardTitle>
              <CardDescription>View and rollback to previous versions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainingVersions.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        v.status === 'active' ? 'bg-emerald-100' : 'bg-slate-200'
                      }`}>
                        {v.status === 'active' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <History className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{v.version}</span>
                          {v.status === 'active' && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">Active</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{v.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{v.accuracy}%</p>
                        <p className="text-xs text-slate-500">Accuracy</p>
                      </div>
                      {v.status !== 'active' && (
                        <Button variant="outline" size="sm">
                          <Undo2 className="w-4 h-4 mr-1" />
                          Rollback
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
