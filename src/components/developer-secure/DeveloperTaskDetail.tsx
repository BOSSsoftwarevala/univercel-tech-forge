import React, { useState } from 'react';
import { 
  Clock, AlertTriangle, CheckCircle, Play, Pause, 
  MessageSquare, FileUp, Shield, X, Send, Loader2,
  Calendar, Tag, Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { DeveloperTask } from '@/hooks/useDeveloperGuard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeveloperTaskDetailProps {
  task: DeveloperTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: string) => void;
  onAddNote: (taskId: string, note: string) => void;
  onUploadFile: (taskId: string, file: File) => void;
}

interface InternalNote {
  id: string;
  text: string;
  created_at: string;
  developer_id: string;
}

const mockNotes: InternalNote[] = [
  { id: '1', text: 'Started API integration. Setting up authentication flow.', created_at: '2 hours ago', developer_id: 'DEV***042' },
  { id: '2', text: 'Found issue with token refresh. Investigating.', created_at: '1 hour ago', developer_id: 'DEV***042' },
];

export function DeveloperTaskDetail({
  task,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
  onUploadFile
}: DeveloperTaskDetailProps) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState<InternalNote[]>(mockNotes);

  if (!task) return null;

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const note: InternalNote = {
        id: Date.now().toString(),
        text: newNote,
        created_at: 'Just now',
        developer_id: 'DEV***042'
      };
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      setIsSubmitting(false);
      onAddNote(task.id, newNote);
      toast.success('Note added');
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB allowed.');
      return;
    }

    // Check file type
    const allowedTypes = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.php', '.html', '.css', '.json', '.md', '.zip', '.pdf'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      toast.error('File type not allowed');
      return;
    }

    onUploadFile(task.id, file);
    toast.success('File uploaded', { description: file.name });
  };

  const formatSlaTime = (minutes: number | null) => {
    if (minutes === null || minutes === undefined) return '--:--';
    if (minutes < 0) return 'BREACHED';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const isSlaBreached = task.sla_breached || (task.sla_remaining_minutes !== null && task.sla_remaining_minutes <= 0);
  const isSlaWarning = task.sla_remaining_minutes !== null && task.sla_remaining_minutes <= 60 && task.sla_remaining_minutes > 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl bg-slate-900 border-slate-800 overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{task.task_id}</Badge>
            <Badge className={`${
              task.priority === 'critical' ? 'bg-red-500' :
              task.priority === 'high' ? 'bg-amber-500' :
              task.priority === 'medium' ? 'bg-cyan-500' :
              'bg-slate-500'
            }`}>
              {task.priority}
            </Badge>
          </div>
          <SheetTitle className="text-white">{task.title}</SheetTitle>
          <SheetDescription>{task.description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* SLA Timer - Prominent */}
          <div className={`p-4 rounded-xl ${
            isSlaBreached ? 'bg-red-500/20 border border-red-500/50' :
            isSlaWarning ? 'bg-amber-500/20 border border-amber-500/50' :
            'bg-cyan-500/10 border border-cyan-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${
                  isSlaBreached ? 'text-red-500' :
                  isSlaWarning ? 'text-amber-500' :
                  'text-cyan-500'
                }`} />
                <span className="text-sm text-muted-foreground">SLA Time Remaining</span>
              </div>
              <span className={`text-2xl font-mono font-bold ${
                isSlaBreached ? 'text-red-500' :
                isSlaWarning ? 'text-amber-500' :
                'text-cyan-500'
              }`}>
                {formatSlaTime(task.sla_remaining_minutes)}
              </span>
            </div>
            {isSlaBreached && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                SLA breached. This is logged and affects performance score.
              </p>
            )}
          </div>

          {/* Status Update - ALLOWED */}
          <div className="space-y-3">
            <Label>Update Status</Label>
            <Select
              value={task.status}
              onValueChange={(value) => onUpdateStatus(task.id, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Status changes are logged. You cannot reassign or change deadline.
            </p>
          </div>

          {/* Promise Link (Read-Only) */}
          {task.promise_id && (
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Linked Promise: #{task.promise_id.slice(0, 8)}</span>
                <Badge variant="outline" className="text-xs">READ-ONLY</Badge>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {task.tech_stack && task.tech_stack.length > 0 && (
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <div className="flex flex-wrap gap-2">
                {task.tech_stack.map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-purple-500/10">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Internal Notes - ALLOWED */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Internal Notes
            </Label>
            
            {/* Add Note */}
            <div className="flex gap-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add internal note (no client visibility)..."
                className="flex-1 bg-slate-800 border-slate-700"
                rows={2}
              />
              <Button
                onClick={handleAddNote}
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">{note.developer_id}</Badge>
                    <span className="text-[10px] text-muted-foreground">{note.created_at}</span>
                  </div>
                  <p className="text-sm">{note.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload - ALLOWED with restrictions */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload Files
            </Label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="task-file-upload"
                accept=".js,.ts,.jsx,.tsx,.py,.java,.php,.html,.css,.json,.md,.zip,.pdf"
              />
              <label htmlFor="task-file-upload" className="cursor-pointer">
                <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload files</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max 10MB • Code files, ZIP, PDF only
                </p>
              </label>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Files are scanned for viruses. Only task-related uploads allowed.
            </p>
          </div>

          {/* Restrictions Notice */}
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4" />
              Restricted Actions
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Cannot reassign this task</li>
              <li>• Cannot change deadline</li>
              <li>• Cannot delete task or notes</li>
              <li>• Cannot access client chat</li>
              <li>• No PII exposure allowed</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
