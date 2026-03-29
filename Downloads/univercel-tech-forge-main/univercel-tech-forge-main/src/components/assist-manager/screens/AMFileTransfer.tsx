/**
 * FILE TRANSFER - All buttons functional
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { FileUp, FileDown, Key, Trash2, Upload, Download, File, CheckCircle, Clock } from 'lucide-react';

interface TransferFile {
  id: string;
  name: string;
  size: string;
  direction: 'send' | 'receive';
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  progress: number;
  time: string;
}

export function AMFileTransfer() {
  const [transfers, setTransfers] = useState<TransferFile[]>([
    { id: 'FT-001', name: 'config.zip', size: '2.4 MB', direction: 'send', status: 'completed', progress: 100, time: '2 min ago' },
    { id: 'FT-002', name: 'logs.txt', size: '456 KB', direction: 'receive', status: 'in_progress', progress: 67, time: 'Now' },
    { id: 'FT-003', name: 'screenshot.png', size: '1.2 MB', direction: 'send', status: 'pending', progress: 0, time: 'Queued' },
  ]);

  // Simulate progress for in-progress files
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTransfers(prev => prev.map(t => {
        if (t.status === 'in_progress' && t.progress < 100) {
          const newProgress = Math.min(100, t.progress + 5);
          if (newProgress >= 100) {
            toast.success(`${t.name} transfer complete`);
            return { ...t, progress: 100, status: 'completed' as const, time: 'Just now' };
          }
          return { ...t, progress: newProgress };
        }
        if (t.status === 'pending') {
          return { ...t, status: 'in_progress' as const, progress: 5, time: 'Now' };
        }
        return t;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: string) => {
    const newFile: TransferFile = {
      id: `FT-${String(transfers.length + 1).padStart(3, '0')}`,
      name: action === 'send' ? 'new-file.zip' : action === 'receive' ? 'pulled-data.csv' : 'access-link.dat',
      size: '1.8 MB',
      direction: action === 'receive' ? 'receive' : 'send',
      status: 'pending',
      progress: 0,
      time: 'Queued',
    };
    setTransfers(prev => [...prev, newFile]);
    toast.info(`${action === 'send' ? 'Send' : action === 'receive' ? 'Receive' : action === 'one_time' ? 'One-Time Link' : 'Auto Delete'} initiated`, {
      description: `File ${newFile.name} added to queue`
    });
  };

  const handleUpload = () => {
    const newFile: TransferFile = {
      id: `FT-${String(transfers.length + 1).padStart(3, '0')}`,
      name: 'uploaded-file.zip',
      size: '3.2 MB',
      direction: 'send',
      status: 'pending',
      progress: 0,
      time: 'Queued',
    };
    setTransfers(prev => [...prev, newFile]);
    toast.success('File queued for upload', { description: 'Auto-delete after session ends' });
  };

  const TRANSFER_RULES = [
    { id: 'send', label: 'Send File', icon: Upload, description: 'Push files to target device' },
    { id: 'receive', label: 'Receive File', icon: Download, description: 'Pull files from target device' },
    { id: 'one_time', label: 'One-Time Access', icon: Key, description: 'Single use file access link' },
    { id: 'auto_delete', label: 'Auto Delete', icon: Trash2, description: 'Remove files after session ends' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">File Transfer</h1>
          <p className="text-muted-foreground">Secure file exchange during assist sessions</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRANSFER_RULES.map((rule) => {
            const Icon = rule.icon;
            return (
              <Card key={rule.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleAction(rule.id)}>
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-sm">{rule.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileUp className="h-5 w-5" /> Transfer Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transfers.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {file.direction === 'send' ? <FileUp className="h-5 w-5 text-primary" /> : <FileDown className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span className="font-medium text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({file.size})</span>
                    </div>
                    {file.status === 'in_progress' && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">{file.progress}% complete</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={file.status === 'completed' ? 'default' : file.status === 'in_progress' ? 'secondary' : 'outline'}>
                      {file.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {file.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                      {file.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{file.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Auto-Delete Enabled</p>
                <p className="text-xs text-muted-foreground mt-1">All transferred files will be automatically deleted after the session ends. No file persistence on any device.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors" onClick={handleUpload}>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">Max 100 MB per file • Auto-delete after session</p>
              <Button className="mt-4" onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
                <Upload className="h-4 w-4 mr-2" /> Select Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMFileTransfer;
