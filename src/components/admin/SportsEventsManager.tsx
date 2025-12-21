import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Trophy, Calendar, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SportsEvent {
  id: string;
  name: string;
  sport_type: string;
  team1_name: string | null;
  team2_name: string | null;
  team1_color: string | null;
  team2_color: string | null;
  start_date: string;
  end_date: string;
  default_discount: number;
  is_active: boolean;
}

const sportTypes = [
  { value: 'cricket', label: 'Cricket', icon: '🏏' },
  { value: 'football', label: 'Football', icon: '⚽' },
  { value: 'basketball', label: 'Basketball', icon: '🏀' },
  { value: 'tennis', label: 'Tennis', icon: '🎾' },
  { value: 'hockey', label: 'Hockey', icon: '🏑' },
  { value: 'olympics', label: 'Olympics', icon: '🏅' },
  { value: 'esports', label: 'E-Sports', icon: '🎮' },
  { value: 'other', label: 'Other', icon: '🏆' },
];

const defaultEvent: Partial<SportsEvent> = {
  name: '',
  sport_type: 'cricket',
  team1_name: '',
  team2_name: '',
  team1_color: '#1E40AF',
  team2_color: '#DC2626',
  start_date: new Date().toISOString().slice(0, 16),
  end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  default_discount: 40,
  is_active: true,
};

export const SportsEventsManager = () => {
  const [events, setEvents] = useState<SportsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<SportsEvent> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sports_events')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      toast.error('Failed to fetch sports events');
    } else {
      setEvents((data || []) as SportsEvent[]);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editingEvent?.name || !editingEvent?.start_date || !editingEvent?.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const eventData = {
      ...editingEvent,
      start_date: new Date(editingEvent.start_date!).toISOString(),
      end_date: new Date(editingEvent.end_date!).toISOString(),
    };

    if (isEditing && editingEvent.id) {
      const { id, ...updateData } = eventData;
      const { error } = await supabase
        .from('sports_events')
        .update(updateData as any)
        .eq('id', editingEvent.id);

      if (error) {
        toast.error('Failed to update event');
      } else {
        toast.success('Event updated successfully');
        fetchEvents();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('sports_events')
        // @ts-ignore - name is validated above
        .insert([eventData]);

      if (error) {
        toast.error('Failed to create event');
      } else {
        toast.success('Event created successfully');
        fetchEvents();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sports event?')) return;

    const { error } = await supabase
      .from('sports_events')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete event');
    } else {
      toast.success('Event deleted');
      fetchEvents();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('sports_events')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      fetchEvents();
    }
  };

  const openCreateDialog = () => {
    setEditingEvent({ ...defaultEvent });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: SportsEvent) => {
    setEditingEvent({
      ...event,
      start_date: new Date(event.start_date).toISOString().slice(0, 16),
      end_date: new Date(event.end_date).toISOString().slice(0, 16),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getSportIcon = (type: string) => {
    return sportTypes.find(s => s.value === type)?.icon || '🏆';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sports Events</h2>
          <p className="text-muted-foreground">
            Manage sports tournament offers with team-themed colors
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              {/* Team colors bar */}
              <div className="h-2 flex">
                <div 
                  className="flex-1"
                  style={{ backgroundColor: event.team1_color || '#1E40AF' }}
                />
                <div 
                  className="flex-1"
                  style={{ backgroundColor: event.team2_color || '#DC2626' }}
                />
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getSportIcon(event.sport_type)}</span>
                    <div>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <span className="text-xs text-muted-foreground capitalize">
                        {event.sport_type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {event.team1_name && event.team2_name && (
                  <div className="flex items-center justify-center gap-3 py-2">
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: event.team1_color || '#1E40AF' }}
                      />
                      <span className="text-xs">{event.team1_name}</span>
                    </div>
                    <span className="text-lg font-bold text-muted-foreground">VS</span>
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: event.team2_color || '#DC2626' }}
                      />
                      <span className="text-xs">{event.team2_name}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-sm">
                    {event.default_discount}% OFF
                  </span>
                  <Switch
                    checked={event.is_active}
                    onCheckedChange={() => toggleActive(event.id, event.is_active)}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No sports events configured</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Sports Event' : 'Add Sports Event'}
            </DialogTitle>
          </DialogHeader>

          {editingEvent && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="flex justify-center gap-4 mb-2">
                  <div>
                    <div 
                      className="w-10 h-10 rounded-full mx-auto"
                      style={{ backgroundColor: editingEvent.team1_color || '#1E40AF' }}
                    />
                    <span className="text-xs">{editingEvent.team1_name || 'Team 1'}</span>
                  </div>
                  <span className="text-xl font-bold self-center">VS</span>
                  <div>
                    <div 
                      className="w-10 h-10 rounded-full mx-auto"
                      style={{ backgroundColor: editingEvent.team2_color || '#DC2626' }}
                    />
                    <span className="text-xs">{editingEvent.team2_name || 'Team 2'}</span>
                  </div>
                </div>
                <span className="text-2xl">{getSportIcon(editingEvent.sport_type || 'cricket')}</span>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Event Name *</Label>
                  <Input
                    value={editingEvent.name || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                    placeholder="IPL Final 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sport Type</Label>
                  <Select
                    value={editingEvent.sport_type}
                    onValueChange={(value) => setEditingEvent({ ...editingEvent, sport_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sportTypes.map((sport) => (
                        <SelectItem key={sport.value} value={sport.value}>
                          <span className="flex items-center gap-2">
                            <span>{sport.icon}</span>
                            <span>{sport.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Team 1 Name</Label>
                    <Input
                      value={editingEvent.team1_name || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, team1_name: e.target.value })}
                      placeholder="India"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Team 2 Name</Label>
                    <Input
                      value={editingEvent.team2_name || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, team2_name: e.target.value })}
                      placeholder="Australia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Team 1 Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editingEvent.team1_color || '#1E40AF'}
                        onChange={(e) => setEditingEvent({ ...editingEvent, team1_color: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={editingEvent.team1_color || '#1E40AF'}
                        onChange={(e) => setEditingEvent({ ...editingEvent, team1_color: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Team 2 Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editingEvent.team2_color || '#DC2626'}
                        onChange={(e) => setEditingEvent({ ...editingEvent, team2_color: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={editingEvent.team2_color || '#DC2626'}
                        onChange={(e) => setEditingEvent({ ...editingEvent, team2_color: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Discount %</Label>
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={editingEvent.default_discount || 40}
                    onChange={(e) => setEditingEvent({ 
                      ...editingEvent, 
                      default_discount: parseInt(e.target.value) || 40 
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="datetime-local"
                      value={editingEvent.start_date || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Input
                      type="datetime-local"
                      value={editingEvent.end_date || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingEvent.is_active ?? true}
                    onCheckedChange={(checked) => setEditingEvent({ ...editingEvent, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SportsEventsManager;
