import { motion } from "framer-motion";
import { Users, Smartphone, Globe, BarChart3, PieChart, TrendingUp, Target, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AudienceInsights = () => {
  const ageGroups = [
    { range: "18-24", percentage: 28, count: 8400 },
    { range: "25-34", percentage: 38, count: 11400 },
    { range: "35-44", percentage: 22, count: 6600 },
    { range: "45-54", percentage: 8, count: 2400 },
    { range: "55+", percentage: 4, count: 1200 },
  ];

  const devices = [
    { name: "iPhone", percentage: 42, icon: Smartphone },
    { name: "Android", percentage: 38, icon: Smartphone },
    { name: "Desktop", percentage: 15, icon: Globe },
    { name: "Tablet", percentage: 5, icon: Globe },
  ];

  const interests = [
    { name: "Technology", percentage: 78, color: "violet" },
    { name: "Business", percentage: 65, color: "cyan" },
    { name: "Entrepreneurship", percentage: 58, color: "emerald" },
    { name: "Finance", percentage: 45, color: "amber" },
    { name: "Marketing", percentage: 42, color: "pink" },
  ];

  const languages = [
    { language: "English", percentage: 52, flag: "🇺🇸" },
    { language: "Spanish", percentage: 18, flag: "🇪🇸" },
    { language: "Hindi", percentage: 12, flag: "🇮🇳" },
    { language: "Portuguese", percentage: 10, flag: "🇧🇷" },
    { language: "Others", percentage: 8, flag: "🌍" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">Audience Insights</h2>
          <p className="text-slate-400">Demographics, interests, and behavior analysis</p>
        </div>
        <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30">
          <Users className="w-3 h-3 mr-1" />
          30K Audience
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-100">30,000</div>
            <div className="text-xs text-slate-400">Total Reach</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">4.8%</div>
            <div className="text-xs text-slate-400">Engagement Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">68%</div>
            <div className="text-xs text-slate-400">Active Followers</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">+12%</div>
            <div className="text-xs text-slate-400">Growth Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ageGroups.map((group, index) => (
              <motion.div
                key={group.range}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{group.range}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-violet-300 font-medium">{group.percentage}%</span>
                    <span className="text-slate-500 text-xs">({group.count.toLocaleString()})</span>
                  </div>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${group.percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-violet-400" />
              Device Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {devices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <motion.div
                    key={device.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-800/50 rounded-lg text-center"
                  >
                    <Icon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-violet-100">{device.percentage}%</div>
                    <div className="text-sm text-slate-400">{device.name}</div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-violet-400" />
              Interest Clusters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300">{interest.name}</span>
                  <span className={`text-${interest.color}-400 font-medium`}>{interest.percentage}%</span>
                </div>
                <Progress value={interest.percentage} className="h-2 bg-slate-800" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-violet-400" />
              Language Segmentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.language}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-slate-200">{lang.language}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500" 
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                  <span className="text-violet-300 font-medium w-12 text-right">{lang.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudienceInsights;
