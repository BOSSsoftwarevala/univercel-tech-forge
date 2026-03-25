import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ALLOWED_DOMAINS = [
  'softwarewala.net',
  'softwarevala.net',
  'www.softwarewala.net',
  'www.softwarevala.net',
  'localhost',
  '127.0.0.1',
  'lovable.dev', // platform domain - required for preview
];

interface DomainProtectionProps {
  children: React.ReactNode;
}

const DomainProtection: React.FC<DomainProtectionProps> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isFranchise, setIsFranchise] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');

  useEffect(() => {
    const checkDomainAndRole = async () => {
      const hostname = window.location.hostname;
      setCurrentDomain(hostname);

      // Check if domain is in allowed list or is a preview domain
      const isDomainAllowed = ALLOWED_DOMAINS.some(domain => 
        hostname === domain || 
        hostname.endsWith('.lovable.app') ||
        hostname.endsWith('.lovableproject.com')
      );

      // Check if user is franchise
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        const hasFranchiseRole = roles?.some(r => r.role === 'franchise');
        setIsFranchise(hasFranchiseRole || false);
        
        // Franchise users bypass domain restriction
        if (hasFranchiseRole) {
          setIsAllowed(true);
          return;
        }
      }

      setIsAllowed(isDomainAllowed);
    };

    checkDomainAndRole();
  }, []);

  // Still loading
  if (isAllowed === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Shield className="h-16 w-16 text-primary animate-spin" />
          <p className="text-white/70">Verifying domain security...</p>
        </div>
      </div>
    );
  }

  // Domain not allowed
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-slate-800/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Unauthorized Domain Access
            </h1>
            
            <p className="text-slate-400 mb-6">
              This application is only authorized to run on approved domains.
            </p>

            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-red-400 mb-3">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Current Domain</span>
              </div>
              <code className="text-red-300 bg-red-500/10 px-3 py-1 rounded-lg text-sm">
                {currentDomain}
              </code>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <p className="text-slate-500 text-sm mb-3">Authorized Domains:</p>
              <div className="flex flex-col gap-2">
                <code className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg text-sm">
                  softwarewala.net
                </code>
                <code className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg text-sm">
                  softwarevala.net
                </code>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Shield className="h-3 w-3" />
              <span>Protected by Software Vala Security</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Domain allowed - render children
  return <>{children}</>;
};

export default DomainProtection;
