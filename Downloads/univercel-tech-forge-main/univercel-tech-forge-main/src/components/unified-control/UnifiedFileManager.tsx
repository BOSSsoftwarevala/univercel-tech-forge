import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Image, Video, File, Upload, Folder, 
  Eye, Download, Trash2, Link, Search, Grid, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FILES_DATA = [
  { id: 1, name: "Product_Spec_v2.pdf", type: "document", size: "2.4 MB", linked: "CRM Product", status: "processed" },
  { id: 2, name: "UI_Mockup_Dashboard.png", type: "image", size: "1.2 MB", linked: "HR Demo", status: "processed" },
  { id: 3, name: "Demo_Walkthrough.mp4", type: "video", size: "45 MB", linked: "Sales Demo", status: "processing" },
  { id: 4, name: "Client_Requirements.docx", type: "document", size: "856 KB", linked: "New Project", status: "pending" },
  { id: 5, name: "Logo_Assets.zip", type: "archive", size: "12 MB", linked: "Branding", status: "processed" },
  { id: 6, name: "API_Documentation.pdf", type: "document", size: "3.1 MB", linked: "Dev Portal", status: "processed" },
];

const FILE_CATEGORIES = [
  { type: "all", label: "All Files", count: 156 },
  { type: "document", label: "Documents", count: 45 },
  { type: "image", label: "Images", count: 67 },
  { type: "video", label: "Videos", count: 23 },
  { type: "archive", label: "Archives", count: 21 },
];

export const UnifiedFileManager = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return FileText;
      case "image": return Image;
      case "video": return Video;
      default: return File;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case "document": return "blue";
      case "image": return "green";
      case "video": return "red";
      case "archive": return "amber";
      default: return "slate";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">File & Media Manager</h2>
          <p className="text-muted-foreground">Upload and manage all project files with AI processing</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-xl border-2 border-dashed border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-all cursor-pointer"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Upload className="w-8 h-8 text-orange-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              Documents, Images, Videos, Source Files, Client Assets
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            {["PDF", "DOC", "PNG", "MP4", "ZIP"].map((ext) => (
              <Badge key={ext} variant="outline" className="text-xs">
                {ext}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/20"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={cn(viewMode === "grid" && "bg-background")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={cn(viewMode === "list" && "bg-background")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {FILE_CATEGORIES.map((cat) => (
          <Button
            key={cat.type}
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory(cat.type)}
            className={cn(
              "whitespace-nowrap",
              selectedCategory === cat.type && "bg-orange-500/20 border-orange-500/50"
            )}
          >
            {cat.label}
            <Badge variant="secondary" className="ml-2 text-xs">
              {cat.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Files Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">FILE</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">TYPE</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">SIZE</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">LINKED TO</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-right p-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {FILES_DATA.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const color = getFileColor(file.type);
              return (
                <tr key={file.id} className="border-t border-border/30 hover:bg-muted/10">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                        <FileIcon className={`w-5 h-5 text-${color}-400`} />
                      </div>
                      <span className="text-sm text-white font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs capitalize">
                      {file.type}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{file.size}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm text-cyan-400">
                      <Link className="w-3 h-3" />
                      {file.linked}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        file.status === "processed" && "border-green-500/50 text-green-400",
                        file.status === "processing" && "border-amber-500/50 text-amber-400",
                        file.status === "pending" && "border-slate-500/50 text-slate-400"
                      )}
                    >
                      {file.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4 text-green-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI Processing Status */}
      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">AI File Processing</p>
            <p className="text-xs text-muted-foreground">Auto-reading files for issue detection & demo mapping</p>
          </div>
          <Badge className="bg-violet-500">Active</Badge>
        </div>
      </div>
    </div>
  );
};
