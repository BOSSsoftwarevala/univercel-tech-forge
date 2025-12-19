import { motion } from "framer-motion";
import { FolderOpen, Image, Video, FileText, Download, Copy, Eye, Plus, Globe, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContentCreativeLibrary = () => {
  const banners = [
    { id: 1, name: "Summer Sale Banner", size: "1200x628", type: "Social", languages: ["EN", "HI"], approved: true },
    { id: 2, name: "Product Launch Hero", size: "1920x1080", type: "Website", languages: ["EN"], approved: true },
    { id: 3, name: "Franchise CTA", size: "1080x1080", type: "Instagram", languages: ["EN", "AR"], approved: true },
    { id: 4, name: "Demo Invite Card", size: "800x418", type: "Twitter", languages: ["EN", "HI"], approved: false },
  ];

  const videos = [
    { id: 1, name: "Product Explainer", duration: "2:30", type: "YouTube", views: 12400, approved: true },
    { id: 2, name: "Customer Testimonial", duration: "1:45", type: "Social", views: 8900, approved: true },
    { id: 3, name: "Quick Demo Reel", duration: "0:60", type: "Reels", views: 45200, approved: true },
  ];

  const templates = [
    { id: 1, name: "Email Welcome Series", type: "Email", usage: 1247, languages: ["EN", "HI", "AR"] },
    { id: 2, name: "WhatsApp Demo Invite", type: "WhatsApp", usage: 890, languages: ["EN", "HI"] },
    { id: 3, name: "SMS Offer Alert", type: "SMS", usage: 2340, languages: ["EN", "HI"] },
    { id: 4, name: "Push Notification", type: "Push", usage: 5600, languages: ["EN"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-100 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-teal-400" />
          Content & Creative Library
        </h2>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-600">
          <Plus className="w-4 h-4 mr-2" />
          Upload Creative
        </Button>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="banners" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <Image className="w-4 h-4 mr-2" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <Video className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden group">
                  <div className="aspect-video bg-gradient-to-br from-teal-500/20 to-cyan-500/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image className="w-12 h-12 text-teal-400/50" />
                    </div>
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {banner.approved && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-slate-200 truncate">{banner.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">{banner.size}</span>
                      <div className="flex gap-1">
                        {banner.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative flex items-center justify-center">
                    <Video className="w-16 h-16 text-purple-400/50" />
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-slate-900/80 text-xs text-white">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-slate-200">{video.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                        {video.type}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        <Eye className="w-3 h-3 inline mr-1" />
                        {video.views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card className="bg-slate-900/50 border-teal-500/20">
            <CardContent className="p-6">
              <div className="space-y-3">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-200">{template.name}</h4>
                        <p className="text-xs text-slate-500">{template.type} • Used {template.usage.toLocaleString()} times</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {template.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            <Globe className="w-3 h-3 mr-1" />
                            {lang}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" variant="ghost" className="text-teal-400">
                        <Copy className="w-4 h-4 mr-2" />
                        Use
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreativeLibrary;
