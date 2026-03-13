/**
 * PMFileBuild - Real File Upload & Management
 * Uses Supabase Storage bucket 'product-files'
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  FileCode, Upload, Package, Globe2, Archive, Lock, Unlock,
  Eye, Download, Trash2, File, CheckCircle2, Clock, AlertCircle,
  Search, Filter, RefreshCw, HardDrive, Loader2
} from 'lucide-react';

interface PMFileBuildProps {
  buildType: string;
}

interface ProductFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  version: string;
  category: string;
  description: string | null;
  download_count: number;
  is_active: boolean;
  created_at: string;
}

const PMFileBuild: React.FC<PMFileBuildProps> = ({ buildType }) => {
  const [files, setFiles] = useState<ProductFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('product_files')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (buildType === 'apk-builds') query = query.eq('category', 'apk');
      else if (buildType === 'web-builds') query = query.eq('category', 'web');
      else if (buildType === 'assets') query = query.eq('category', 'assets');

      const { data, error } = await query;
      if (error) throw error;
      setFiles((data as any[]) || []);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [buildType]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const getCategory = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'apk') return 'apk';
    if (['zip', 'tar', 'gz', 'rar'].includes(ext)) return 'web';
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'ico'].includes(ext)) return 'assets';
    if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return 'docs';
    return 'source';
  };

  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      apk: 'Android APK',
      zip: 'ZIP Archive',
      pdf: 'PDF Document',
      json: 'JSON Config',
      png: 'PNG Image',
      jpg: 'JPEG Image',
      svg: 'SVG Image',
      js: 'JavaScript',
      ts: 'TypeScript',
      tsx: 'React Component',
      css: 'Stylesheet',
      html: 'HTML',
    };
    return typeMap[ext] || ext.toUpperCase();
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const totalFiles = selectedFiles.length;
    let uploaded = 0;

    for (const file of Array.from(selectedFiles)) {
      try {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `uploads/${timestamp}_${safeName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('product-files')
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Save metadata
        const { error: metaError } = await supabase
          .from('product_files')
          .insert({
            file_name: file.name,
            file_type: getFileType(file.name),
            file_size: file.size,
            storage_path: storagePath,
            category: getCategory(file.name),
            version: '1.0.0',
          } as any);

        if (metaError) throw metaError;

        uploaded++;
        setUploadProgress(Math.round((uploaded / totalFiles) * 100));
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    toast.success(`${uploaded}/${totalFiles} files uploaded successfully`);
    setUploading(false);
    setUploadProgress(0);
    fetchFiles();

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (file: ProductFile) => {
    try {
      // Soft delete from DB
      await supabase
        .from('product_files')
        .update({ is_active: false } as any)
        .eq('id', file.id);

      toast.success(`${file.file_name} removed`);
      fetchFiles();
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  const handleDownload = async (file: ProductFile) => {
    try {
      const { data } = await supabase.storage
        .from('product-files')
        .createSignedUrl(file.storage_path, 3600);

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
        // Increment download count
        await supabase
          .from('product_files')
          .update({ download_count: file.download_count + 1 } as any)
          .eq('id', file.id);
      }
    } catch {
      toast.error('Failed to generate download link');
    }
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'apk': return <Package className="w-4 h-4 text-green-500" />;
      case 'web': return <Globe2 className="w-4 h-4 text-blue-500" />;
      case 'assets': return <Archive className="w-4 h-4 text-amber-500" />;
      case 'docs': return <FileCode className="w-4 h-4 text-purple-500" />;
      default: return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.file_size, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{getTitle()}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {files.length} files • {formatSize(totalSize)} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchFiles}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="w-4 h-4 mr-1" /> Upload Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
            accept=".apk,.zip,.pdf,.json,.png,.jpg,.svg,.webp,.js,.ts,.tsx,.css,.html,.txt,.md,.csv"
          />
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Uploading files...</p>
                    <Progress value={uploadProgress} className="mt-2 h-2" />
                  </div>
                  <span className="text-sm font-mono text-primary">{uploadProgress}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apk">APK</SelectItem>
            <SelectItem value="web">Web Build</SelectItem>
            <SelectItem value="assets">Assets</SelectItem>
            <SelectItem value="docs">Documents</SelectItem>
            <SelectItem value="source">Source Code</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: files.length, icon: HardDrive, color: 'text-blue-500' },
          { label: 'APK Builds', value: files.filter(f => f.category === 'apk').length, icon: Package, color: 'text-green-500' },
          { label: 'Web Builds', value: files.filter(f => f.category === 'web').length, icon: Globe2, color: 'text-cyan-500' },
          { label: 'Assets', value: files.filter(f => f.category === 'assets').length, icon: Archive, color: 'text-amber-500' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* File List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Upload className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm font-medium">No files yet</p>
              <p className="text-xs mt-1">Upload your first build files to get started</p>
              <Button size="sm" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload Now
              </Button>
            </div>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <div className="divide-y divide-border">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors"
                  >
                    {getCategoryIcon(file.category)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.file_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{file.file_type}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{formatSize(file.file_size)}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">v{file.version}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{file.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDownload(file)}>
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(file)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PMFileBuild;
