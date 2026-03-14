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

function normalizeDomain(domain?: string | null) {
  if (!domain) return null;
  let d = domain.trim();
  d = d.replace(/^https?:\/\//i, '');
  d = d.replace(/^\/\//, '');
  d = d.replace(/\/+$/, '');
  return d || null;
}

function normalizeUrl(url?: string | null) {
  if (!url) return null;
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

export const TrustBadge = React.memo(function TrustBadge({
  businessName,
  demoDomain,
  githubRepo,
  avgRating = 0,
  totalRatings = 0,
  isVerified = false,
  trustScore = 0,
  variant = 'compact',
}: TrustBadgeProps) {
  // Defensive normalization / clamping
  const ratingRaw = Number.isFinite(Number(avgRating)) ? Number(avgRating) : 0;
  const rating = Math.max(0, Math.min(5, ratingRaw));

  const reviewsRaw = Number.isFinite(Number(totalRatings)) ? Math.floor(Number(totalRatings)) : 0;
  const reviews = Math.max(0, reviewsRaw);

  const scoreRaw = Number.isFinite(Number(trustScore)) ? Number(trustScore) : 0;
  const score = Math.max(0, Math.min(100, Math.floor(scoreRaw)));

  const cleanDemo = normalizeDomain(demoDomain);
  const demoHref = cleanDemo ? `https://${cleanDemo}` : null;
  const repoHref = normalizeUrl(githubRepo);

  if (variant === 'card') {
    return (
      <div className="flex items-center gap-1.5 flex-wrap" aria-hidden={false}>
        {isVerified && (
          <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-400 gap-0.5 px-1.5 py-0" title="Verified">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </Badge>
        )}
        {rating > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-amber-400" aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {rating.toFixed(1)}
            {reviews > 0 && <span className="text-slate-500">({reviews})</span>}
          </span>
        )}
        {githubRepo && <Github className="w-3 h-3 text-slate-500" aria-hidden />}
        {demoDomain && <Globe className="w-3 h-3 text-blue-400" aria-hidden />}
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
                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 gap-1 cursor-help" aria-label="Verified">
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
            <div className="flex items-center gap-1" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                // use filled/star color based on rounded rating
                <Star
                  key={i}
                  className={`w-3 h-3 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                  aria-hidden
                />
              ))}
              <span className="text-[10px] text-slate-400 ml-0.5" aria-label={`Rating ${rating.toFixed(1)} from ${reviews} reviews`}>
                {rating.toFixed(1)} ({reviews})
              </span>
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Full variant — for product detail pages
  return (
    <div className="border border-slate-700/50 rounded-lg p-3 bg-slate-800/30 space-y-2.5" role="region" aria-label="Trust badge">
      <div className="flex items-center gap-2">
        <Shield className={`w-4 h-4 ${isVerified ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden />
        <span className="text-xs font-medium text-slate-300">Trust Score</span>
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden ml-1" aria-hidden>
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold" aria-label={`Trust score ${score}%`}>{score}%</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Building2 className="w-3 h-3" />
          <span className="truncate" title={businessName || 'Software Vala'}>{businessName || 'Software Vala'}</span>
        </div>
        {cleanDemo && demoHref && (
          <div className="flex items-center gap-1.5 text-blue-400">
            <Globe className="w-3 h-3" />
            <a href={demoHref} target="_blank" rel="noopener noreferrer" className="truncate hover:underline" title={`Visit ${cleanDemo}`}>
              {cleanDemo}
            </a>
          </div>
        )}
        {repoHref && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <Github className="w-3 h-3" />
            <a href={repoHref} target="_blank" rel="noopener noreferrer" className="truncate hover:underline" title="Open repository">
              Repository
            </a>
          </div>
        )}
        <div className="flex items-center gap-1.5" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
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
});
