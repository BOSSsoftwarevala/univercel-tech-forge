import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Lock, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface HRNote {
  id: string;
  employeeId: string;
  category: 'performance' | 'conduct' | 'leave' | 'general';
  content: string;
  author: string;
  timestamp: string;
  isConfidential: boolean;
}

const mockNotes: HRNote[] = [
  {
    id: 'NOTE-001',
    employeeId: 'EMP-1003',
    category: 'leave',
    content: 'Extended leave approved for medical reasons. Return date confirmed for Jan 15.',
    author: 'HR-MGR-101',
    timestamp: '2024-12-30T10:00:00Z',
    isConfidential: true
  },
  {
    id: 'NOTE-002',
    employeeId: 'EMP-1001',
    category: 'performance',
    content: 'Recommended for leadership training program based on Q4 review.',
    author: 'HR-MGR-101',
    timestamp: '2024-12-29T14:30:00Z',
    isConfidential: false
  },
  {
    id: 'NOTE-003',
    employeeId: 'EMP-1005',
    category: 'conduct',
    content: 'Verbal warning issued regarding repeated late arrivals. Documented for record.',
    author: 'HR-MGR-101',
    timestamp: '2024-12-28T09:00:00Z',
    isConfidential: true
  },
];

const getCategoryConfig = (category: HRNote['category']) => {
  switch (category) {
    case 'performance': return { color: 'bg-blue-500/20 text-blue-400', label: 'Performance' };
    case 'conduct': return { color: 'bg-amber-500/20 text-amber-400', label: 'Conduct' };
    case 'leave': return { color: 'bg-purple-500/20 text-purple-400', label: 'Leave' };
    case 'general': return { color: 'bg-zinc-500/20 text-zinc-400', label: 'General' };
  }
};

export default function HRInternalNotes() {
  const { toast } = useToast();
  const [notes, setNotes] = useState(mockNotes);
  const [newNote, setNewNote] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HRNote['category']>('general');
  const [isConfidential, setIsConfidential] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedEmployee) {
      toast({
        title: "Missing Information",
        description: "Select employee and enter note content.",
        variant: "destructive"
      });
      return;
    }

    const note: HRNote = {
      id: `NOTE-${Date.now()}`,
      employeeId: selectedEmployee,
      category: selectedCategory,
      content: newNote,
      author: 'HR-MGR-101',
      timestamp: new Date().toISOString(),
      isConfidential
    };

    console.log(`[AUDIT] HR Note added for ${selectedEmployee}: ${newNote.substring(0, 50)}...`);

    setNotes([note, ...notes]);
    toast({
      title: "Note Added",
      description: "Internal note saved securely.",
    });

    setNewNote('');
    setSelectedEmployee('');
    setIsConfidential(false);
  };

  return (
    <div className="space-y-4">
      {/* Access Notice */}
      <div className="flex items-center gap-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
        <Lock className="w-4 h-4 text-zinc-500" />
        <span className="text-xs text-zinc-500 font-mono">INTERNAL HR NOTES • NO CLIENT/PARTNER ACCESS</span>
      </div>

      {/* Add Note Form */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            ADD INTERNAL NOTE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 flex-1">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="EMP-1001">EMP-1001 - Employee A</SelectItem>
                <SelectItem value="EMP-1002">EMP-1002 - Employee B</SelectItem>
                <SelectItem value="EMP-1003">EMP-1003 - Employee C</SelectItem>
                <SelectItem value="EMP-1005">EMP-1005 - Employee E</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as HRNote['category'])}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="conduct">Conduct</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter internal note..."
            className="bg-zinc-800 border-zinc-700 min-h-[100px]"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfidential}
                onChange={(e) => setIsConfidential(e.target.checked)}
                className="rounded border-zinc-600"
              />
              <span className="text-sm text-zinc-400">Mark as Confidential</span>
            </label>
            <Button onClick={handleAddNote} className="gap-2">
              <Send className="w-4 h-4" />
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400">
            RECENT NOTES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.map((note, idx) => {
            const categoryConfig = getCategoryConfig(note.category);
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {note.employeeId}
                    </Badge>
                    <Badge className={`text-xs ${categoryConfig.color}`}>
                      {categoryConfig.label}
                    </Badge>
                    {note.isConfidential && (
                      <Badge className="text-xs bg-red-500/20 text-red-400">
                        <Lock className="w-3 h-3 mr-1" />
                        Confidential
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {new Date(note.timestamp).toLocaleString()}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 mb-2">{note.content}</p>
                <div className="flex items-center gap-1 text-xs text-zinc-600">
                  <User className="w-3 h-3" />
                  {note.author}
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
