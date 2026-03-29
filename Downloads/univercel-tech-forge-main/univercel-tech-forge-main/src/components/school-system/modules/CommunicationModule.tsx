/**
 * Communication Module
 * Notices, circulars, and messaging
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, Plus, Bell, Send, Users, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchoolData, useSchoolCRUD } from "@/hooks/useSchoolData";
import { toast } from "sonner";

export const CommunicationModule = () => {
  const { notices, institution, refresh } = useSchoolData();
  const { publishNotice, loading } = useSchoolCRUD();
  const [isOpen, setIsOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    notice_type: 'general'
  });

  const handlePublish = async () => {
    if (!institution?.id || !newNotice.title || !newNotice.content) {
      toast.error('Please fill all fields');
      return;
    }

    const { error } = await publishNotice({
      institution_id: institution.id,
      title: newNotice.title,
      content: newNotice.content,
      notice_type: newNotice.notice_type,
      created_by: 'system' // Would be actual staff ID
    });

    if (error) {
      toast.error('Failed to publish: ' + error.message);
    } else {
      toast.success('Notice published successfully');
      setIsOpen(false);
      setNewNotice({ title: '', content: '', notice_type: 'general' });
      refresh();
    }
  };

  const getNoticeTypeColor = (type: string | null) => {
    switch(type) {
      case 'urgent': return 'bg-red-500/20 text-red-400';
      case 'academic': return 'bg-blue-500/20 text-blue-400';
      case 'event': return 'bg-purple-500/20 text-purple-400';
      case 'holiday': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-amber-500" />
            Communication Hub
          </h2>
          <p className="text-slate-400">Send notices, circulars, and messages</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> New Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Publish Notice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Title *</Label>
                <Input 
                  value={newNotice.title}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notice title"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select 
                  value={newNotice.notice_type} 
                  onValueChange={(val) => setNewNotice(prev => ({ ...prev, notice_type: val }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea 
                  value={newNotice.content}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Notice content..."
                  className="bg-slate-700 border-slate-600 min-h-32"
                />
              </div>
              <Button 
                onClick={handlePublish} 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Publishing...' : 'Publish Notice'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Notices", value: notices.length.toString(), icon: Bell, color: "bg-blue-500" },
          { label: "Published", value: notices.filter(n => n.is_published).length.toString(), icon: Send, color: "bg-green-500" },
          { label: "This Month", value: notices.length.toString(), icon: Calendar, color: "bg-purple-500" },
          { label: "Audience", value: "All", icon: Users, color: "bg-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notices List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No notices published yet</p>
              <Button className="bg-amber-500" onClick={() => setIsOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Create First Notice
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice, idx) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">{notice.title}</h4>
                    <Badge className={getNoticeTypeColor(notice.notice_type)}>
                      {notice.notice_type || 'general'}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{notice.content}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(notice.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
