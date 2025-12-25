import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Video, Download, Eye, Heart, Share2, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const VisualAssetLibrary = () => {
  const banners = [
    { id: 1, name: "POS System Banner", category: "Retail", size: "1200x628", downloads: 234, type: "banner" },
    { id: 2, name: "Hospital Suite Ad", category: "Healthcare", size: "1080x1080", downloads: 189, type: "banner" },
    { id: 3, name: "School ERP Promo", category: "Education", size: "1920x1080", downloads: 156, type: "banner" },
    { id: 4, name: "Inventory Pro Card", category: "Logistics", size: "800x418", downloads: 312, type: "banner" },
  ];

  const videos = [
    { id: 1, name: "Product Overview", duration: "2:30", views: 1250, type: "promo" },
    { id: 2, name: "Feature Highlights", duration: "1:45", views: 890, type: "short" },
    { id: 3, name: "Customer Testimonial", duration: "3:15", views: 2100, type: "testimonial" },
  ];

  const posters = [
    { id: 1, name: "New Year Sale", category: "Seasonal", downloads: 456 },
    { id: 2, name: "Black Friday Deal", category: "Seasonal", downloads: 678 },
    { id: 3, name: "Product Launch", category: "Launch", downloads: 345 },
    { id: 4, name: "Feature Update", category: "Updates", downloads: 234 },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const handleDownload = (name: string) => {
    toast.success(`Downloading "${name}"...`, {
      description: "Your download will start shortly"
    });
  };

  const handlePreview = (name: string) => {
    toast.info(`Previewing "${name}"`, {
      description: "Opening preview modal..."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">Visual Asset Library</h2>
          <p className="text-slate-400">Ready-to-use banners, posters, and promo videos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search assets..." 
              className="w-64 pl-10 bg-slate-800 border-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="border-violet-500/30 text-violet-300"
            onClick={() => {
              setShowFilter(!showFilter);
              toast.info(showFilter ? "Filter closed" : "Filter opened");
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <Image className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-100">48</div>
            <div className="text-xs text-slate-400">Banners</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">12</div>
            <div className="text-xs text-slate-400">Videos</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Image className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">36</div>
            <div className="text-xs text-slate-400">Posters</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">2,456</div>
            <div className="text-xs text-slate-400">Downloads</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="posters">Posters</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-violet-500/20 overflow-hidden group">
                  <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-cyan-500/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image className="w-12 h-12 text-violet-400/50" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white" onClick={() => handlePreview(banner.name)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-violet-500 hover:bg-violet-600" onClick={() => handleDownload(banner.name)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-violet-100 text-sm truncate">{banner.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <Badge className="bg-slate-700 text-slate-300 text-xs">{banner.category}</Badge>
                      <span className="text-xs text-slate-500">{banner.size}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      <Download className="w-3 h-3 inline mr-1" />{banner.downloads} downloads
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-violet-500/20 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-violet-500/20 relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/50">{video.duration}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-violet-100">{video.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className="bg-violet-500/20 text-violet-300">{video.type}</Badge>
                      <span className="text-xs text-slate-500">
                        <Eye className="w-3 h-3 inline mr-1" />{video.views.toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                      onClick={() => handleDownload(video.name)}
                    >
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posters">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {posters.map((poster, index) => (
              <motion.div
                key={poster.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-violet-500/20 overflow-hidden group">
                  <div className="aspect-[3/4] bg-gradient-to-br from-emerald-500/20 to-violet-500/20 relative flex items-center justify-center">
                    <Image className="w-12 h-12 text-emerald-400/50" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleDownload(poster.name)}>
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-violet-100 text-sm">{poster.name}</h4>
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                      <span>{poster.category}</span>
                      <span>{poster.downloads} downloads</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualAssetLibrary;
