import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Upload,
  Search,
  Sparkles,
  Eye,
  XCircle,
  RefreshCw,
  Building,
  CreditCard,
  Globe,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientSuccessAI } from "@/hooks/useClientSuccessAI";
import { toast } from "sonner";

const kycSubmissions = [
  {
    id: "kyc-001",
    clientName: "TechCorp Industries",
    documentType: "Business License",
    submittedAt: "2 hours ago",
    status: "pending",
    riskLevel: "low",
    completeness: 85,
    documents: ["Business License", "Tax ID", "Bank Statement"],
    missingDocs: ["Proof of Address"]
  },
  {
    id: "kyc-002",
    clientName: "StartupX",
    documentType: "ID Verification",
    submittedAt: "5 hours ago",
    status: "in_review",
    riskLevel: "medium",
    completeness: 70,
    documents: ["Passport", "Utility Bill"],
    missingDocs: ["Bank Statement", "Business Registration"]
  },
  {
    id: "kyc-003",
    clientName: "GlobalRetail Inc",
    documentType: "Full KYC Package",
    submittedAt: "1 day ago",
    status: "verified",
    riskLevel: "low",
    completeness: 100,
    documents: ["All Documents Complete"],
    missingDocs: []
  },
  {
    id: "kyc-004",
    clientName: "QuickTrade LLC",
    documentType: "Bank Verification",
    submittedAt: "3 hours ago",
    status: "rejected",
    riskLevel: "high",
    completeness: 45,
    documents: ["Bank Statement"],
    missingDocs: ["ID", "Business License", "Tax Documents"]
  }
];

const statusConfig = {
  pending: { color: "amber", icon: Clock, label: "Pending Review" },
  in_review: { color: "blue", icon: Eye, label: "In Review" },
  verified: { color: "emerald", icon: CheckCircle, label: "Verified" },
  rejected: { color: "rose", icon: XCircle, label: "Rejected" }
};

const riskConfig = {
  low: { color: "emerald", label: "Low Risk" },
  medium: { color: "amber", label: "Medium Risk" },
  high: { color: "rose", label: "High Risk" }
};

export const KYCManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<typeof kycSubmissions[0] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const { isLoading, analyzeKYC, verifyKYC } = useClientSuccessAI();

  const handleAnalyzeKYC = async (submission: typeof kycSubmissions[0]) => {
    setSelectedSubmission(submission);
    const result = await analyzeKYC(
      submission.clientName,
      submission.documentType,
      `Documents: ${submission.documents.join(', ')}. Missing: ${submission.missingDocs.join(', ')}`,
      submission.status
    );
    if (result) {
      setAiAnalysis(result);
      toast.success('KYC analysis complete');
    }
  };

  const handleVerifyKYC = async (submission: typeof kycSubmissions[0]) => {
    const result = await verifyKYC(
      submission.documentType,
      submission.clientName,
      `Completeness: ${submission.completeness}%, Risk: ${submission.riskLevel}`,
      submission.status
    );
    if (result) {
      setAiAnalysis(result);
      toast.success('Verification analysis complete');
    }
  };

  const stats = {
    total: kycSubmissions.length,
    pending: kycSubmissions.filter(k => k.status === 'pending').length,
    verified: kycSubmissions.filter(k => k.status === 'verified').length,
    rejected: kycSubmissions.filter(k => k.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600" />
            KYC Management Center
          </h2>
          <p className="text-slate-500 text-sm mt-1">AI-powered client verification and compliance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
            <Upload className="w-4 h-4" />
            New KYC Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Submissions", value: stats.total, icon: FileText, color: "teal" },
          { label: "Pending Review", value: stats.pending, icon: Clock, color: "amber" },
          { label: "Verified", value: stats.verified, icon: CheckCircle, color: "emerald" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "rose" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Submissions List */}
        <div className="col-span-7 space-y-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="verified">Verified ({stats.verified})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-3">
              {kycSubmissions.map((submission, i) => {
                const statusInfo = statusConfig[submission.status as keyof typeof statusConfig];
                const riskInfo = riskConfig[submission.riskLevel as keyof typeof riskConfig];
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card 
                      className={`p-4 border-l-4 cursor-pointer hover:shadow-md transition-all ${
                        selectedSubmission?.id === submission.id ? 'ring-2 ring-teal-400' : ''
                      }`}
                      style={{ borderLeftColor: `var(--${statusInfo.color}-500)` }}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-${statusInfo.color}-100`}>
                            <Building className={`w-5 h-5 text-${statusInfo.color}-600`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{submission.clientName}</h3>
                            <p className="text-sm text-slate-500">{submission.documentType}</p>
                            <p className="text-xs text-slate-400 mt-1">Submitted {submission.submittedAt}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700 border-${statusInfo.color}-200`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline" className={`text-${riskInfo.color}-600 border-${riskInfo.color}-300`}>
                            {riskInfo.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-500">Document Completeness</span>
                          <span className="font-medium">{submission.completeness}%</span>
                        </div>
                        <Progress value={submission.completeness} className="h-2" />
                      </div>

                      {submission.missingDocs.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {submission.missingDocs.map((doc, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs text-rose-600 border-rose-200">
                              Missing: {doc}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyzeKYC(submission);
                          }}
                          disabled={isLoading}
                          className="gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Analyze
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyKYC(submission);
                          }}
                          disabled={isLoading}
                          className="bg-teal-600 hover:bg-teal-700 gap-1"
                        >
                          <FileCheck className="w-3 h-3" />
                          Verify
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Analysis Panel */}
        <div className="col-span-5">
          <Card className="p-4 bg-gradient-to-br from-teal-50 to-amber-50 border-teal-200/50 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-slate-800">AI KYC Analysis</h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-4">
                {selectedSubmission && (
                  <div className="p-3 rounded-lg bg-white/50">
                    <p className="text-sm font-medium text-slate-700">Analyzing: {selectedSubmission.clientName}</p>
                    <p className="text-xs text-slate-500">{selectedSubmission.documentType}</p>
                  </div>
                )}
                <div className="p-4 rounded-lg bg-white/70 max-h-96 overflow-auto">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{aiAnalysis}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => navigator.clipboard.writeText(aiAnalysis)} variant="outline">
                    Copy Analysis
                  </Button>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    Generate Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-teal-300 mx-auto mb-3" />
                <p className="text-slate-500">Select a KYC submission and click "AI Analyze" to get intelligent insights</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
