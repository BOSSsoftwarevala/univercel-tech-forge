import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, ShoppingCart, Heart, Lightbulb, ExternalLink, 
  Star, Check, Loader2, Zap, Shield, Clock, TrendingUp,
  CheckCircle2, Activity, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';

interface EnhancedDemoCardProps {
  id: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  status?: string;
  rating?: number;
  price?: number;
  healthScore?: number;
  uptimePercentage?: number;
  responseTime?: number;
  techStack?: string;
  isVerified?: boolean;
  isTrending?: boolean;
  onOpenSuggestions?: (demo: { id: string; title: string }) => void;
  className?: string;
}

const EnhancedDemoCard: React.FC<EnhancedDemoCardProps> = ({
  id,
  title,
  description,
  category,
  imageUrl,
  status = 'live',
  rating,
  price,
  healthScore = 100,
  uptimePercentage = 99.9,
  responseTime,
  techStack,
  isVerified = false,
  isTrending = false,
  onOpenSuggestions,
  className
}) => {
  const navigate = useNavigate();
  const { logAction } = useEnterpriseAudit();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 500) + 100);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('demo_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('demo_session_id', sessionId);
    }
    return sessionId;
  };

  const handleBuyNow = () => {
    // Navigate instantly, log async in background
    navigate(`/checkout/${id}`);
    logAction({
      action: 'public_buy_now_clicked',
      module: 'finance',
      severity: 'low',
      metadata: {
        demo_id: id,
        demo_title: title,
        category,
      },
    }).catch(() => {});
  };

  const handleStartDemo = () => {
    // Navigate instantly, log async in background
    navigate(`/demo/${id}`);
    logAction({
      action: 'public_try_demo_clicked',
      module: 'vala_builder',
      severity: 'low',
      metadata: {
        demo_id: id,
        demo_title: title,
        category,
      },
    }).catch(() => {});
  };

  const handleAddToCart = async () => {
    setLoadingCart(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = getSessionId();

      const { error } = await supabase
        .from('demo_cart')
        .upsert({
          user_id: user?.id || null,
          session_id: user ? null : sessionId,
          demo_id: id,
          is_active: true
        }, {
          onConflict: user ? 'user_id,demo_id' : 'session_id,demo_id'
        });

      if (error) throw error;
      
      setIsInCart(true);
      toast.success('Added to cart!', {
        description: title
      });
    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoadingCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    setLoadingFavorite(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = getSessionId();

      if (isFavorite) {
        const query = supabase.from('demo_favorites').delete();
        if (user) {
          await query.eq('user_id', user.id).eq('demo_id', id);
        } else {
          await query.eq('session_id', sessionId).eq('demo_id', id);
        }
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('demo_favorites')
          .upsert({
            user_id: user?.id || null,
            session_id: user ? null : sessionId,
            demo_id: id
          }, {
            onConflict: user ? 'user_id,demo_id' : 'session_id,demo_id'
          });

        if (error) throw error;
        
        setIsFavorite(true);
        toast.success('Added to favorites!', {
          description: title
        });
      }
    } catch (error) {
      console.error('Favorite error:', error);
      toast.error('Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleSuggestions = () => {
    if (onOpenSuggestions) {
      onOpenSuggestions({ id, title });
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
    live: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: Zap, label: 'LIVE' },
    active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: Zap, label: 'LIVE' },
    maintenance: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock, label: 'MAINTENANCE' },
    beta: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Activity, label: 'BETA' },
    new: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Star, label: 'NEW' }
  };

  const currentStatus = statusConfig[status] || statusConfig.live;
  const StatusIcon = currentStatus.icon;

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getHealthBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/20';
    if (score >= 70) return 'bg-amber-500/20';
    return 'bg-red-500/20';
  };

  return (
    <motion.div
      className={cn(
        'relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden group',
        'border border-slate-800/50 hover:border-cyan-500/50 transition-all duration-500',
        'shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      {/* Premium Glow Effect */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-purple-500/0 opacity-0 transition-opacity duration-500',
        isHovered && 'opacity-20'
      )} />

      {/* Trending Badge */}
      {isTrending && (
        <div className="absolute -top-1 -right-1 z-20">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1 shadow-lg">
            <TrendingUp className="w-3 h-3" />
            TRENDING
          </div>
        </div>
      )}

      {/* Image Section with Overlay */}
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
            {/* Animated Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_50%)]" />
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.05)_50%,transparent_75%)] bg-[length:20px_20px]" />
            </div>
            <motion.div
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? 15 : 0 
              }}
              transition={{ duration: 0.4 }}
            >
              <Play className="w-16 h-16 text-cyan-500/60" />
            </motion.div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {/* Status Badge */}
            <Badge className={cn(
              currentStatus.bg, currentStatus.text,
              'border-0 backdrop-blur-sm flex items-center gap-1 px-2.5 py-1'
            )}>
              <StatusIcon className="w-3 h-3" />
              {currentStatus.label}
            </Badge>
            
            {/* Verified Badge */}
            {isVerified && (
              <Badge className="bg-blue-500/20 text-blue-400 border-0 backdrop-blur-sm flex items-center gap-1 px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <motion.button
            onClick={handleToggleFavorite}
            disabled={loadingFavorite}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'p-2.5 rounded-full transition-all backdrop-blur-sm',
              'bg-slate-900/60 hover:bg-slate-800/80',
              isFavorite && 'bg-red-500/80 hover:bg-red-500'
            )}
          >
            {loadingFavorite ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Heart className={cn('w-4 h-4', isFavorite ? 'text-white fill-white' : 'text-white')} />
            )}
          </motion.button>
        </div>

        {/* Bottom Stats Row */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Quality Indicators */}
          <div className="flex items-center gap-2">
            {/* Health Score */}
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm text-xs font-medium',
              getHealthBg(healthScore), getHealthColor(healthScore)
            )}>
              <Shield className="w-3 h-3" />
              {healthScore}%
            </div>
            
            {/* Uptime */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/60 backdrop-blur-sm text-xs font-medium text-slate-300">
              <Activity className="w-3 h-3 text-emerald-400" />
              {uptimePercentage}%
            </div>
          </div>

          {/* Price Tag */}
          {price !== undefined && (
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
              <span className="text-white font-bold text-sm">
                {price === 0 ? 'Free' : `$${price}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Category & Tech Stack */}
        <div className="flex items-center justify-between">
          {category && (
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              {category}
            </span>
          )}
          {techStack && (
            <span className="text-[10px] font-medium text-slate-500 uppercase bg-slate-800/50 px-2 py-0.5 rounded">
              {techStack}
            </span>
          )}
        </div>

        {/* Title & Rating */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
              {title}
            </h3>
            {rating !== undefined && rating > 0 && (
              <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-amber-400">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {/* View Count */}
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Eye className="w-3 h-3" />
            <span>{viewCount.toLocaleString()} views</span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-400 line-clamp-2">{description}</p>
        )}

        {/* Primary Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold shadow-lg shadow-cyan-500/25 border-0"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-white"
            onClick={handleStartDemo}
          >
            <Play className="w-4 h-4 mr-1" />
            Try Demo
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button 
            variant="ghost"
            size="sm"
            className="flex-1 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
            onClick={handleAddToCart}
            disabled={loadingCart || isInCart}
          >
            {loadingCart ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : isInCart ? (
              <Check className="w-4 h-4 mr-1 text-emerald-400" />
            ) : (
              <ShoppingCart className="w-4 h-4 mr-1" />
            )}
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
            onClick={handleSuggestions}
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Suggest
          </Button>
        </div>
      </div>

      {/* Hover Effect Line */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default EnhancedDemoCard;
