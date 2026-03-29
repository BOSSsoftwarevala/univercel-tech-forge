import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Rocket, Play, Pause, Plus, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface CampaignManagementProps { activeView: string; }

const CampaignManagement = ({ activeView }: CampaignManagementProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    channel: "google",
    region: "India",
    status: "active",
  });

  const campaignsQuery = useQuery({
    queryKey: ["marketing-manager", "campaigns", activeView],
    queryFn: marketingManagerApi.getCampaigns,
    staleTime: 20_000,
  });

  const performanceQuery = useQuery({
    queryKey: ["marketing-manager", "campaign-performance", activeView],
    queryFn: () => marketingManagerApi.getCampaignPerformance(),
    staleTime: 20_000,
  });

  const performanceMap = useMemo(() => {
    const entries = performanceQuery.data?.campaigns || [];
    return new Map(entries.map((campaign) => [campaign.id, campaign]));
  }, [performanceQuery.data]);

  const filteredCampaigns = useMemo(() => {
    const campaigns = campaignsQuery.data || [];

    if (activeView === "pause") {
      return campaigns.filter((campaign) => campaign.status === "active" || campaign.status === "paused");
    }

    if (activeView === "approval") {
      return campaigns.filter((campaign) => campaign.approval_status !== "approved");
    }

    return campaigns;
  }, [activeView, campaignsQuery.data]);

  const invalidateCampaigns = async () => {
    await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "campaigns"] });
    await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "campaign-performance"] });
    await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "dashboard"] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof marketingManagerApi.createCampaign>[0]) => marketingManagerApi.createCampaign(payload),
    onSuccess: async (campaign) => {
      toast.success(`Campaign \"${campaign.name}\" created`);
      setIsOpen(false);
      setEditingCampaignId(null);
      setFormData({ name: "", budget: "", channel: "google", region: "India", status: "active" });
      await invalidateCampaigns();
    },
    onError: () => {
      toast.error("Failed to create campaign");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof marketingManagerApi.updateCampaign>[0]) => marketingManagerApi.updateCampaign(payload),
    onSuccess: async (campaign) => {
      toast.success(`Campaign \"${campaign.name}\" updated`);
      setIsOpen(false);
      setEditingCampaignId(null);
      setFormData({ name: "", budget: "", channel: "google", region: "India", status: "active" });
      await invalidateCampaigns();
    },
    onError: () => {
      toast.error("Failed to update campaign");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (campaignId: string) => marketingManagerApi.toggleCampaign(campaignId),
    onSuccess: async (campaign) => {
      toast.success(`Campaign \"${campaign.name}\" is now ${campaign.status}`);
      await invalidateCampaigns();
    },
    onError: () => {
      toast.error("Failed to update campaign status");
    },
  });

  const approvalMutation = useMutation({
    mutationFn: (campaignId: string) => marketingManagerApi.updateCampaign({ campaign_id: campaignId, approval_status: "approved" }),
    onSuccess: async (campaign) => {
      toast.success(`Campaign \"${campaign.name}\" approved`);
      await invalidateCampaigns();
    },
    onError: () => {
      toast.error("Failed to approve campaign");
    },
  });

  const performanceMutation = useMutation({
    mutationFn: (campaignId: string) => marketingManagerApi.getCampaignPerformance(campaignId),
    onSuccess: (result) => {
      const campaign = result.campaigns[0];
      if (!campaign) {
        toast.error("No performance report found");
        return;
      }

      toast.success(`ROI ${campaign.roi.toFixed(1)}% • pacing ${campaign.pacing.toFixed(1)}%`);
    },
    onError: () => {
      toast.error("Failed to load campaign performance");
    },
  });

  const handleCreateCampaign = async () => {
    if (!formData.name || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        budget: Number(formData.budget),
        channel: formData.channel,
        objective: `${formData.region} growth`,
        platform: formData.channel,
        status: formData.status,
      };

      if (editingCampaignId) {
        await updateMutation.mutateAsync({
          campaign_id: editingCampaignId,
          ...payload,
          metadata: { region: formData.region },
        });
      } else {
        await createMutation.mutateAsync({
          ...payload,
          channels: [formData.channel],
          targetAudience: { region: formData.region },
        });
      }
    } catch (error) {
      console.error("Error saving campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (campaignId: string) => {
    const campaign = (campaignsQuery.data || []).find((item) => item.id === campaignId);
    if (!campaign) {
      toast.error("Campaign not found");
      return;
    }

    setEditingCampaignId(campaign.id);
    setFormData({
      name: campaign.name,
      budget: String(campaign.budget),
      channel: campaign.channel,
      region: String(campaign.metadata?.region || "India"),
      status: campaign.status,
    });
    setIsOpen(true);
  };

  const visibleTitle = {
    create: "Campaign Creation",
    edit: "Campaign Editing",
    pause: "Pause / Resume Campaigns",
    approval: "Campaign Approvals",
    summary: "Campaign Summary",
  }[activeView] || "Campaign Management";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{visibleTitle}</h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-1" />{editingCampaignId ? "Edit Campaign" : "Create Campaign"}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-teal-400" />
                {editingCampaignId ? "Edit Campaign" : "Create New Campaign"}
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
                  onClick={() => {
                    setIsOpen(false);
                    setEditingCampaignId(null);
                    setFormData({ name: "", budget: "", channel: "google", region: "India", status: "active" });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  onClick={handleCreateCampaign}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                  {editingCampaignId ? "Save" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => {
          const performance = performanceMap.get(campaign.id);
          const region = String(campaign.metadata?.region || campaign.metadata?.country || "Global");

          return (
          <Card key={campaign.id} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="w-8 h-8 text-teal-400" />
                  <div>
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <p className="text-xs text-slate-400">Budget: ₹{campaign.budget.toLocaleString()} • {campaign.channel} • {region}</p>
                    <p className="text-xs text-slate-500">ROI {performance?.roi?.toFixed(1) || "0.0"}% • Leads {campaign.leads_generated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={campaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : campaign.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}>{campaign.status.toUpperCase()}</Badge>
                  <Badge className={campaign.approval_status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}>{campaign.approval_status.toUpperCase()}</Badge>
                  <span className="text-sm text-white">{campaign.leads_generated} leads</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 w-7 p-0"
                    onClick={() => toggleMutation.mutate(campaign.id)}
                  >
                    {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEditDialog(campaign.id)}><Edit className="w-3 h-3" /></Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-200" onClick={() => performanceMutation.mutate(campaign.id)}>Performance</Button>
                  {campaign.approval_status !== "approved" ? (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approvalMutation.mutate(campaign.id)}>Approve</Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>
    </div>
  );
};

export default CampaignManagement;
