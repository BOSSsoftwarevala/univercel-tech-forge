import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Edit3,
  History,
  Send,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  type: "ad_copy" | "landing_text" | "email_template";
  title: string;
  version: number;
  status: "draft" | "pending_approval" | "approved" | "rejected";
  lastModified: string;
  campaign: string;
}

const mockContent: ContentItem[] = [
  {
    id: "cnt-001",
    type: "ad_copy",
    title: "Q1 Lead Gen - Primary Headline",
    version: 3,
    status: "approved",
    lastModified: "2024-01-15",
    campaign: "Q1 Lead Generation",
  },
  {
    id: "cnt-002",
    type: "landing_text",
    title: "Product Demo Landing Page",
    version: 2,
    status: "pending_approval",
    lastModified: "2024-01-18",
    campaign: "Demo Request Campaign",
  },
  {
    id: "cnt-003",
    type: "email_template",
    title: "Welcome Sequence - Email 1",
    version: 5,
    status: "draft",
    lastModified: "2024-01-20",
    campaign: "Onboarding Flow",
  },
  {
    id: "cnt-004",
    type: "ad_copy",
    title: "Brand Awareness - Social Copy",
    version: 1,
    status: "rejected",
    lastModified: "2024-01-12",
    campaign: "Brand Awareness Social",
  },
];

const MMContentQueue = () => {
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);

  const getTypeIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "ad_copy": return <FileText className="h-4 w-4 text-cyan-400" />;
      case "landing_text": return <FileText className="h-4 w-4 text-purple-400" />;
      case "email_template": return <FileText className="h-4 w-4 text-teal-400" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: ContentItem["status"]) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Draft</Badge>;
      case "pending_approval":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending Approval</Badge>;
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const item = content.find(c => c.id === id);
    toast({
      title: "Editor Opened",
      description: `Editing "${item?.title}" (v${item?.version}). Changes will create new version.`,
    });
  };

  const handleViewHistory = (id: string) => {
    setHistoryId(id);
    const item = content.find(c => c.id === id);
    toast({
      title: "Version History",
      description: `${item?.title} has ${item?.version} versions. Viewing history.`,
    });
  };

  const handleSubmitApproval = (id: string) => {
    setContent(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'pending_approval' as const } : c
    ));
    toast({
      title: "Submitted for Approval",
      description: `Content submitted. Awaiting boss approval.`,
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <FileText className="h-5 w-5 text-teal-400" />
          Content Queue
          <Badge variant="outline" className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30">
            Versioning ON
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {content.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900/50">
                  {getTypeIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-slate-100">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.campaign}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-slate-500">v{item.version}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-500" />
                <span className="text-xs text-slate-500">{item.lastModified}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => handleEdit(item.id)}
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => handleViewHistory(item.id)}
              >
                <History className="h-3 w-3 mr-1" />
                History
              </Button>
              {item.status === "draft" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-blue-400 hover:text-blue-300 ml-auto"
                  onClick={() => handleSubmitApproval(item.id)}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Submit for Approval
                </Button>
              )}
              {item.status === "rejected" && (
                <div className="flex items-center gap-1 ml-auto text-xs text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  Requires revision
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Approval Flow Notice */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-purple-400">
            ✓ Approval flow is mandatory. All content changes are versioned
            and logged. Direct publishing is BLOCKED.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMContentQueue;
