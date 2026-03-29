import React, { useState } from 'react';
import { Megaphone, Plus, Pin, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { demoAnnouncements, demoClassrooms } from '../gcDemoData';

export function GCAnnouncements() {
  const [announcements] = useState(demoAnnouncements);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ content: '', classroom_id: '' });

  const createAnnouncement = async () => {
    if (!form.content.trim() || !form.classroom_id) { toast.error('Content and classroom required'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Please login'); return; }

    const { error } = await supabase.from('gc_announcements').insert({
      content: form.content,
      classroom_id: form.classroom_id,
      author_id: user.id,
    });

    if (error) { toast.error(error.message); return; }
    toast.success('Announcement posted!');
    setShowCreate(false);
    setForm({ content: '', classroom_id: '' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Stream</h1>
          <p className="text-sm text-gray-500 mt-1">{announcements.length} announcements</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1967d2] text-white rounded-lg hover:bg-[#1557b0] text-sm font-medium">
          <Plus className="w-4 h-4" /> Announce
        </button>
      </div>

      {/* Post box */}
      <div 
        onClick={() => setShowCreate(true)}
        className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1967d2] flex items-center justify-center text-white font-medium">RI</div>
          <p className="text-gray-400 text-sm">Announce something to your class...</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1967d2] flex items-center justify-center text-white font-medium shrink-0">
                {a.author_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800 text-sm">{a.author_name}</span>
                  <span className="text-xs text-gray-400">• {a.classroom_name}</span>
                  <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  {a.is_pinned && <Pin className="w-3 h-3 text-[#1967d2]" />}
                </div>
                <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed">{a.content}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1967d2]">
                    <MessageCircle className="w-3.5 h-3.5" /> Add comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader><DialogTitle className="text-gray-800">Post Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Classroom *</label>
              <select value={form.classroom_id} onChange={(e) => setForm(p => ({ ...p, classroom_id: e.target.value }))} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1967d2]">
                <option value="">Select classroom</option>
                {demoClassrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Announcement *</label>
              <textarea value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Share with your class..." className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#1967d2]" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={createAnnouncement} className="bg-[#1967d2] hover:bg-[#1557b0]">Post</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}