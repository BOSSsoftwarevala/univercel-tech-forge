import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FolderOpen, FileArchive, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
}

interface UploadInterfaceProps {
  onUpload?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

const UploadInterface: React.FC<UploadInterfaceProps> = ({
  onUpload,
  accept = '*',
  multiple = true,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newFiles: UploadFile[] = fileArray.map((f) => ({
        id: `${f.name}-${Date.now()}`,
        name: f.name,
        size: f.size,
        status: 'pending',
        progress: 0,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      onUpload?.(fileArray);

      // Simulate upload progress
      newFiles.forEach((uf, i) => {
        setTimeout(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === uf.id ? { ...f, status: 'uploading' } : f))
          );
          const interval = setInterval(() => {
            setUploadedFiles((prev) => {
              const current = prev.find((f) => f.id === uf.id);
              if (!current) return prev;
              if (current.progress >= 100) {
                clearInterval(interval);
                return prev.map((f) =>
                  f.id === uf.id ? { ...f, status: 'done', progress: 100 } : f
                );
              }
              return prev.map((f) =>
                f.id === uf.id ? { ...f, progress: f.progress + 20 } : f
              );
            });
          }, 300);
        }, i * 200);
      });

      toast.success(`${fileArray.length} file(s) queued for upload`);
    },
    [onUpload]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop zone */}
      <motion.div
        animate={{
          borderColor: isDragging ? 'rgba(139,92,246,0.8)' : 'rgba(71,85,105,0.5)',
          backgroundColor: isDragging ? 'rgba(139,92,246,0.05)' : 'transparent',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="relative rounded-xl border-2 border-dashed border-slate-700 p-8 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors"
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          animate={{ scale: isDragging ? 1.05 : 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            {isDragging ? (
              <FolderOpen className="w-6 h-6 text-violet-400" />
            ) : (
              <Upload className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              or click to browse • ZIP, APK, Web builds supported
            </p>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FileArchive className="w-3.5 h-3.5" />
              <span>ZIP files</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Folders</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* File list */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                  <FileArchive className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${file.progress}%` }}
                        className={cn(
                          'h-full rounded-full',
                          file.status === 'done' ? 'bg-emerald-500' : 'bg-violet-500'
                        )}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {file.status === 'done' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {file.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {file.status === 'pending' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="w-4 h-4 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadInterface;
