import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  FileCode, Upload, Package, Globe2, Archive, Lock, Unlock,
  Eye, Download, Edit3, History, Trash2, FolderOpen, File,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

interface PMFileBuildProps {
  buildType: string;
}

const mockBuilds = [
  { id: 'BLD-001', name: 'ERP-Suite-v3.2.1.apk', type: 'apk', size: '45.2 MB', status: 'ready', locked: true, version: 'v3.2.1', uploadedAt: '2024-01-15' },
  { id: 'BLD-002', name: 'CRM-Pro-v2.8.0.apk', type: 'apk', size: '32.8 MB', status: 'ready', locked: false, version: 'v2.8.0', uploadedAt: '2024-01-14' },
  { id: 'BLD-003', name: 'erp-web-build-v3.2.1.zip', type: 'web', size: '128 MB', status: 'ready', locked: true, version: 'v3.2.1', uploadedAt: '2024-01-15' },
  { id: 'BLD-004', name: 'crm-web-build-v2.8.0.zip', type: 'web', size: '98 MB', status: 'processing', locked: false, version: 'v2.8.0', uploadedAt: '2024-01-14' },
  { id: 'BLD-005', name: 'brand-assets-v1.0.zip', type: 'assets', size: '256 MB', status: 'ready', locked: false, version: 'v1.0', uploadedAt: '2024-01-10' },
  { id: 'BLD-006', name: 'icons-pack-v2.0.zip', type: 'assets', size: '45 MB', status: 'ready', locked: false, version: 'v2.0', uploadedAt: '2024-01-12' },
];

const mockVersionHistory = [
  { id: 'VER-001', version: 'v3.2.1', date: '2024-01-15', changes: 'Bug fixes and performance improvements', author: 'Dev Team' },
  { id: 'VER-002', version: 'v3.2.0', date: '2024-01-10', changes: 'New dashboard features', author: 'Dev Team' },
  { id: 'VER-003', version: 'v3.1.0', date: '2024-01-05', changes: 'API enhancements', author: 'Dev Team' },
  { id: 'VER-004', version: 'v3.0.0', date: '2024-01-01', changes: 'Major release with new UI', author: 'Dev Team' },
];

const PMFileBuild: React.FC<PMFileBuildProps> = ({ buildType }) => {
  const [builds, setBuilds] = useState(mockBuilds);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getTitle = () => {
    switch (buildType) {
      case 'upload-build': return 'Upload Build Files';
      case 'apk-builds': return 'APK Builds';
      case 'web-builds': return 'Web Builds';
      case 'assets': return 'Assets';
      case 'file-lock': return 'File Lock';
      case 'view-only-mode': return 'View-Only Mode';
      case 'version-history': return 'Version History';
      default: return 'File & Build Management';
    }
  };

  const getFilteredBuilds = () => {
    switch (buildType) {
      case 'apk-builds': return builds.filter(b => b.type === 'apk');
      case 'web-builds': return builds.filter(b => b.type === 'web');
      case 'assets': return builds.filter(b => b.type === 'assets');
      case 'file-lock': return builds.filter(b => b.locked);
      default: return builds;
    }
  };

  const handleUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success('Build uploaded successfully');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAction = (action: string, fileName: string) => {
    toast.success(`${action} action triggered`, {
      description: `File: ${fileName}`
    });
  };

  const toggleLock = (buildId: string) => {
    setBuilds(prev => prev.map(b => 
      b.id === buildId ? { ...b, locked: !b.locked } : b
    ));
    const build = builds.find(b => b.id === buildId);
    toast.success(`File ${build?.locked ? 'unlocked' : 'locked'}`, {
      description: build?.name
    });
  };

  if (buildType === 'version-history') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{getTitle()}</h1>
              <p className="text-sm text-muted-foreground">Track all version changes</p>
            </div>
          </div>
        </motion.div>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="divide-y divide-border/50">
                {mockVersionHistory.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-secondary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          {version.version}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{version.date}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{version.author}</span>
                    </div>
                    <p className="text-sm">{version.changes}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (buildType === 'upload-build') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">Upload APK, Web Build, or Assets</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'APK', icon: Package, color: 'emerald', desc: 'Android Package' },
            { type: 'Web Build', icon: Globe2, color: 'blue', desc: 'Web Application' },
            { type: 'Assets', icon: Archive, color: 'amber', desc: 'Images, Icons, etc.' },
          ].map((item) => (
            <Card key={item.type} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 flex items-center justify-center mb-4 border border-${item.color}-500/30`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                </div>
                <h3 className="font-semibold mb-1">{item.type}</h3>
                <p className="text-xs text-muted-foreground mb-4">{item.desc}</p>
                <Button onClick={handleUpload} disabled={uploading} className="w-full gap-2">
                  <Upload className="w-4 h-4" /> Upload
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {uploading && (
          <Card className="bg-card/50 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm">Uploading...</span>
                <span className="text-sm text-muted-foreground ml-auto">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const filteredBuilds = getFilteredBuilds();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {filteredBuilds.length} files available
            </p>
          </div>
        </div>
      </motion.div>

      <ScrollArea className="h-[calc(100vh-14rem)]">
        <div className="space-y-3">
          {filteredBuilds.map((build, index) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-indigo-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <File className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{build.name}</h3>
                          {build.locked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{build.size}</span>
                          <span>•</span>
                          <span>{build.version}</span>
                          <span>•</span>
                          <span>{build.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        className={build.status === 'ready' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }
                      >
                        {build.status === 'ready' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {build.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => handleAction('View', build.name)}>
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => handleAction('Download', build.name)}>
                      <Download className="w-3.5 h-3.5" /> Download
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => toggleLock(build.id)}>
                      {build.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      {build.locked ? 'Unlock' : 'Lock'}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-red-400 hover:text-red-300" onClick={() => handleAction('Delete', build.name)}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PMFileBuild;
