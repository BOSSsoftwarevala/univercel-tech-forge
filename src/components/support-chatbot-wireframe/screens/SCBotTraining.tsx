/**
 * SCREEN 4: BOT TRAINING
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Link, Plus, Trash2, Save, RefreshCw, BookOpen, MessageSquare, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const mockIntents = [
  { id: '1', name: 'password_reset', utterances: 12, responses: 3 },
  { id: '2', name: 'pricing_inquiry', utterances: 8, responses: 2 },
  { id: '3', name: 'technical_support', utterances: 15, responses: 5 },
  { id: '4', name: 'billing_question', utterances: 10, responses: 4 },
];

const mockKnowledgeBase = [
  { id: '1', title: 'Product FAQ', type: 'pdf', status: 'trained', lastTrained: '2 hours ago' },
  { id: '2', title: 'Help Center', type: 'url', status: 'trained', lastTrained: '1 day ago' },
  { id: '3', title: 'Feature Guide', type: 'doc', status: 'processing', lastTrained: 'In progress' },
];

export const SCBotTraining: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bot Training</h1>
        <p className="text-sm text-muted-foreground mt-1">Train your chatbot with knowledge</p>
      </div>

      {/* Training Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Knowledge Items', value: '24', icon: BookOpen, color: 'text-blue-600 bg-blue-500/10' },
          { label: 'Intents Trained', value: '18', icon: Brain, color: 'text-purple-600 bg-purple-500/10' },
          { label: 'Training Accuracy', value: '94%', icon: MessageSquare, color: 'text-green-600 bg-green-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="intents" className="gap-2">
            <Brain className="w-4 h-4" />
            Intents
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Knowledge Base
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Upload Documents</CardTitle>
                <CardDescription>PDF, DOC, or TXT files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">Max 10MB per file</p>
                </div>
              </CardContent>
            </Card>

            {/* URL Import */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Import from URL</CardTitle>
                <CardDescription>Crawl help pages or FAQs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/faq"
                    className="flex-1"
                  />
                  <Button onClick={() => toast.success('URL added for crawling')}>
                    <Link className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {['https://docs.example.com', 'https://help.example.com/faq'].map((url, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm truncate flex-1">{url}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => toast.success('Training started')}>
              <RefreshCw className="w-4 h-4" />
              Start Training
            </Button>
          </div>
        </TabsContent>

        {/* Intents Tab */}
        <TabsContent value="intents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Intent List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Intents</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockIntents.map((intent) => (
                  <motion.div
                    key={intent.id}
                    whileHover={{ x: 2 }}
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedIntent === intent.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{intent.name}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{intent.utterances} utterances</span>
                      <span className="text-xs text-muted-foreground">{intent.responses} responses</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Intent Editor */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Intent Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intent Name</label>
                  <Input defaultValue="password_reset" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">User Utterances</label>
                  <Textarea 
                    placeholder="One utterance per line..."
                    defaultValue="How do I reset my password?\nI forgot my password\nCan't login to my account"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bot Responses</label>
                  <Textarea 
                    placeholder="Bot response..."
                    defaultValue="To reset your password, please click on 'Forgot Password' on the login page and follow the instructions."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Intent
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Knowledge Base Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockKnowledgeBase.map((kb, index) => (
                <motion.div
                  key={kb.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{kb.title}</p>
                      <p className="text-xs text-muted-foreground">Last trained: {kb.lastTrained}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="uppercase text-[10px]">{kb.type}</Badge>
                    <Badge variant={kb.status === 'trained' ? 'default' : 'secondary'}>
                      {kb.status}
                    </Badge>
                    {kb.status === 'processing' && (
                      <div className="w-20">
                        <Progress value={65} className="h-1" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
