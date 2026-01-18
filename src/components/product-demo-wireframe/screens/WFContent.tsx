/**
 * CONTENT MANAGEMENT
 * Upload, organize, manage demo content
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Upload, Video, FileText, Layers, Mic, Globe, 
  MoreHorizontal, Eye, Edit, Trash2, GripVertical, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const mockFlows = [
  { id: '1', title: 'Welcome Screen', order: 1, duration: '30s' },
  { id: '2', title: 'Dashboard Overview', order: 2, duration: '1m 20s' },
  { id: '3', title: 'Lead Management', order: 3, duration: '2m 10s' },
  { id: '4', title: 'Pipeline View', order: 4, duration: '1m 45s' },
  { id: '5', title: 'Reports & Analytics', order: 5, duration: '2m 30s' },
  { id: '6', title: 'Settings Tour', order: 6, duration: '1m' },
];

const mockVideos = [
  { id: '1', title: 'Product Introduction', duration: '5:30', size: '45 MB', status: 'ready' },
  { id: '2', title: 'Feature Highlights', duration: '3:15', size: '28 MB', status: 'ready' },
  { id: '3', title: 'Getting Started', duration: '7:20', size: '62 MB', status: 'processing' },
];

export const WFContent: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Content</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage demo content & materials</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success('Upload dialog would open')}>
          <Upload className="w-4 h-4" />
          Upload Content
        </Button>
      </div>

      {/* Settings Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Voice-over</span>
              <Switch checked={voiceoverEnabled} onCheckedChange={setVoiceoverEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="flows" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="flows" className="gap-2">
            <Layers className="w-4 h-4" />
            Screen Flow
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="docs" className="gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Screen Flow */}
        <TabsContent value="flows">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Demo Steps (Drag to reorder)</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockFlows.map((flow, index) => (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  draggable
                  onDragStart={() => setDraggedItem(flow.id)}
                  onDragEnd={() => setDraggedItem(null)}
                  className={`
                    flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-transparent
                    hover:border-border cursor-grab active:cursor-grabbing transition-all
                    ${draggedItem === flow.id ? 'opacity-50' : ''}
                  `}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {flow.order}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{flow.title}</p>
                    <p className="text-xs text-muted-foreground">Duration: {flow.duration}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{flow.duration}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Preview</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pre-recorded Videos</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Video
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                      {video.status === 'processing' && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-xs">Processing...</Badge>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.duration} • {video.size}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Preview</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="docs">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload PDFs, presentations, or guides</p>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
