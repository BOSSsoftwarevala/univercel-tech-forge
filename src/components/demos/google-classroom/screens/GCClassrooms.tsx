import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, MoreVertical, Users, ClipboardList, Copy, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { demoClassrooms, demoClassMembers, demoAssignments } from '../gcDemoData';

export function GCClassrooms() {
  const [classrooms, setClassrooms] = useState<any[]>(demoClassrooms);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', section: '', subject: '', room: '', description: '' });

  useEffect(() => { fetchClassrooms(); }, []);

  const fetchClassrooms = async () => {
    try {
      const { data } = await supabase
        .from('gc_classrooms')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      if (data && data.length > 0) setClassrooms(data);
    } catch {}
  };

  const createClassroom = async () => {
    if (!form.name.trim()) { toast.error('Class name required'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Please login first'); return; }

    const { error } = await supabase.from('gc_classrooms').insert({
      name: form.name,
      section: form.section || null,
      subject: form.subject || null,
      room: form.room || null,
      description: form.description || null,
      owner_id: user.id,
    });

    if (error) { toast.error(error.message); return; }
    toast.success('Classroom created!');
    setShowCreate(false);
    setForm({ name: '', section: '', subject: '', room: '', description: '' });
    fetchClassrooms();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Class code copied!');
  };

  const classColors = ['#1967d2', '#0d904f', '#e37400', '#8430ce', '#d93025', '#137333'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Classrooms</h1>
          <p className="text-sm text-gray-500 mt-1">{classrooms.length} active classes</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1967d2] text-white rounded-lg hover:bg-[#1557b0] text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map((cls, i) => {
          const members = demoClassMembers[cls.id] || { students: 0, teachers: 1 };
          const assignmentCount = demoAssignments.filter(a => a.classroom_id === cls.id).length;
          return (
            <div key={cls.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-28 p-4 flex flex-col justify-between relative" style={{ backgroundColor: classColors[i % classColors.length] }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">{cls.name}</h3>
                    <p className="text-white/80 text-sm truncate">{cls.section || 'No section'}</p>
                  </div>
                  <button className="p-1 hover:bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-white/70 text-xs">{cls.subject || ''}</p>
              </div>
              <div className="p-4 space-y-3">
                {cls.description && <p className="text-sm text-gray-600 line-clamp-2">{cls.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {members.students} students</span>
                    <span className="flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" /> {assignmentCount} work</span>
                  </div>
                  <button onClick={() => copyCode(cls.class_code)} className="flex items-center gap-1 text-xs text-[#1967d2] hover:underline" title="Copy class code">
                    <Copy className="w-3 h-3" /> {cls.class_code}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Create Classroom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Class Name *</label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mathematics 101" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Section</label>
                <Input value={form.section} onChange={(e) => setForm(p => ({ ...p, section: e.target.value }))} placeholder="e.g. Section A" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Math" className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Room</label>
              <Input value={form.room} onChange={(e) => setForm(p => ({ ...p, room: e.target.value }))} placeholder="e.g. Room 204" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea 
                value={form.description} 
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} 
                placeholder="Brief description..." 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#1967d2]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={createClassroom} className="bg-[#1967d2] hover:bg-[#1557b0]">Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}