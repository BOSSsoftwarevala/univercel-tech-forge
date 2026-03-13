import { motion } from "framer-motion";
import { 
  Globe, Smartphone, Server, CheckCircle2, AlertCircle,
  Monitor, Tablet, Cloud, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'ready' | 'building' | 'pending';
  progress: number;
  features: string[];
}

const PLATFORMS: Platform[] = [
  {
    id: 'web',
    name: 'Web Application',
    icon: Globe,
    status: 'ready',
    progress: 100,
    features: ['Responsive', 'PWA Ready', 'SEO Optimized']
  },
  {
    id: 'android',
    name: 'Android App',
    icon: Smartphone,
    status: 'ready',
    progress: 100,
    features: ['APK/AAB', 'Play Store Ready', 'Auto Updates']
  },
  {
    id: 'desktop',
    name: 'Desktop App',
    icon: Monitor,
    status: 'pending',
    progress: 0,
    features: ['Windows', 'macOS', 'Linux']
  },
  {
    id: 'server',
    name: 'Server Backend',
    icon: Server,
    status: 'ready',
    progress: 100,
    features: ['Auto-scaling', 'Multi-region', 'Edge Functions']
  },
];

export const PlatformOutputPanel = () => {
  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-zinc-900/80 border-cyan-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Cloud className="w-5 h-5 text-cyan-400" />
            Multi-Platform Output
          </CardTitle>
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/50">
            <Zap className="w-3 h-3 mr-1" />
            Same Flow
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {PLATFORMS.map((platform) => (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "p-3 rounded-lg border transition-all",
                platform.status === 'ready' && "bg-emerald-500/10 border-emerald-500/30",
                platform.status === 'building' && "bg-blue-500/10 border-blue-500/30",
                platform.status === 'pending' && "bg-muted/10 border-border/30"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <platform.icon className={cn(
                    "w-5 h-5",
                    platform.status === 'ready' && "text-emerald-400",
                    platform.status === 'building' && "text-blue-400",
                    platform.status === 'pending' && "text-muted-foreground"
                  )} />
                  <span className="text-sm font-medium text-white">{platform.name}</span>
                </div>
                {platform.status === 'ready' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : platform.status === 'pending' ? (
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Progress value={platform.progress} className="w-12 h-2" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {platform.features.map((feature) => (
                  <Badge 
                    key={feature}
                    variant="secondary" 
                    className={cn(
                      "text-[9px] px-1.5 py-0",
                      platform.status === 'ready' 
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-muted/30 text-muted-foreground"
                    )}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs text-amber-300">
            <strong>Full Stack:</strong> Web + Mobile + Server — One command builds everything
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Enterprise:</strong> APK generation, ops automation, and complete deployment
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
