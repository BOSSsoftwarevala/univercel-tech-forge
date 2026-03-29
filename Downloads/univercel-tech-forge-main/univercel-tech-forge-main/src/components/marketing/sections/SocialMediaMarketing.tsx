import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter, Video, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface SocialMediaMarketingProps { activeView: string; }

const SocialMediaMarketing = ({ activeView }: SocialMediaMarketingProps) => {
  const queryClient = useQueryClient();
  const platform = activeView === "social-instagram"
    ? "instagram"
    : activeView === "social-linkedin"
    ? "linkedin"
    : activeView === "social-twitter"
    ? "twitter"
    : activeView === "social-tiktok"
    ? "tiktok"
    : "facebook";

  const platformConfig = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    tiktok: Video,
  } as const;

  const SocialIcon = platformConfig[platform];

  const socialQuery = useQuery({
    queryKey: ["marketing-manager", "social-platform", platform],
    queryFn: () => marketingManagerApi.getSocialPlatform(platform),
    staleTime: 20_000,
    enabled: activeView.startsWith("social"),
  });

  const scheduleMutation = useMutation({
    mutationFn: () => marketingManagerApi.scheduleSocialPost({
      platform,
      title: `${platform.toUpperCase()} Auto Post`,
      content: `Automated ${platform} content generated from the marketing control center on ${new Date().toLocaleString()}.`,
      hashtags: ["softwarevala", "growth", platform],
      scheduled_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      ai_generated: true,
    }),
    onSuccess: () => {
      toast.success(`${platform} post scheduled`);
      void queryClient.invalidateQueries({ queryKey: ["marketing-manager", "social-platform", platform] });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to schedule post");
    },
  });

  const posts = socialQuery.data?.posts || [];
  const summary = socialQuery.data?.summary;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Social Media Marketing</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => scheduleMutation.mutate()}>
          <Plus className="w-4 h-4 mr-1" />New Post
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <SocialIcon className="w-8 h-8 text-teal-400" />
              <div>
                <h4 className="font-medium text-white capitalize">{platform}</h4>
                <p className="text-xs text-slate-400">Live publishing lane</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Posts</span><p className="text-white font-semibold">{summary?.total || 0}</p></div>
              <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Scheduled</span><p className="text-emerald-400 font-semibold">{summary?.scheduled || 0}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm text-white">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3">
                <div>
                  <p className="text-sm text-white">{post.title || `${platform} campaign post`}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{post.content}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={post.status === "published" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}>{post.status.toUpperCase()}</Badge>
                  <span className="text-xs text-slate-500">{post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : "Immediate"}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMediaMarketing;
