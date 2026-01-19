/**
 * CATEGORY CARD
 * DEBUG FIX: Removed mock delay, added action logging
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, Loader2, TrendingUp, Headphones, CreditCard, 
  Shield, BarChart3, Brain, Users, ShoppingCart, DollarSign,
  Ticket, ArrowUp, Percent, Banknote, AlertOctagon, Gauge,
  Award, Sparkles, MessageSquare, Activity, Globe, Package,
  AlertTriangle, CheckCircle, Layers, Clock, Wallet, FileWarning,
  PieChart, Medal, Lightbulb, Target
} from 'lucide-react';
import { useActionLogger } from '@/hooks/useActionLogger';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  count: number;
  description?: string;
  status?: 'active' | 'inactive' | 'warning';
  onClick: () => void;
  variant?: 'category' | 'sub' | 'micro' | 'nano';
}

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Headphones: <Headphones className="h-5 w-5" />,
  CreditCard: <CreditCard className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  ShoppingCart: <ShoppingCart className="h-5 w-5" />,
  DollarSign: <DollarSign className="h-5 w-5" />,
  Ticket: <Ticket className="h-5 w-5" />,
  ArrowUp: <ArrowUp className="h-5 w-5" />,
  Percent: <Percent className="h-5 w-5" />,
  Banknote: <Banknote className="h-5 w-5" />,
  AlertOctagon: <AlertOctagon className="h-5 w-5" />,
  Gauge: <Gauge className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  CheckCircle: <CheckCircle className="h-5 w-5" />,
  Layers: <Layers className="h-5 w-5" />,
  Clock: <Clock className="h-5 w-5" />,
  Wallet: <Wallet className="h-5 w-5" />,
  FileWarning: <FileWarning className="h-5 w-5" />,
  PieChart: <PieChart className="h-5 w-5" />,
  Medal: <Medal className="h-5 w-5" />,
  Lightbulb: <Lightbulb className="h-5 w-5" />,
  Target: <Target className="h-5 w-5" />,
  BarChart: <BarChart3 className="h-5 w-5" />,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  icon,
  count,
  description,
  status = 'active',
  onClick,
  variant = 'category'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { logAction } = useActionLogger();

  // DEBUG FIX: Removed mock 150ms delay, direct execution with logging
  const handleClick = useCallback(async () => {
    const startTime = performance.now();
    setIsLoading(true);
    
    try {
      // Log navigation action
      await logAction({
        buttonId: `category_card_${id}`,
        moduleName: 'reseller_manager',
        actionType: 'NAVIGATE',
        actionResult: 'success',
        responseTimeMs: Math.round(performance.now() - startTime),
        metadata: { categoryId: id, categoryName: name, variant }
      });
      
      // Execute callback immediately (no mock delay)
      onClick();
    } catch (error) {
      await logAction({
        buttonId: `category_card_${id}`,
        moduleName: 'reseller_manager',
        actionType: 'NAVIGATE',
        actionResult: 'failure',
        responseTimeMs: Math.round(performance.now() - startTime),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, name, variant, onClick, logAction]);

  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'category':
        return 'p-6';
      case 'sub':
        return 'p-5';
      case 'micro':
        return 'p-4';
      case 'nano':
        return 'p-3';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`bg-card border-border hover:border-primary/50 cursor-pointer transition-all ${getVariantStyles()}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor()}`}>
              {iconMap[icon] || <Activity className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : ''}>
              {count.toLocaleString()}
            </Badge>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <ChevronRight className={`h-5 w-5 transition-transform ${isHovered ? 'translate-x-1 text-primary' : 'text-muted-foreground'}`} />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
