import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  File,
  Image as ImageIcon
} from "lucide-react";

const DocumentTracker = () => {
  const documents = [
    {
      id: 1,
      name: "Project Requirements.pdf",
      type: "pdf",
      status: "approved",
      uploadDate: "Dec 1, 2024",
      approvedBy: "Account Manager"
    },
    {
      id: 2,
      name: "Design Mockups.zip",
      type: "zip",
      status: "approved",
      uploadDate: "Dec 5, 2024",
      approvedBy: "Design Team"
    },
    {
      id: 3,
      name: "API Documentation.docx",
      type: "doc",
      status: "pending",
      uploadDate: "Dec 15, 2024",
      approvedBy: null
    },
    {
      id: 4,
      name: "Brand Assets.png",
      type: "image",
      status: "review",
      uploadDate: "Dec 18, 2024",
      approvedBy: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "review":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40"><Eye className="w-3 h-3 mr-1" />In Review</Badge>;
      default:
        return <Badge className="bg-stone-500/20 text-stone-400 border-stone-500/40"><AlertCircle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-400" />;
      case "doc":
        return <FileText className="w-6 h-6 text-blue-400" />;
      case "image":
        return <ImageIcon className="w-6 h-6 text-purple-400" />;
      default:
        return <File className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl">
      <CardHeader className="border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            Document Tracker
          </CardTitle>
          <Button className="bg-amber-500 hover:bg-amber-600 text-stone-900">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Documents", value: "12", icon: FileText, color: "text-amber-400" },
            { label: "Approved", value: "8", icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Pending Review", value: "4", icon: Clock, color: "text-blue-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-stone-200">{stat.value}</p>
              <p className="text-xs text-stone-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-stone-800/30 border border-stone-700/30 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-stone-800/70 flex items-center justify-center">
                    {getFileIcon(doc.type)}
                  </div>
                  <div>
                    <h4 className="text-stone-200 font-medium group-hover:text-amber-200 transition-colors">
                      {doc.name}
                    </h4>
                    <p className="text-sm text-stone-500">
                      Uploaded: {doc.uploadDate}
                      {doc.approvedBy && ` • Approved by ${doc.approvedBy}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-lg bg-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-lg bg-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approval Workflow */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20">
          <h4 className="text-sm font-medium text-amber-300 mb-3">Approval Workflow</h4>
          <div className="flex items-center justify-between">
            {["Upload", "Review", "Feedback", "Approval"].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i <= 2 ? "bg-amber-500 text-stone-900" : "bg-stone-700 text-stone-400"
                }`}>
                  {i + 1}
                </div>
                <span className={`ml-2 text-sm ${i <= 2 ? "text-amber-300" : "text-stone-500"}`}>{step}</span>
                {i < 3 && <div className={`w-12 h-0.5 mx-2 ${i < 2 ? "bg-amber-500" : "bg-stone-700"}`} />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTracker;
