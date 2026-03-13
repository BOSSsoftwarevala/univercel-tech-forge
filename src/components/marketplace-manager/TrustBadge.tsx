/**
 * Trust Badge Component — Shows verification, ratings, business info
 * Used across all marketplace views (cards, detail pages, search results)
 */
import React from 'react';
import { Shield, Star, Github, Globe, Building2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface TrustBadgeProps {
  businessName?: string | null;
  demoDomain?: string | null;
  githubRepo?: string | null;
  avgRating?: number | null;
  totalRatings?: number | null;
  isVerified?: boolean | null;
  trustScore?: number | null;
  variant?: 'compact' | 'full' | 'card';
}

export function TrustBadge({
  businessName,
  demoDomain,
  githubRepo,
  avgRating = 0,
  totalRatings = 0,
  isVerified = false,
  trustScore = 0,
  variant = 'compact',
}: TrustBadgeProps) {
  const rating = Number(avgRating) || 0;
  const reviews = Number(totalRatings) || 0;
  const score = Number(trustScore) || 0;

  if (variant === 'card') {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {isVerified && (
          <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-400 gap-0.5 px-1.5 py-0">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </Badge>
        )}
        {rating > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {rating.toFixed(1)}
            {reviews > 0 && <span className="text-slate-500">({reviews})</span>}
          </span>
        )}
        {githubRepo && (
          <Github className="w-3 h-3 text-slate-500" />
        )}
        {demoDomain && (
          <Globe className="w-3 h-3 text-blue-400" />
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {isVerified && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 gap-1 cursor-help">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Verified by Software Vala — {businessName || 'Trusted Business'}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {rating > 0 && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
              ))}
              <span className="text-[10px] text-slate-400 ml-0.5">{rating.toFixed(1)} ({reviews})</span>
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Full variant — for product detail pages
  return (
    <div className="border border-slate-700/50 rounded-lg p-3 bg-slate-800/30 space-y-2.5">
      <div className="flex items-center gap-2">
        <Shield className={`w-4 h-4 ${isVerified ? 'text-emerald-400' : 'text-slate-500'}`} />
        <span className="text-xs font-medium text-slate-300">Trust Score</span>
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden ml-1">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold">{score}%</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Building2 className="w-3 h-3" />
          <span className="truncate">{businessName || 'Software Vala'}</span>
        </div>
        {demoDomain && (
          <div className="flex items-center gap-1.5 text-blue-400">
            <Globe className="w-3 h-3" />
            <a href={`https://${demoDomain}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
              {demoDomain}
            </a>
          </div>
        )}
        {githubRepo && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <Github className="w-3 h-3" />
            <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
              Repository
            </a>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
          ))}
          <span className="text-slate-400">{rating.toFixed(1)} ({reviews})</span>
        </div>
      </div>

      {isVerified && (
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-1">
          <CheckCircle2 className="w-3 h-3" />
          Verified Business — All transactions are protected
        </div>
      )}
    </div>
  );
}
