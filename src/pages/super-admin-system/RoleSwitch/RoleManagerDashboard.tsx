import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Users, CheckCircle, XCircle, Eye, Edit, Copy, Trash2,
  Plus, Clock, AlertTriangle, ChevronRight, X, Filter, Search,
  Settings, Lock, Unlock, Grid3X3, UserCheck, Globe2, MapPin,
  Building2, Layers, Activity, ArrowRight, Check, AlertCircle,
  FileText, History, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock Roles Data
const rolesData = [
  {
    id: "1",
    name: "Super Admin",
    type: "system",
    level: "Global",
    assignedUsers: 3,
    status: "active",
    createdBy: "System",
    createdAt: "2024-01-01",
    description: "Full system access with all permissions",
    permissions: 145
  },
  {
    id: "2",
    name: "Continent Manager",
    type: "system",
    level: "Continent",
    assignedUsers: 12,
    status: "active",
    createdBy: "System",
    createdAt: "2024-01-01",
    description: "Manage continent-level operations",
    permissions: 98
  },
  {
    id: "3",
    name: "Country Admin",
    type: "system",
    level: "Country",
    assignedUsers: 45,
    status: "active",
    createdBy: "System",
    createdAt: "2024-01-01",
    description: "Country-level administration",
    permissions: 72
  },
  {
    id: "4",
    name: "Finance Auditor",
    type: "custom",
    level: "Module",
    assignedUsers: 8,
    status: "active",
    createdBy: "Admin User",
    createdAt: "2024-06-15",
    description: "Read-only access to financial reports",
    permissions: 24
  },
  {
    id: "5",
    name: "Support Team Lead",
    type: "custom",
    level: "Area",
    assignedUsers: 0,
    status: "pending",
    createdBy: "HR Manager",
    createdAt: "2024-12-28",
    description: "Lead support team with escalation powers",
    permissions: 56
  },
  {
    id: "6",
    name: "Marketing Viewer",
    type: "custom",
    level: "Module",
    assignedUsers: 15,
    status: "disabled",
    createdBy: "Marketing Head",
    createdAt: "2024-09-10",
    description: "View-only marketing analytics",
    permissions: 12
  },
];

// Pending Approvals
const pendingApprovals = [
  {
    id: "PA-001",
    roleName: "Support Team Lead",
    requestedBy: "HR Manager",
    level: "Area",
    permissionCount: 56,
    riskLevel: "medium",
    requestedAt: "2024-12-28",
    description: "Lead support team with escalation powers"
  },
  {
    id: "PA-002",
    roleName: "Regional Sales Manager",
    requestedBy: "Sales Director",
    level: "Country",
    permissionCount: 42,
    riskLevel: "low",
    requestedAt: "2024-12-29",
    description: "Manage regional sales operations"
  },
  {
    id: "PA-003",
    roleName: "System Integrator",
    requestedBy: "Tech Lead",
    level: "Global",
    permissionCount: 89,
    riskLevel: "high",
    requestedAt: "2024-12-30",
    description: "API and integration management"
  },
];

// Permission Matrix Structure
const permissionCategories = [
  {
    category: "GLOBAL",
    features: ["Dashboard", "Live Activity", "Notifications"]
  },
  {
    category: "USER & ADMIN",
    features: ["Users", "Admins", "Roles", "Permissions"]
  },
  {
    category: "GEOGRAPHY",
    features: ["Continents", "Countries", "Areas"]
  },
  {
    category: "BUSINESS",
    features: ["Franchise", "Reseller", "Sales", "Leads", "Pro/Prime Users"]
  },
  {
    category: "OPERATIONS",
    features: ["Tasks", "Approvals", "Rentals", "Rules"]
  },
  {
    category: "TECH",
    features: ["Developer Panel", "Bugs & Issues", "Code Submission", "QA Panel", "Releases"]
  },
  {
    category: "SUPPORT",
    features: ["Tickets", "SLA", "Knowledge Base"]
  },
  {
    category: "FINANCE",
    features: ["Transactions", "Commissions", "Payouts", "Invoices", "Tax"]
  },
  {
    category: "LEGAL & COMPLIANCE",
    features: ["Company Law", "Franchise Law", "Reseller Law", "Trademark", "Contracts"]
  },
  {
    category: "SECURITY",
    features: ["Security Events", "System Lock", "IP/User Block", "Audit Logs"]
  },
  {
    category: "SETTINGS",
    features: ["System Settings", "Feature Toggles", "Integrations"]
  },
];

const permissionActions = ["View", "Create", "Edit", "Delete", "Approve", "Assign", "Export", "Lock", "Configure"];

// Activity log
const activityLog = [
  { action: "Role 'Finance Auditor' permissions updated", time: "5 mins ago", type: "edit", user: "Admin" },
  { action: "Role 'Support Team Lead' submitted for approval", time: "2 hours ago", type: "create", user: "HR Manager" },
  { action: "Role 'Marketing Viewer' disabled", time: "1 day ago", type: "disable", user: "System" },
  { action: "Role 'Country Admin' assigned to 3 users", time: "2 days ago", type: "assign", user: "Super Admin" },
  { action: "Role 'Regional Sales Manager' rejected", time: "3 days ago", type: "reject", user: "Super Admin" },
];

// Create Role Modal
interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateRoleModal = ({ open, onClose }: CreateRoleModalProps) => {
  const [step, setStep] = useState(1);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleLevel, setRoleLevel] = useState("");
  const [inheritFrom, setInheritFrom] = useState("");
  const [scopeType, setScopeType] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Role Submitted for Approval",
      description: `Role "${roleName}" has been submitted and is pending approval.`,
    });
    onClose();
    setStep(1);
    setRoleName("");
    setRoleDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-400" />
            Create New Role
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Step {step} of 4 - {step === 1 ? "Basic Details" : step === 2 ? "Role Scope" : step === 3 ? "Permissions" : "Submit"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                s <= step ? "bg-violet-500 text-white" : "bg-slate-700 text-slate-400"
              )}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div className={cn(
                  "w-16 h-1 mx-2",
                  s < step ? "bg-violet-500" : "bg-slate-700"
                )} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Role Name</label>
              <Input
                placeholder="Enter role name..."
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="bg-slate-800 border-slate-600"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Description</label>
              <Textarea
                placeholder="Describe the role purpose..."
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="bg-slate-800 border-slate-600"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Role Level</label>
              <Select value={roleLevel} onValueChange={setRoleLevel}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select level..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="continent">Continent</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="module">Module-specific</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Inherit From (Optional)</label>
              <Select value={inheritFrom} onValueChange={setInheritFrom}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select existing role..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="country_admin">Country Admin</SelectItem>
                  <SelectItem value="area_manager">Area Manager</SelectItem>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Scope Type</label>
              <Select value={scopeType} onValueChange={setScopeType}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select scope..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="continent">Continent</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Select applicable regions/modules:</p>
              <div className="grid grid-cols-2 gap-2">
                {["All Regions", "North America", "Europe", "Asia Pacific", "Latin America", "Middle East"].map((region) => (
                  <div key={region} className="flex items-center gap-2">
                    <Checkbox id={region} className="border-slate-600" />
                    <label htmlFor={region} className="text-sm text-white">{region}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Configure permissions for this role:</p>
            <ScrollArea className="h-[300px] rounded-lg border border-slate-700 p-3 bg-slate-800/30">
              {permissionCategories.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-violet-500/20 text-violet-300 text-xs">{cat.category}</Badge>
                  </div>
                  {cat.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center justify-between p-2 rounded bg-slate-800/50 mb-1">
                      <span className="text-sm text-white">{feature}</span>
                      <div className="flex gap-1">
                        {["View", "Create", "Edit", "Delete"].map((action) => (
                          <div key={action} className="flex items-center gap-1">
                            <Checkbox id={`${feature}-${action}`} className="w-4 h-4 border-slate-600" />
                            <label htmlFor={`${feature}-${action}`} className="text-xs text-slate-400">{action[0]}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </ScrollArea>
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Critical permissions will require dual approval
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <h4 className="font-semibold text-violet-300 mb-2">Role Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white">{roleName || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Level:</span>
                  <span className="text-white">{roleLevel || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scope:</span>
                  <span className="text-white">{scopeType || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Permissions:</span>
                  <span className="text-white">24 selected</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-300">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                This role will be submitted for approval. You cannot edit until a decision is made.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="text-slate-400"
          >
            {step > 1 ? "Back" : "Cancel"}
          </Button>
          <Button
            type="button"
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            className="bg-violet-500 hover:bg-violet-600"
          >
            {step < 4 ? "Next" : "Submit for Approval"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Permission Matrix Modal
interface PermissionMatrixModalProps {
  open: boolean;
  onClose: () => void;
  roleName?: string;
  readOnly?: boolean;
}

const PermissionMatrixModal = ({ open, onClose, roleName, readOnly = true }: PermissionMatrixModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-violet-400" />
            Permission Matrix {roleName && `- ${roleName}`}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {readOnly ? "View permission configuration" : "Configure permissions for this role"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="min-w-[900px]">
            {/* Header Row */}
            <div className="flex border-b border-slate-700 pb-2 mb-2 sticky top-0 bg-slate-900 z-10">
              <div className="w-48 text-sm font-semibold text-slate-400">Feature / Module</div>
              {permissionActions.map((action) => (
                <div key={action} className="w-16 text-center text-xs font-semibold text-slate-400">
                  {action}
                </div>
              ))}
            </div>

            {/* Permission Grid */}
            {permissionCategories.map((cat, catIdx) => (
              <div key={catIdx} className="mb-4">
                <div className="flex items-center gap-2 mb-2 py-2 border-b border-slate-800">
                  <Badge className="bg-violet-500/20 text-violet-300 text-xs">{cat.category}</Badge>
                  {!readOnly && (
                    <Button type="button" variant="ghost" size="sm" className="text-xs text-slate-400 h-6">
                      Select All
                    </Button>
                  )}
                </div>
                {cat.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center py-1.5 hover:bg-slate-800/30 rounded">
                    <div className="w-48 text-sm text-white pl-2">{feature}</div>
                    {permissionActions.map((action, aIdx) => (
                      <div key={aIdx} className="w-16 flex justify-center">
                        <Checkbox
                          disabled={readOnly}
                          defaultChecked={Math.random() > 0.5}
                          className="w-4 h-4 border-slate-600 data-[state=checked]:bg-violet-500"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Close</Button>
          {!readOnly && (
            <Button type="button" className="bg-violet-500 hover:bg-violet-600">Save Changes</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Approval Detail Panel
interface ApprovalDetailProps {
  approval: typeof pendingApprovals[0];
  onClose: () => void;
}

const ApprovalDetailPanel = ({ approval, onClose }: ApprovalDetailProps) => {
  const { toast } = useToast();
  const [showMatrix, setShowMatrix] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleApprove = () => {
    toast({
      title: "Role Approved",
      description: `Role "${approval.roleName}" has been approved and is now active.`,
    });
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Role Rejected",
      description: `Role "${approval.roleName}" has been rejected.`,
    });
    setShowRejectDialog(false);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 h-full w-[550px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-hidden"
      >
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-500/20 text-amber-400">Pending Approval</Badge>
                  <Badge className={cn(
                    "text-xs",
                    approval.riskLevel === "high" && "bg-red-500/20 text-red-400",
                    approval.riskLevel === "medium" && "bg-amber-500/20 text-amber-400",
                    approval.riskLevel === "low" && "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {approval.riskLevel} risk
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-white">{approval.roleName}</h2>
                <p className="text-sm text-slate-400">Requested by {approval.requestedBy}</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:bg-slate-800">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Section 1: Role Summary */}
            <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Role Summary</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Role Name</span>
                  <span className="text-white font-medium">{approval.roleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Description</span>
                  <span className="text-white text-right max-w-[200px]">{approval.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Level</span>
                  <Badge variant="outline" className="text-violet-300 border-violet-500/50">{approval.level}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Permissions</span>
                  <span className="text-white">{approval.permissionCount} permissions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Requested</span>
                  <span className="text-white">{approval.requestedAt}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Permission Matrix Preview */}
            <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Permission Matrix</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMatrix(true)}
                  className="text-violet-400 h-7"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Full
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  { category: "User Management", count: 12, critical: 2 },
                  { category: "Support Operations", count: 18, critical: 0 },
                  { category: "Escalation Powers", count: 8, critical: 3 },
                  { category: "Reports Access", count: 6, critical: 0 },
                ].map((perm, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                    <span className="text-sm text-white">{perm.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{perm.count} perms</span>
                      {perm.critical > 0 && (
                        <Badge className="bg-red-500/20 text-red-400 text-xs">
                          {perm.critical} critical
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {approval.riskLevel === "high" && (
                <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/30">
                  <p className="text-xs text-red-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    This role contains 5 critical permissions requiring careful review
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Actions */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Actions</span>
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleApprove}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 justify-start gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Role
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowRejectDialog(true)}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 justify-start gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Role
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-amber-400 hover:bg-amber-500/10 justify-start gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Request Changes
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </motion.div>

      <PermissionMatrixModal
        open={showMatrix}
        onClose={() => setShowMatrix(false)}
        roleName={approval.roleName}
        readOnly
      />

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Reject Role</DialogTitle>
            <DialogDescription className="text-slate-400">
              Please provide a reason for rejecting this role request.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="bg-slate-800 border-slate-600"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button type="button" onClick={handleReject} className="bg-red-500 hover:bg-red-600">
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const RoleManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<typeof pendingApprovals[0] | null>(null);
  const { toast } = useToast();

  const filteredRoles = rolesData.filter((role) => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || role.type === filterType;
    const matchesStatus = filterStatus === "all" || role.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleRoleAction = (action: string, roleName: string) => {
    toast({
      title: `${action} Role`,
      description: `${action} action on "${roleName}" executed.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)' }}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Role Manager Dashboard</h1>
            <p className="text-sm text-slate-400">Create, Approve & Manage Roles and Permissions</p>
          </div>
        </div>
        <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
          <Shield className="w-3 h-3 mr-1.5" />
          CONTROL THEME ACTIVE
        </Badge>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Total Roles", value: "24", icon: Shield, color: "border-violet-500/50", textColor: "text-violet-400" },
          { label: "Pending Approvals", value: "3", icon: Clock, color: "border-amber-500/50", textColor: "text-amber-400" },
          { label: "Active Users", value: "156", icon: Users, color: "border-emerald-500/50", textColor: "text-emerald-400" },
          { label: "Permissions", value: "312", icon: Lock, color: "border-blue-500/50", textColor: "text-blue-400" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className={cn("p-4 rounded-xl bg-slate-800/50 border backdrop-blur-xl", stat.color)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1 uppercase">{stat.label}</p>
                <p className={cn("text-2xl font-bold", stat.textColor)}>{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-900/50 border border-slate-700 flex items-center justify-center">
                <stat.icon className={cn("w-5 h-5", stat.textColor)} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Action Controls - 2 Columns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Quick Action Controls</h2>
          <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">LIVE</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { 
              name: "Lead Assignment", 
              icon: Users, 
              status: "running",
              action: "Stop",
              actionType: "stop",
              description: "Auto-assign new leads to available agents"
            },
            { 
              name: "Sales Pipeline", 
              icon: Activity, 
              status: "running",
              action: "Stop",
              actionType: "stop",
              description: "Process sales conversions automatically"
            },
            { 
              name: "Promise Tracking", 
              icon: CheckCircle, 
              status: "running",
              action: "Stop",
              actionType: "stop",
              description: "Monitor and track all active promises"
            },
            { 
              name: "Support Queue", 
              icon: UserCheck, 
              status: "paused",
              action: "Start",
              actionType: "start",
              description: "Auto-route tickets to support agents"
            },
            { 
              name: "Franchise Onboarding", 
              icon: Building2, 
              status: "running",
              action: "Stop",
              actionType: "stop",
              description: "New franchise approval workflow"
            },
            { 
              name: "Demo Scheduling", 
              icon: Eye, 
              status: "blocked",
              action: "Allow",
              actionType: "allow",
              description: "Allow new demo bookings"
            },
            { 
              name: "Developer Deployments", 
              icon: Layers, 
              status: "running",
              action: "Stop",
              actionType: "stop",
              description: "Auto-deploy approved code changes"
            },
            { 
              name: "Payment Processing", 
              icon: Shield, 
              status: "paused",
              action: "Start",
              actionType: "start",
              description: "Process pending payout requests"
            },
            { 
              name: "New Registrations", 
              icon: Globe2, 
              status: "running",
              action: "Block",
              actionType: "block",
              description: "Accept new user registrations"
            },
            { 
              name: "Reseller Approvals", 
              icon: Lock, 
              status: "blocked",
              action: "Allow",
              actionType: "allow",
              description: "Allow reseller application processing"
            },
          ].map((control, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + idx * 0.03 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    control.status === "running" && "bg-emerald-500/20",
                    control.status === "paused" && "bg-amber-500/20",
                    control.status === "blocked" && "bg-red-500/20"
                  )}>
                    <control.icon className={cn(
                      "w-5 h-5",
                      control.status === "running" && "text-emerald-400",
                      control.status === "paused" && "text-amber-400",
                      control.status === "blocked" && "text-red-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{control.name}</h3>
                      <span className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        control.status === "running" && "bg-emerald-500",
                        control.status === "paused" && "bg-amber-500",
                        control.status === "blocked" && "bg-red-500"
                      )} />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{control.description}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className={cn(
                    "shrink-0 ml-3 font-medium",
                    control.actionType === "stop" && "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
                    control.actionType === "start" && "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30",
                    control.actionType === "allow" && "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30",
                    control.actionType === "block" && "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
                  )}
                  onClick={() => toast({
                    title: `${control.action} ${control.name}`,
                    description: `Action "${control.action}" executed successfully.`
                  })}
                >
                  {control.action}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <Button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="bg-violet-500 hover:bg-violet-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Role
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab("approvals")}
          className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending Approvals ({pendingApprovals.length})
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowMatrixModal(true)}
          className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Permission Matrix Overview
        </Button>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="roles" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
            All Roles
          </TabsTrigger>
          <TabsTrigger value="approvals" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
            Pending Approvals
            {pendingApprovals.length > 0 && (
              <Badge className="ml-2 bg-amber-500/20 text-amber-400 text-xs">{pendingApprovals.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Roles Table */}
          <div className="rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-800/50 p-3 border-b border-slate-700 grid grid-cols-7 text-xs font-semibold text-slate-400 uppercase">
              <div className="col-span-2">Role Name</div>
              <div>Type</div>
              <div>Level</div>
              <div>Users</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {filteredRoles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-3 border-b border-slate-800 grid grid-cols-7 items-center hover:bg-slate-800/30 transition-colors"
              >
                <div className="col-span-2">
                  <p className="text-white font-medium">{role.name}</p>
                  <p className="text-xs text-slate-400">{role.permissions} permissions</p>
                </div>
                <div>
                  <Badge className={cn(
                    "text-xs",
                    role.type === "system" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                  )}>
                    {role.type}
                  </Badge>
                </div>
                <div className="text-sm text-slate-300">{role.level}</div>
                <div className="text-sm text-slate-300">{role.assignedUsers}</div>
                <div>
                  <Badge className={cn(
                    "text-xs",
                    role.status === "active" && "bg-emerald-500/20 text-emerald-400",
                    role.status === "pending" && "bg-amber-500/20 text-amber-400",
                    role.status === "disabled" && "bg-slate-500/20 text-slate-400"
                  )}>
                    {role.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white" onClick={() => handleRoleAction("Edit", role.name)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white" onClick={() => handleRoleAction("Duplicate", role.name)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  {role.assignedUsers === 0 && (
                    <Button type="button" variant="ghost" size="icon" className="w-8 h-8 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Pending Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingApprovals.map((approval, idx) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedApproval(approval)}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-violet-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{approval.roleName}</h3>
                      <Badge className={cn(
                        "text-xs",
                        approval.riskLevel === "high" && "bg-red-500/20 text-red-400",
                        approval.riskLevel === "medium" && "bg-amber-500/20 text-amber-400",
                        approval.riskLevel === "low" && "bg-emerald-500/20 text-emerald-400"
                      )}>
                        {approval.riskLevel} risk
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">{approval.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-slate-400">
                    <UserCheck className="w-3 h-3" />
                    <span>{approval.requestedBy}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Layers className="w-3 h-3" />
                    <span>{approval.level}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3 h-3" />
                    <span>{approval.permissionCount} perms</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="rounded-xl border border-slate-700 overflow-hidden">
            {activityLog.map((log, idx) => (
              <div key={idx} className="p-4 border-b border-slate-800 flex items-center gap-4 hover:bg-slate-800/30">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  log.type === "create" && "bg-emerald-400",
                  log.type === "edit" && "bg-blue-400",
                  log.type === "disable" && "bg-slate-400",
                  log.type === "assign" && "bg-violet-400",
                  log.type === "reject" && "bg-red-400"
                )} />
                <div className="flex-1">
                  <p className="text-white">{log.action}</p>
                  <p className="text-xs text-slate-400">by {log.user}</p>
                </div>
                <span className="text-sm text-slate-500">{log.time}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateRoleModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <PermissionMatrixModal open={showMatrixModal} onClose={() => setShowMatrixModal(false)} readOnly />

      {/* Approval Detail Panel */}
      <AnimatePresence>
        {selectedApproval && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedApproval(null)}
            />
            <ApprovalDetailPanel approval={selectedApproval} onClose={() => setSelectedApproval(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleManagerDashboard;
