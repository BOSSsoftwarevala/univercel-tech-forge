import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Upload, Globe, Link, MessageSquare, Search,
  FileSpreadsheet, CheckCircle, Tag, Filter, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadCaptureHubProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadCaptureHub = ({ isOpen, onClose }: LeadCaptureHubProps) => {
  const [activeTab, setActiveTab] = useState<"manual" | "bulk" | "auto">("manual");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    software: "",
    source: "",
    region: "",
    message: "",
  });

  const sourceCategories = [
    { value: "organic", label: "Organic (SEO)", icon: Globe },
    { value: "paid", label: "Paid Ads", icon: Tag },
    { value: "referral", label: "Referral", icon: Link },
    { value: "influencer", label: "Influencer", icon: MessageSquare },
    { value: "website", label: "Website Form", icon: Globe },
    { value: "demo", label: "Demo Request", icon: Search },
    { value: "chatbot", label: "Chatbot", icon: MessageSquare },
  ];

  const autoImportSources = [
    { name: "Website Forms", connected: true, leads: 124, lastSync: "2 min ago" },
    { name: "Demo Requests", connected: true, leads: 45, lastSync: "5 min ago" },
    { name: "SEO Landing Pages", connected: true, leads: 89, lastSync: "10 min ago" },
    { name: "Chatbot Leads", connected: true, leads: 32, lastSync: "Just now" },
    { name: "Google Ads", connected: false, leads: 0, lastSync: "Not connected" },
    { name: "Facebook Ads", connected: false, leads: 0, lastSync: "Not connected" },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Lead Capture Hub</h3>
              <p className="text-xs text-slate-400">Add leads manually or import from sources</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-slate-700/50 flex gap-2">
          {[
            { id: "manual", label: "Manual Entry", icon: Plus },
            { id: "bulk", label: "Bulk Upload", icon: FileSpreadsheet },
            { id: "auto", label: "Auto-Import Sources", icon: Globe },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={activeTab === tab.id ? "bg-indigo-500" : ""}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "manual" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Full Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter lead name"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 234 567 890"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Company name"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Software Interest *</label>
                  <Select onValueChange={(v) => setFormData({...formData, software: v})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue placeholder="Select software" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pos">POS System</SelectItem>
                      <SelectItem value="school">School Management</SelectItem>
                      <SelectItem value="hospital">Hospital ERP</SelectItem>
                      <SelectItem value="inventory">Inventory System</SelectItem>
                      <SelectItem value="crm">CRM Solution</SelectItem>
                      <SelectItem value="custom">Custom Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Lead Source *</label>
                  <Select onValueChange={(v) => setFormData({...formData, source: v})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceCategories.map((src) => (
                        <SelectItem key={src.value} value={src.value}>
                          {src.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Region *</label>
                  <Select onValueChange={(v) => setFormData({...formData, region: v})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nigeria">Nigeria</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="burundi">Burundi</SelectItem>
                      <SelectItem value="liberia">Liberia</SelectItem>
                      <SelectItem value="south-sudan">South Sudan</SelectItem>
                      <SelectItem value="philippines">Philippines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Notes / Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Additional notes..."
                    className="bg-slate-800/50 border-slate-600 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "bulk" && (
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500/50 transition-colors"
              >
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Drop CSV file here or click to upload</p>
                <p className="text-sm text-slate-400">Supports CSV, XLS, XLSX (max 10MB)</p>
              </motion.div>
              
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <h4 className="text-sm font-medium text-white mb-2">Required Columns</h4>
                <div className="flex flex-wrap gap-2">
                  {["Name", "Email/Phone", "Software Interest", "Source", "Region"].map((col) => (
                    <Badge key={col} variant="outline" className="text-slate-400">
                      {col}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full border-slate-600">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template CSV
              </Button>
            </div>
          )}

          {activeTab === "auto" && (
            <div className="space-y-4">
              {autoImportSources.map((source, index) => (
                <motion.div
                  key={source.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    source.connected 
                      ? "bg-green-500/10 border-green-500/30" 
                      : "bg-slate-800/50 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      source.connected ? "bg-green-500/20" : "bg-slate-700/50"
                    }`}>
                      <Globe className={`w-5 h-5 ${
                        source.connected ? "text-green-400" : "text-slate-500"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{source.name}</p>
                      <p className="text-xs text-slate-400">
                        {source.connected ? `${source.leads} leads imported` : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {source.connected && (
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500">{source.lastSync}</span>
                    <Button 
                      size="sm" 
                      variant={source.connected ? "ghost" : "default"}
                      className={!source.connected ? "bg-indigo-500" : ""}
                    >
                      {source.connected ? "Configure" : "Connect"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
            {activeTab === "manual" ? "Add Lead" : activeTab === "bulk" ? "Upload & Process" : "Save Sources"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeadCaptureHub;
