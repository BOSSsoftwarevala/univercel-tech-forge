import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Play, Upload, Eye, Heart, Share2, 
  MessageCircle, TrendingUp, Plus, Clock, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const videos = [
  {
    id: 1,
    title: 'POS System Demo - 60s',
    thumbnail: '/placeholder.svg',
    views: 45200,
    likes: 3400,
    shares: 890,
    comments: 234,
    duration: '0:58',
    status: 'published',
    engagement: 8.5,
  },
  {
    id: 2,
    title: 'Why School ERP Matters',
    thumbnail: '/placeholder.svg',
    views: 32100,
    likes: 2100,
    shares: 567,
    comments: 189,
    duration: '1:24',
    status: 'published',
    engagement: 7.2,
  },
  {
    id: 3,
    title: 'Hospital CRM Features',
    thumbnail: '/placeholder.svg',
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    duration: '0:45',
    status: 'draft',
    engagement: 0,
  },
];

const VideoReelsManager = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Short Videos & Reels</h2>
          <p className="text-slate-400 mt-1">Manage your promotional video content</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toast.info("Upload Video", { description: "Video upload feature coming soon" })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium shadow-lg shadow-violet-500/20"
        >
          <Upload className="w-5 h-5" />
          Upload Video
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '892K', icon: Eye, color: 'violet' },
          { label: 'Total Likes', value: '67.5K', icon: Heart, color: 'pink' },
          { label: 'Total Shares', value: '12.4K', icon: Share2, color: 'cyan' },
          { label: 'Avg Engagement', value: '7.8%', icon: TrendingUp, color: 'emerald' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-3`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload New Video Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => toast.info("Upload New Reel", { description: "Drag and drop or click to upload" })}
          className="aspect-[9/16] max-h-[400px] rounded-xl bg-slate-900/60 border-2 border-dashed border-slate-700/50 hover:border-violet-500/50 transition-all flex flex-col items-center justify-center cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
            <Plus className="w-8 h-8 text-violet-400" />
          </div>
          <p className="text-slate-400 group-hover:text-violet-400 transition-colors">Upload New Reel</p>
        </motion.div>

        {/* Video Cards */}
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="aspect-[9/16] max-h-[400px] rounded-xl bg-slate-900/60 border border-slate-700/50 overflow-hidden relative group"
          >
            {/* Thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-16 h-16 text-slate-600" />
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>

            {/* Status Badge */}
            <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
              video.status === 'published'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {video.status === 'published' ? 'Published' : 'Draft'}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.info(`Playing "${video.title}"`, { description: "Video player coming soon" })}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.button>
            </div>

            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="font-medium text-white mb-2">{video.title}</h4>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.views > 1000 ? `${(video.views/1000).toFixed(1)}K` : video.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {video.likes > 1000 ? `${(video.likes/1000).toFixed(1)}K` : video.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {video.comments}
                </span>
              </div>
              {video.engagement > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  {video.engagement}% engagement
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Video Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">AI Content Suggestions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            'Create a 30-second testimonial compilation',
            'Show POS system speed comparison',
            'Behind-the-scenes of a demo call',
          ].map((suggestion, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/30">
              <p className="text-sm text-slate-300">{suggestion}</p>
              <button 
                onClick={() => toast.success(`Generating script for: "${suggestion}"`, { description: "AI script generation in progress..." })}
                className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Generate Script →
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default VideoReelsManager;
