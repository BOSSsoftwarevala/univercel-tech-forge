import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter, Video, Calendar, Plus } from "lucide-react";

interface SocialMediaMarketingProps { activeView: string; }

const SocialMediaMarketing = ({ activeView }: SocialMediaMarketingProps) => {
  const platforms = [
    { name: "Facebook", icon: Facebook, followers: "125K", posts: 45, engagement: "4.2%" },
    { name: "Instagram", icon: Instagram, followers: "89K", posts: 78, engagement: "6.8%" },
    { name: "LinkedIn", icon: Linkedin, followers: "45K", posts: 23, engagement: "3.1%" },
    { name: "Twitter/X", icon: Twitter, followers: "67K", posts: 156, engagement: "2.4%" },
    { name: "TikTok", icon: Video, followers: "34K", posts: 12, engagement: "8.5%" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Social Media Marketing</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-1" />New Post
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {platforms.map((p, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <p.icon className="w-8 h-8 text-teal-400" />
                <div>
                  <h4 className="font-medium text-white">{p.name}</h4>
                  <p className="text-xs text-slate-400">{p.followers} followers</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Posts</span>
                  <p className="text-white font-semibold">{p.posts}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Engagement</span>
                  <p className="text-emerald-400 font-semibold">{p.engagement}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaMarketing;
