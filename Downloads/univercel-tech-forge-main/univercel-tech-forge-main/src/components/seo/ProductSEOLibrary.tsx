import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, Search, History, CheckCircle, AlertTriangle,
  FileText, Globe, Tag, Clock, Edit2, Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductSEOLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const products = [
    {
      id: "pos",
      name: "POS System",
      currentMeta: {
        title: "Best POS System for Retail | Software Vala",
        description: "Complete point of sale solution with inventory management, billing, and analytics.",
        keywords: ["pos software", "retail pos", "billing software"],
      },
      versions: 12,
      lastUpdated: "2 hours ago",
      score: 94,
      regions: ["Nigeria", "India", "UAE", "Kenya"],
    },
    {
      id: "school",
      name: "School Management",
      currentMeta: {
        title: "School Management System | Complete Education Software",
        description: "Comprehensive school ERP with student management, fees, attendance, and parent portal.",
        keywords: ["school software", "education erp", "student management"],
      },
      versions: 8,
      lastUpdated: "1 day ago",
      score: 89,
      regions: ["India", "Nigeria", "Kenya"],
    },
    {
      id: "hospital",
      name: "Hospital ERP",
      currentMeta: {
        title: "Hospital Management System | Healthcare ERP Solution",
        description: "End-to-end hospital management with patient records, appointments, and billing.",
        keywords: ["hospital software", "healthcare erp", "clinic management"],
      },
      versions: 6,
      lastUpdated: "3 days ago",
      score: 85,
      regions: ["UAE", "India"],
    },
    {
      id: "inventory",
      name: "Inventory System",
      currentMeta: {
        title: "Inventory Management Software | Stock Control Solution",
        description: "Real-time inventory tracking with multi-location support and purchase management.",
        keywords: ["inventory software", "stock management", "warehouse management"],
      },
      versions: 5,
      lastUpdated: "1 week ago",
      score: 78,
      regions: ["Global"],
    },
  ];

  const versionHistory = [
    { version: "v12", date: "2 hours ago", changes: "Updated meta title for better CTR", author: "AI Engine" },
    { version: "v11", date: "1 day ago", changes: "Added new feature keywords", author: "SEO Team" },
    { version: "v10", date: "3 days ago", changes: "Optimized description length", author: "AI Engine" },
    { version: "v9", date: "1 week ago", changes: "Regional keyword additions", author: "AI Engine" },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-cyan-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            Product SEO Library
          </h2>
          <p className="text-slate-400">Centralized meta management for all products</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="pl-10 bg-slate-800/50 border-slate-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Product List */}
        <div className="col-span-2 space-y-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedProduct(product.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedProduct === product.id
                  ? "bg-cyan-500/20 border-2 border-cyan-500/50"
                  : "bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs text-slate-400">
                      <History className="w-3 h-3 mr-1" />
                      {product.versions} versions
                    </Badge>
                    <span className="text-xs text-slate-500">Updated {product.lastUpdated}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className={`text-2xl font-bold ${getScoreColor(product.score)}`}>
                    {product.score}
                  </span>
                  <p className="text-xs text-slate-400">SEO Score</p>
                </div>
              </div>

              {/* Current Meta */}
              <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white font-medium truncate">{product.currentMeta.title}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{product.currentMeta.description}</p>
                <div className="flex flex-wrap gap-1">
                  {product.currentMeta.keywords.map((kw) => (
                    <Badge key={kw} className="bg-slate-700/50 text-slate-300 text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div className="flex items-center gap-2 mt-3">
                <Globe className="w-4 h-4 text-slate-500" />
                <div className="flex gap-1">
                  {product.regions.map((region) => (
                    <Badge key={region} variant="outline" className="text-xs text-cyan-400 border-cyan-500/30">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" className="text-cyan-400">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400">
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400">
                  <History className="w-4 h-4 mr-1" />
                  History
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Version History Panel */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Version History
          </h3>
          {selectedProduct ? (
            <div className="space-y-3">
              {versionHistory.map((version, index) => (
                <motion.div
                  key={version.version}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-cyan-500/20 text-cyan-400">{version.version}</Badge>
                    <span className="text-xs text-slate-500">{version.date}</span>
                  </div>
                  <p className="text-sm text-white">{version.changes}</p>
                  <p className="text-xs text-slate-500 mt-1">By: {version.author}</p>
                </motion.div>
              ))}

              <Button variant="outline" className="w-full border-slate-600 text-slate-400">
                View All Versions
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Select a product to view version history
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <h4 className="font-medium text-cyan-400 mb-3">Library Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xl font-bold text-white">4</p>
                <p className="text-xs text-slate-400">Products</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">31</p>
                <p className="text-xs text-slate-400">Total Versions</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">87%</p>
                <p className="text-xs text-slate-400">Avg. SEO Score</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">6</p>
                <p className="text-xs text-slate-400">Regions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSEOLibrary;
