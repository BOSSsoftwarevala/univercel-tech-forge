import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WireframeFooterProps {
  theme: 'dark' | 'light';
}

export function WireframeFooter({ theme }: WireframeFooterProps) {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t py-4 px-6 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            Legal <ExternalLink className="h-3 w-3" />
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            Privacy <ExternalLink className="h-3 w-3" />
          </Link>
          <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            Support <ExternalLink className="h-3 w-3" />
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            Terms <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
          <span className="text-xs text-muted-foreground">
            © 2035 Software Vala. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
