import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Rocket, Play, Pause, Plus, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CampaignManagementProps { activeView: string; }

interface Campaign {
  id?: string;
  name: string;
  status: string;
  budget: number;
  leads: number;
  channel: string;
  region: string;
}

const CampaignManagement = ({ activeView }: CampaignManagementProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { name: "Summer Sale 2024", status: "active", budget: 5000, leads: 245, channel: "google", region: "India" },
    { name: "Product Launch", status: "active", budget: 8000, leads: 189, channel: "meta", region: "USA" },
    { name: "Black Friday", status: "scheduled", budget: 15000, leads: 0, channel: "google", region: "Global" },
    { name: "Retargeting Q4", status: "paused", budget: 2500, leads: 89, channel: "meta", region: "Europe" },
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    channel: "google",
    region: "India",
    status: "active"
  });

  const handleCreateCampaign = async () => {
    if (!formData.name || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Add campaign to local state (mock - can be connected to DB later)
      const newCampaign: Campaign = {
        id: crypto.randomUUID(),
        name: formData.name,
        budget: parseFloat(formData.budget),
        leads: 0,
        status: formData.status,
        channel: formData.channel,
        region: formData.region
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      toast.success(`Campaign "${formData.name}" created successfully!`);
      setIsOpen(false);
      setFormData({ name: "", budget: "", channel: "google", region: "India", status: "active" });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCampaignStatus = (idx: number) => {
    setCampaigns(prev => prev.map((c, i) => {
      if (i === idx) {
        const newStatus = c.status === 'active' ? 'paused' : 'active';
        toast.success(`Campaign "${c.name}" ${newStatus}`);
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Campaign Management</h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-1" />Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-teal-400" />
                Create New Campaign
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Campaign Name *</Label>
                <Input
                  placeholder="e.g. Summer Sale 2024"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Budget (₹) *</Label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-300">Channel</Label>
                  <Select value={formData.channel} onValueChange={(v) => setFormData(prev => ({ ...prev, channel: v }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="meta">Meta Ads</SelectItem>
                      <SelectItem value="youtube">YouTube Ads</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Region</Label>
                  <Select value={formData.region} onValueChange={(v) => setFormData(prev => ({ ...prev, region: v }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Initial Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  onClick={handleCreateCampaign}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {campaigns.map((c, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="w-8 h-8 text-teal-400" />
                  <div>
                    <h4 className="font-medium text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400">Budget: ₹{c.budget.toLocaleString()} • {c.channel} • {c.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : c.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}>{c.status.toUpperCase()}</Badge>
                  <span className="text-sm text-white">{c.leads} leads</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 w-7 p-0"
                    onClick={() => toggleCampaignStatus(idx)}
                  >
                    {c.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="w-3 h-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignManagement;
