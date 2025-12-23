import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Calendar, Gift, Trophy, 
  Sparkles, Eye, EyeOff, Save, X, Palette 
} from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface GlobalOffer {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number;
  event_type: 'festival' | 'sports' | 'custom';
  event_name: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_auto_detected: boolean;
  theme_primary_color: string;
  theme_secondary_color: string;
  theme_accent_color: string;
  banner_text: string | null;
  icon: string | null;
}

const defaultOffer: Partial<GlobalOffer> = {
  title: '',
  description: '',
  discount_percentage: 40,
  event_type: 'festival',
  event_name: '',
  start_date: new Date().toISOString().slice(0, 16),
  end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  is_active: true,
  theme_primary_color: '#8B5CF6',
  theme_secondary_color: '#06B6D4',
  theme_accent_color: '#F59E0B',
  banner_text: '',
  icon: '🎉',
};

const eventIcons = ['🎉', '🎊', '🎁', '🪔', '🎄', '🎃', '💕', '🏆', '⚽', '🏏', '🎮', '🌟', '✨', '🔥'];

export const GlobalOffersManager = () => {
  const [offers, setOffers] = useState<GlobalOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<GlobalOffer> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('global_offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch offers');
      console.error(error);
    } else {
      setOffers((data || []) as GlobalOffer[]);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editingOffer?.title || !editingOffer?.start_date || !editingOffer?.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const offerData = {
      title: editingOffer.title,
      description: editingOffer.description || null,
      discount_percentage: editingOffer.discount_percentage || 0,
      event_type: editingOffer.event_type || 'custom',
      event_name: editingOffer.event_name || null,
      start_date: new Date(editingOffer.start_date!).toISOString(),
      end_date: new Date(editingOffer.end_date!).toISOString(),
      is_active: editingOffer.is_active ?? true,
      is_auto_detected: editingOffer.is_auto_detected ?? false,
      theme_primary_color: editingOffer.theme_primary_color || '#3b82f6',
      theme_secondary_color: editingOffer.theme_secondary_color || '#1e40af',
      theme_accent_color: editingOffer.theme_accent_color || '#60a5fa',
      banner_text: editingOffer.banner_text || null,
      icon: editingOffer.icon || null,
    };

    if (isEditing && editingOffer.id) {
      const { error } = await supabase
        .from('global_offers')
        .update(offerData)
        .eq('id', editingOffer.id);

      if (error) {
        toast.error('Failed to update offer');
        console.error(error);
      } else {
        toast.success('Offer updated successfully');
        fetchOffers();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('global_offers')
        .insert([offerData]);

      if (error) {
        toast.error('Failed to create offer');
        console.error(error);
      } else {
        toast.success('Offer created successfully');
        fetchOffers();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    const { error } = await supabase
      .from('global_offers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete offer');
    } else {
      toast.success('Offer deleted');
      fetchOffers();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('global_offers')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(currentStatus ? 'Offer disabled' : 'Offer enabled');
      fetchOffers();
    }
  };

  const openCreateDialog = () => {
    setEditingOffer({ ...defaultOffer });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (offer: GlobalOffer) => {
    setEditingOffer({
      ...offer,
      start_date: new Date(offer.start_date).toISOString().slice(0, 16),
      end_date: new Date(offer.end_date).toISOString().slice(0, 16),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sports': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'festival': return <Gift className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Global Offers Manager</h2>
          <p className="text-muted-foreground">
            Manage festival & sports event offers for all users
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Offer
        </Button>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card 
              className="relative overflow-hidden"
              style={{
                borderColor: offer.is_active ? offer.theme_primary_color : undefined,
              }}
            >
              {/* Theme preview bar */}
              <div 
                className="h-2"
                style={{
                  background: `linear-gradient(90deg, ${offer.theme_primary_color}, ${offer.theme_secondary_color})`,
                }}
              />
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {offer.icon && <span className="text-2xl">{offer.icon}</span>}
                    {getEventIcon(offer.event_type)}
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleActive(offer.id, offer.is_active)}
                    >
                      {offer.is_active ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(offer)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(offer.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {offer.description || 'No description'}
                </p>

                <div className="flex items-center justify-between">
                  <span 
                    className="px-3 py-1 rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: offer.theme_accent_color }}
                  >
                    {offer.discount_percentage}% OFF
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    offer.is_active ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Color preview */}
                <div className="flex gap-1">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-background"
                    style={{ backgroundColor: offer.theme_primary_color }}
                    title="Primary Color"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-background"
                    style={{ backgroundColor: offer.theme_secondary_color }}
                    title="Secondary Color"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-background"
                    style={{ backgroundColor: offer.theme_accent_color }}
                    title="Accent Color"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {offers.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No offers created yet</p>
          <p className="text-sm">Create your first global offer to get started</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Offer' : 'Create New Offer'}
            </DialogTitle>
          </DialogHeader>

          {editingOffer && (
            <div className="space-y-4">
              {/* Preview Banner */}
              <div 
                className="p-4 rounded-lg text-white text-center"
                style={{
                  background: `linear-gradient(135deg, ${editingOffer.theme_primary_color}, ${editingOffer.theme_secondary_color})`,
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{editingOffer.icon}</span>
                  <span className="font-bold">{editingOffer.title || 'Offer Title'}</span>
                </div>
                <span 
                  className="inline-block px-4 py-1 rounded-full font-bold"
                  style={{ backgroundColor: editingOffer.theme_accent_color }}
                >
                  {editingOffer.discount_percentage}% OFF
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={editingOffer.title || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    placeholder="New Year Sale!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={editingOffer.event_type}
                    onValueChange={(value: 'festival' | 'sports' | 'custom') => 
                      setEditingOffer({ ...editingOffer, event_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingOffer.description || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    placeholder="Celebrate with exclusive discounts..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discount Percentage</Label>
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={editingOffer.discount_percentage || 40}
                    onChange={(e) => setEditingOffer({ 
                      ...editingOffer, 
                      discount_percentage: parseInt(e.target.value) || 40 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Banner Text</Label>
                  <Input
                    value={editingOffer.banner_text || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, banner_text: e.target.value })}
                    placeholder="🎊 Special Sale - 40% OFF! 🎊"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="datetime-local"
                    value={editingOffer.start_date || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input
                    type="datetime-local"
                    value={editingOffer.end_date || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, end_date: e.target.value })}
                  />
                </div>

                {/* Icon Selector */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {eventIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setEditingOffer({ ...editingOffer, icon })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border-2 transition-all ${
                          editingOffer.icon === icon 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Primary Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={editingOffer.theme_primary_color || '#8B5CF6'}
                      onChange={(e) => setEditingOffer({ 
                        ...editingOffer, 
                        theme_primary_color: e.target.value 
                      })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={editingOffer.theme_primary_color || '#8B5CF6'}
                      onChange={(e) => setEditingOffer({ 
                        ...editingOffer, 
                        theme_primary_color: e.target.value 
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Secondary Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={editingOffer.theme_secondary_color || '#06B6D4'}
                      onChange={(e) => setEditingOffer({ 
                        ...editingOffer, 
                        theme_secondary_color: e.target.value 
                      })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={editingOffer.theme_secondary_color || '#06B6D4'}
                      onChange={(e) => setEditingOffer({ 
                        ...editingOffer, 
                        theme_secondary_color: e.target.value 
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Accent Color (Discount Badge)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={editingOffer.theme_accent_color || '#F59E0B'}
                      onChange={(e) => setEditingOffer({ 
                        ...editingOffer, 
                        theme_accent_color: e.target.value 
                      })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={editingOffer.theme_accent_color || '#F59E0B'}
                      onChange={(e) => setEditingOffer({ 
                        ...editingOffer, 
                        theme_accent_color: e.target.value 
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 md:col-span-2">
                  <Switch
                    checked={editingOffer.is_active ?? true}
                    onCheckedChange={(checked) => 
                      setEditingOffer({ ...editingOffer, is_active: checked })
                    }
                  />
                  <Label>Active (visible to all users)</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update' : 'Create'} Offer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalOffersManager;
