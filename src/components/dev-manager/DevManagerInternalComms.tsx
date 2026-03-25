import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Clock, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface InternalNote {
  id: string;
  taskId: string;
  author: string;
  content: string;
  timestamp: string;
}

const mockNotes: InternalNote[] = [
  {
    id: 'NOTE-001',
    taskId: 'TSK-4822',
    author: 'DEV-MGR-445',
    content: 'Reassigned from DEV-5104 due to capacity overload. DEV-3291 has relevant experience.',
    timestamp: '2024-12-31T15:30:00Z'
  },
  {
    id: 'NOTE-002',
    taskId: 'TSK-4823',
    author: 'DEV-MGR-445',
    content: 'External design team notified about blocking dependency. Expected resolution by EOD.',
    timestamp: '2024-12-31T14:00:00Z'
  },
  {
    id: 'NOTE-003',
    taskId: 'TSK-4825',
    author: 'DEV-MGR-445',
    content: 'Priority escalated due to client-facing impact. Daily standup check-in added.',
    timestamp: '2024-12-31T10:00:00Z'
  },
];

export default function DevManagerInternalComms() {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [selectedTask, setSelectedTask] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedTask) {
      toast({
        title: "Missing Information",
        description: "Select a task and enter a note.",
        variant: "destructive"
      });
      return;
    }

    // Log the note
    console.log(`[AUDIT] Internal note added for ${selectedTask} at ${new Date().toISOString()}`);

    toast({
      title: "Note Added",
      description: `Internal note logged for ${selectedTask}`,
    });

    setNewNote('');
    setSelectedTask('');
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            INTERNAL COMMUNICATION
          </CardTitle>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Internal Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 space-y-3">
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
          >
            <option value="">Select Task...</option>
            <option value="TSK-4821">TSK-4821 - API Integration</option>
            <option value="TSK-4822">TSK-4822 - Database Migration</option>
            <option value="TSK-4823">TSK-4823 - UI Component Library</option>
            <option value="TSK-4824">TSK-4824 - Auth Flow Refactor</option>
          </select>
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add internal note (visible to managers only)..."
            className="bg-zinc-900 border-zinc-700 min-h-[80px] text-sm"
          />
          <Button
            size="sm"
            onClick={handleAddNote}
            className="w-full gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            Add Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {mockNotes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {note.taskId}
                  </Badge>
                  <span className="text-xs text-zinc-500 font-mono">{note.author}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <p className="text-sm text-zinc-300">{note.content}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
