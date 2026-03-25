import { motion } from "framer-motion";
import { Bell, Rocket, AlertTriangle, Calendar, Sparkles, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const AnnouncementFeed = () => {
  const announcements = [
    { 
      id: 1, 
      type: "launch", 
      title: "AI Analytics Suite v3.0 Released", 
      description: "New AI-powered analytics with predictive insights and automated reporting.", 
      date: "Dec 18, 2024", 
      isNew: true,
      priority: "high"
    },
    { 
      id: 2, 
      type: "feature", 
      title: "Enhanced Dashboard Customization", 
      description: "Drag-and-drop widget placement and custom theme support now available.", 
      date: "Dec 15, 2024", 
      isNew: true,
      priority: "medium"
    },
    { 
      id: 3, 
      type: "maintenance", 
      title: "Scheduled Maintenance - Dec 22", 
      description: "Brief downtime expected from 2:00 AM - 4:00 AM UTC for infrastructure upgrades.", 
      date: "Dec 14, 2024", 
      isNew: false,
      priority: "low"
    },
    { 
      id: 4, 
      type: "roadmap", 
      title: "Q1 2025 Roadmap Preview", 
      description: "Mobile app, advanced integrations, and enterprise features coming soon.", 
      date: "Dec 10, 2024", 
      isNew: false,
      priority: "medium"
    },
    { 
      id: 5, 
      type: "feature", 
      title: "New API Rate Limits", 
      description: "Increased rate limits for Prime users. Check your dashboard for details.", 
      date: "Dec 8, 2024", 
      isNew: false,
      priority: "medium"
    },
  ];

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "launch": return { icon: Rocket, color: "text-emerald-400", bg: "bg-emerald-500/20" };
      case "feature": return { icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/20" };
      case "maintenance": return { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/20" };
      case "roadmap": return { icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/20" };
      default: return { icon: Bell, color: "text-stone-400", bg: "bg-stone-500/20" };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default: return "bg-stone-700/50 text-stone-400 border-stone-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Announcements & Updates</h2>
          <p className="text-stone-400">Stay informed about new features and system updates</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Bell className="w-3 h-3 mr-1" />
          2 New
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Rocket className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">3</div>
            <div className="text-xs text-stone-400">New Releases</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">12</div>
            <div className="text-xs text-stone-400">Feature Updates</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">1</div>
            <div className="text-xs text-stone-400">Scheduled Maintenance</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-100">Q1</div>
            <div className="text-xs text-stone-400">Roadmap Available</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100">Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {announcements.map((announcement, index) => {
                const typeInfo = getTypeInfo(announcement.type);
                const Icon = typeInfo.icon;
                
                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="bg-stone-800/50 border-stone-700/50 hover:border-amber-500/30 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg ${typeInfo.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-amber-100 truncate">{announcement.title}</h4>
                              {announcement.isNew && (
                                <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">NEW</Badge>
                              )}
                              <Badge className={`text-xs ${getPriorityBadge(announcement.priority)}`}>
                                {announcement.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-stone-400 line-clamp-2">{announcement.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                              <Clock className="w-3 h-3" />
                              {announcement.date}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-stone-600 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementFeed;
