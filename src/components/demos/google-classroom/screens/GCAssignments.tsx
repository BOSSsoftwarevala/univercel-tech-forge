import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, ClipboardList, Calendar, FileText, HelpCircle, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { demoAssignments, demoClassrooms } from '../gcDemoData';

export function GCAssignments() {
  const [assignments, setAssignments] = useState<any[]>(demoAssignments);
  const [classrooms, setClassrooms] = useState<any[]>(demoClassrooms);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', classroom_id: '', max_points: '100', assignment_type: 'assignment', due_date: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [aRes, cRes] = await Promise.all([
        supabase.from('gc_assignments').select('*, gc_classrooms(name)').order('created_at', { ascending: false }),
        supabase.from('gc_classrooms').select('id, name').eq('is_archived', false),
      ]);
      if (aRes.data && aRes.data.length > 0) setAssignments(aRes.data.map(a => ({ ...a, classroom_name: (a as any).gc_classrooms?.name })));
      if (cRes.data && cRes.data.length > 0) setClassrooms(cRes.data);
    } catch {}
  };

  const createAssignment = async () => {
    if (!form.title.trim() || !form.classroom_id) { toast.error('Title and classroom required'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Please login'); return; }

    const { error } = await supabase.from('gc_assignments').insert({
      title: form.title,
      description: form.description || null,
      classroom_id: form.classroom_id,
      max_points: parseInt(form.max_points) || 100,
      assignment_type: form.assignment_type as any,
      due_date: form.due_date || null,
      created_by: user.id,
    });

    if (error) { toast.error(error.message); return; }
    toast.success('Assignment created!');
    setShowCreate(false);
    setForm({ title: '', description: '', classroom_id: '', max_points: '100', assignment_type: 'assignment', due_date: '' });
    fetchData();
  };

  const typeIcons: Record<string, React.ElementType> = {
    assignment: ClipboardList,
    quiz: HelpCircle,
    material: BookOpen,
    question: FileText,
  };

  const typeColors: Record<string, string> = {
    assignment: '#1967d2',
    quiz: '#e37400',
    material: '#0d904f',
    question: '#8430ce',
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    published: { bg: '#e6f4ea', text: '#0d904f' },
    draft: { bg: '#fef3e0', text: '#e37400' },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Classwork</h1>
          <p className="text-sm text-gray-500 mt-1">{assignments.length} assignments across all classes</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1967d2] text-white rounded-lg hover:bg-[#1557b0] text-sm font-medium">
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      <div className="space-y-3">
        {assignments.map((a) => {
          const Icon = typeIcons[a.assignment_type] || ClipboardList;
          const color = typeColors[a.assignment_type] || '#1967d2';
          const sc = statusColors[a.status] || statusColors.published;
          const isOverdue = a.due_date && new Date(a.due_date) < new Date();
          return (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium text-gray-800 truncate">{a.title}</h3>
                    <Badge variant="outline" className="text-xs capitalize">{a.assignment_type}</Badge>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>{a.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{a.classroom_name || 'Unknown class'}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                    {a.max_points > 0 && <span>{a.max_points} points</span>}
                    {a.due_date && (
                      <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                        <Calendar className="w-3 h-3" />
                        {isOverdue ? 'Overdue' : 'Due'} {new Date(a.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {a.submissions_count > 0 && <span>{a.submissions_count} turned in</span>}
                    {a.graded_count > 0 && <span>{a.graded_count} graded</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader><DialogTitle className="text-gray-800">Create Assignment</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Classroom *</label>
              <select 
                value={form.classroom_id} 
                onChange={(e) => setForm(p => ({ ...p, classroom_id: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1967d2]"
              >
                <option value="">Select classroom</option>
                {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select value={form.assignment_type} onChange={(e) => setForm(p => ({ ...p, assignment_type: e.target.value }))} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1967d2]">
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="material">Material</option>
                  <option value="question">Question</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Points</label>
                <Input type="number" value={form.max_points} onChange={(e) => setForm(p => ({ ...p, max_points: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <Input type="datetime-local" value={form.due_date} onChange={(e) => setForm(p => ({ ...p, due_date: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Instructions..." className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#1967d2]" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={createAssignment} className="bg-[#1967d2] hover:bg-[#1557b0]">Assign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}