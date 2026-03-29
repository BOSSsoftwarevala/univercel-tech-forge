import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlusCircle, 
  AlertTriangle,
  Send,
  Lock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { MarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

interface CampaignForm {
  name: string;
  objective: string;
  channel: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  kpi: string;
  budget: string;
}

const initialForm: CampaignForm = {
  name: "",
  objective: "",
  channel: "",
  targetAudience: "",
  startDate: "",
  endDate: "",
  kpi: "",
  budget: "25000",
};

interface MMCampaignCreatorProps {
  system: MarketingManagerSystem;
}

const MMCampaignCreator = ({ system }: MMCampaignCreatorProps) => {
  const [form, setForm] = useState<CampaignForm>(initialForm);

  const handleChange = (field: keyof CampaignForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!form.name || !form.objective || !form.channel || !form.targetAudience || !form.startDate || !form.endDate || !form.kpi || !form.budget) {
      toast({
        title: "Validation Error",
        description: "All fields are required for campaign creation.",
        variant: "destructive",
      });
      return;
    }

    system.createCampaignMutation.mutate({
      name: form.name,
      objective: form.objective,
      channel: form.channel,
      budget: Number(form.budget),
      platform: form.channel,
      channels: [form.channel],
      targetAudience: {
        primary: form.targetAudience,
        kpi: form.kpi,
      },
      niche: form.kpi,
      cta: "Book free strategy call",
      start_date: form.startDate,
      end_date: form.endDate,
    }, {
      onSuccess: (campaign) => {
        toast({
          title: "Campaign Created",
          description: campaign.approval_status === "pending"
            ? "Campaign submitted into approval workflow."
            : "Campaign launched with live automation enabled.",
        });
        setForm(initialForm);
      },
      onError: (error) => {
        toast({
          title: "Campaign Creation Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const isFormValid = form.name && form.objective && form.channel && form.targetAudience && form.startDate && form.endDate && form.kpi && form.budget;

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <PlusCircle className="h-5 w-5 text-emerald-400" />
          Create Campaign
          <Badge variant="outline" className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30">
            Approval Required
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning Banner */}
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
          <div>
            <p className="text-xs text-red-400 font-medium">Auto-publish BLOCKED</p>
            <p className="text-xs text-red-400/70">
              Pricing edit BLOCKED. All campaigns require approval workflow.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label className="text-slate-300">Campaign Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter campaign name"
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <Label className="text-slate-300">Objective *</Label>
            <Select value={form.objective} onValueChange={(v) => handleChange("objective", v)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead Generation</SelectItem>
                <SelectItem value="demo">Demo Request</SelectItem>
                <SelectItem value="brand">Brand Awareness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Channel */}
          <div className="space-y-2">
            <Label className="text-slate-300">Channel *</Label>
            <Select value={form.channel} onValueChange={(v) => handleChange("channel", v)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google_ads">Google Ads</SelectItem>
                <SelectItem value="meta_ads">Meta Ads</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="social">Social (Organic)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label className="text-slate-300">Target Audience *</Label>
            <Input
              value={form.targetAudience}
              onChange={(e) => handleChange("targetAudience", e.target.value)}
              placeholder="e.g., SMB Decision Makers 25-45"
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Budget *</Label>
            <Input
              type="number"
              min="1000"
              value={form.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              placeholder="25000"
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">Start Date *</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">End Date *</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
          </div>

          {/* KPI */}
          <div className="space-y-2">
            <Label className="text-slate-300">KPI *</Label>
            <Input
              value={form.kpi}
              onChange={(e) => handleChange("kpi", e.target.value)}
              placeholder="e.g., 500 MQLs, 1M Impressions"
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit for Approval
              </>
            )}
          </Button>

          {/* Pricing Block Notice */}
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-500" />
            <p className="text-xs text-slate-500">
              Budget and pricing controls are managed externally. No edit access.
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MMCampaignCreator;
