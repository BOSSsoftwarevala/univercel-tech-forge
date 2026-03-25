import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, FileText, Upload, RefreshCw, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useSystemActions } from "@/hooks/useSystemActions";

const MMCreativesLibrary = () => {
  const { executeAction, actions } = useSystemActions();
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([
    { id: "BNR001", name: "Summer Sale Banner", size: "1200x628", format: "PNG", status: "approved" },
    { id: "BNR002", name: "Festival Header", size: "1920x400", format: "JPG", status: "approved" },
    { id: "BNR003", name: "Mobile Promo", size: "600x600", format: "PNG", status: "pending" },
  ]);

  const [videos, setVideos] = useState([
    { id: "VID001", name: "Product Demo 30s", duration: "0:30", format: "MP4", status: "approved" },
    { id: "VID002", name: "Brand Story", duration: "1:00", format: "MP4", status: "approved" },
    { id: "VID003", name: "Testimonial Clip", duration: "0:45", format: "MP4", status: "pending" },
  ]);

  const [copies, setCopies] = useState([
    { id: "CPY001", name: "Email Subject Lines", variants: 5, status: "approved" },
    { id: "CPY002", name: "Social Media Posts", variants: 12, status: "approved" },
    { id: "CPY003", name: "Ad Headlines", variants: 8, status: "pending" },
  ]);

  const handleUpload = useCallback(async () => {
    setLoading(true);
    await executeAction({
      module: "marketing",
      action: "create",
      entityType: "creative",
      entityId: "new",
    });
    toast.success("Upload request submitted for approval");
    setLoading(false);
  }, [executeAction]);

  const handleReplace = useCallback(async (id: string, name: string) => {
    await executeAction({
      module: "marketing",
      action: "update",
      entityType: "creative",
      entityId: id,
      entityName: name,
    });
    toast.info(`Replace request for ${name} submitted for approval`);
  }, [executeAction]);

  const handleView = useCallback(async (id: string, name: string) => {
    await actions.read("marketing", "creative", id, name);
    toast.info(`Viewing: ${name}`);
  }, [actions]);

  const handleDelete = useCallback(async (id: string, name: string, type: string) => {
    await actions.softDelete("marketing", "creative", id, name);
    if (type === "banner") setBanners(prev => prev.filter(b => b.id !== id));
    if (type === "video") setVideos(prev => prev.filter(v => v.id !== id));
    if (type === "copy") setCopies(prev => prev.filter(c => c.id !== id));
    toast.success(`${type} deleted`);
  }, [actions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Creatives Library</h2>
        <Button onClick={handleUpload} className="bg-emerald-600 hover:bg-emerald-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Creative
        </Button>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="banners" className="data-[state=active]:bg-emerald-600">
            <Image className="h-4 w-4 mr-2" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-emerald-600">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="copies" className="data-[state=active]:bg-emerald-600">
            <FileText className="h-4 w-4 mr-2" />
            Copies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="h-32 bg-slate-700/50 rounded flex items-center justify-center mb-3">
                      <Image className="h-12 w-12 text-slate-500" />
                    </div>
                    <h4 className="text-white font-medium">{banner.name}</h4>
                    <p className="text-slate-400 text-sm">{banner.size} • {banner.format}</p>
                    <div className="flex justify-between items-center mt-3">
                      <Badge className={banner.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {banner.status}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => handleReplace(banner.id, banner.name)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="h-32 bg-slate-700/50 rounded flex items-center justify-center mb-3">
                      <Video className="h-12 w-12 text-slate-500" />
                    </div>
                    <h4 className="text-white font-medium">{video.name}</h4>
                    <p className="text-slate-400 text-sm">{video.duration} • {video.format}</p>
                    <div className="flex justify-between items-center mt-3">
                      <Badge className={video.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {video.status}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => handleReplace(video.id, video.name)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="copies" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {copies.map((copy) => (
                  <div key={copy.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="h-20 bg-slate-700/50 rounded flex items-center justify-center mb-3">
                      <FileText className="h-10 w-10 text-slate-500" />
                    </div>
                    <h4 className="text-white font-medium">{copy.name}</h4>
                    <p className="text-slate-400 text-sm">{copy.variants} variants</p>
                    <div className="flex justify-between items-center mt-3">
                      <Badge className={copy.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {copy.status}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => handleReplace(copy.id, copy.name)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MMCreativesLibrary;
