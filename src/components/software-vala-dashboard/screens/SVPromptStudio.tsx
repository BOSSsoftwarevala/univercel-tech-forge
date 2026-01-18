/**
 * PROMPT STUDIO
 * System prompts, versioning, rollback, environment mapping
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  GitBranch, 
  Play, 
  Copy,
  History,
  Variable,
  Layers,
  Settings2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const promptVersions = [
  { version: 'v2.4', env: 'prod', status: 'active', date: '2024-01-15', author: 'Admin' },
  { version: 'v2.3', env: 'staging', status: 'testing', date: '2024-01-14', author: 'Dev Team' },
  { version: 'v2.2', env: 'dev', status: 'archived', date: '2024-01-10', author: 'Admin' },
  { version: 'v2.1', env: 'prod', status: 'archived', date: '2024-01-05', author: 'Admin' },
];

const variables = [
  { name: '{{user_name}}', description: 'Current user name', type: 'string' },
  { name: '{{language}}', description: 'User language preference', type: 'string' },
  { name: '{{context}}', description: 'Conversation context', type: 'object' },
  { name: '{{max_tokens}}', description: 'Token limit', type: 'number' },
];

export const SVPromptStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful AI assistant for Software Vala. Respond in {{language}}. User: {{user_name}}'
  );
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('dev');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Prompt Studio</h1>
          <p className="text-slate-500">Design, test, and manage AI prompts with versioning</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedEnv} onValueChange={setSelectedEnv}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dev">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="prod">Production</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Version
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Prompts</p>
                <p className="text-2xl font-bold text-slate-800">12</p>
              </div>
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Versions</p>
                <p className="text-2xl font-bold text-slate-800">48</p>
              </div>
              <GitBranch className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Variables</p>
                <p className="text-2xl font-bold text-slate-800">24</p>
              </div>
              <Variable className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Test Runs</p>
                <p className="text-2xl font-bold text-slate-800">156</p>
              </div>
              <Play className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Editor */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* System Prompt */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    System Prompt
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter system prompt..."
                />
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span>Variables detected:</span>
                  <Badge variant="secondary" className="text-xs">{'{{user_name}}'}</Badge>
                  <Badge variant="secondary" className="text-xs">{'{{language}}'}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* User Prompt / Test */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    User Prompt (Test)
                  </CardTitle>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-1" />
                    Run Test
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter test user message..."
                />
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border">
                  <p className="text-xs text-slate-500 mb-2">Response Preview</p>
                  <p className="text-sm text-slate-600 italic">Run test to see response...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="variables" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Available Variables</CardTitle>
                <Button size="sm" variant="outline">
                  <Variable className="w-4 h-4 mr-2" />
                  Add Variable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {variables.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-mono">
                        {v.name}
                      </code>
                      <span className="text-sm text-slate-600">{v.description}</span>
                    </div>
                    <Badge variant="outline">{v.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Version History</CardTitle>
                <Button size="sm" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Compare Versions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promptVersions.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{v.version}</span>
                          <Badge 
                            variant={v.status === 'active' ? 'default' : 'secondary'}
                            className={v.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                          >
                            {v.status}
                          </Badge>
                          <Badge variant="outline">{v.env}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{v.date} by {v.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prompt Routing Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-800">Route by Country</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-slate-500">IF</span> Country = IN
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-slate-500">THEN</span> Use prompt_v2_hindi
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-slate-500">MODEL</span> gemini-2.5-flash
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-800">Route by Platform</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-slate-500">IF</span> Platform = Android
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-slate-500">THEN</span> Use prompt_mobile
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-slate-500">MODEL</span> gpt-5-mini
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
