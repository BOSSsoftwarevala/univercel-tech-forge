import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, ShoppingCart, Heart, Lightbulb, ExternalLink, 
  Star, Check, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EnhancedDemoCardProps {
  id: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  status?: string;
  rating?: number;
  price?: number;
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
  onOpenSuggestions,
  className
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('demo_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('demo_session_id', sessionId);
    }
    return sessionId;
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`);
  };

  const handleStartDemo = () => {
    // Open demo in new tab or navigate to demo view
    navigate(`/demo/${id}`);
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
        // Remove from favorites
        const query = supabase.from('demo_favorites').delete();
        if (user) {
          await query.eq('user_id', user.id).eq('demo_id', id);
        } else {
          await query.eq('session_id', sessionId).eq('demo_id', id);
        }
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
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

  const statusColors: Record<string, string> = {
    live: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    beta: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    new: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  return (
    <motion.div
      className={cn(
        'bg-card rounded-2xl border border-border shadow-lg overflow-hidden group',
        'hover:shadow-xl hover:border-primary/30 transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Image Section */}
      <div className="relative h-44 bg-secondary overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Play className="w-12 h-12 text-primary/40" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={statusColors[status] || statusColors.live}>
            {status.toUpperCase()}
          </Badge>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={loadingFavorite}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all',
            'bg-black/40 hover:bg-black/60 backdrop-blur-sm',
            isFavorite && 'bg-red-500/80 hover:bg-red-500'
          )}
        >
          {loadingFavorite ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Heart className={cn('w-4 h-4', isFavorite ? 'text-white fill-white' : 'text-white')} />
          )}
        </button>

        {/* Price Tag */}
        {price !== undefined && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <span className="text-white font-bold">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category */}
        {category && (
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {category}
          </span>
        )}

        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">{title}</h3>
          {rating !== undefined && rating > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}

        {/* Primary Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button 
            variant="outline"
            className="flex-1"
            onClick={handleStartDemo}
          >
            <Play className="w-4 h-4 mr-1" />
            Start Demo
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={loadingCart || isInCart}
          >
            {loadingCart ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : isInCart ? (
              <Check className="w-4 h-4 mr-1" />
            ) : (
              <ShoppingCart className="w-4 h-4 mr-1" />
            )}
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            onClick={handleSuggestions}
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Suggestions
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedDemoCard;
