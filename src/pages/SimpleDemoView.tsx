import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, ExternalLink, Check, Loader2, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDemoTestMode } from '@/contexts/DemoTestModeContext';

interface DemoData {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  login_url: string | null;
  status: string;
}

interface LoginRole {
  id: string;
  role_name: string;
  username: string;
  password_encrypted: string;
}

const SimpleDemoView = () => {
  const { demoId } = useParams();
  const [selectedRole, setSelectedRole] = useState('');
  const [demo, setDemo] = useState<DemoData | null>(null);
  const [loginRoles, setLoginRoles] = useState<LoginRole[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Demo Test Mode - Check if we should skip restrictions
  const { isTestMode, shouldShowAnimation } = useDemoTestMode();

  useEffect(() => {
    let mounted = true;

    const fetchDemo = async () => {
      if (!demoId) {
        if (mounted) setLoading(false);
        return;
      }
      
      if (mounted) setLoading(true);

      try {
        // In test mode, fetch ALL demos (not just active)
        // Otherwise only fetch active demos
        let query = supabase
          .from('demos')
          .select('id, title, url, description, category, login_url, status')
          .eq('id', demoId);

        // Only filter by status if NOT in test mode
        if (!isTestMode) {
          query = query.eq('status', 'active');
        }

        const { data: demoData, error: demoError } = await query.single();
        if (demoError) {
          console.error('Failed to fetch demo:', demoError);
        } else if (demoData && mounted) {
          setDemo(demoData);
        }

        // Fetch login roles for this demo
        const { data: rolesData, error: rolesError } = await supabase
          .from('demo_login_roles')
          .select('id, role_name, username, password_encrypted')
          .eq('demo_id', demoId)
          .eq('is_active', true)
          .order('display_order');

        if (rolesError) {
          console.error('Failed to fetch demo roles:', rolesError);
        } else if (rolesData && rolesData.length > 0 && mounted) {
          setLoginRoles(rolesData);
          setSelectedRole(rolesData[0].id);
        }
      } catch (err) {
        console.error('Unexpected error fetching demo:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDemo();

    return () => {
      mounted = false;
    };
  }, [demoId, isTestMode]);

  const handleOpenDemo = () => {
    if (!demo) return;
    const rawUrl = demo.login_url || demo.url;
    if (!rawUrl) return;

    // normalize url - open in new tab safely
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl.replace(/^\/+/, '')}`;
    try {
      window.open(normalized, '_blank', 'noopener,noreferrer');
    } catch (err) {
      // fallback
      window.open(normalized, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Demo not found</p>
          <Link to="/demos" className="text-cyan-400 hover:underline">Back to Demos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/demos" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Demos</span>
            </Link>
            {/* Hide login button in test mode - no login required */}
            {!isTestMode && (
              <Link to="/login" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Demo Header - Minimal animation in test mode */}
        <div
          className={`text-center mb-10 ${shouldShowAnimation ? (shouldShowAnimation() ? 'animate-fade-in' : '') : ''}`}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{demo.title}</h1>
          <p className="text-slate-400 text-lg">{demo.description || demo.category}</p>
        </div>

        {/* Demo Preview Card */}
        <div
          className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8 ${shouldShowAnimation ? (shouldShowAnimation() ? 'animate-fade-in' : '') : ''}`}
        >
          {/* Demo Preview Image */}
          <div className="aspect-video bg-slate-800 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-cyan-400" />
                </div>
                <p className="text-slate-400">Live demo preview</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Demo URL Display */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">Demo URL</span>
              </div>
              <p className="text-cyan-400 text-sm break-all">{demo.url}</p>
              {demo.login_url && demo.login_url !== demo.url && (
                <p className="text-slate-400 text-xs mt-2">Login: {demo.login_url}</p>
              )}
            </div>

            {/* Role Selector - Always available, no approval needed in test mode */}
            {loginRoles.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Select Role to View</h3>
                <div className="grid grid-cols-3 gap-3">
                  {loginRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedRole === role.id
                          ? 'bg-cyan-500/10 border-cyan-500'
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {selectedRole === role.id && <Check className="w-4 h-4 text-cyan-400" />}
                        <span className="font-semibold">{role.role_name}</span>
                      </div>
                      <p className="text-xs text-slate-400">User: {role.username}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Single Open Demo Button - Direct access, no popups */}
            <button
              onClick={handleOpenDemo}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              <ExternalLink className="w-5 h-5" />
              Open Demo
            </button>
          </div>
        </div>

        {/* Category & Actions */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Demo Info */}
          <div
            className={`bg-slate-900 border border-slate-800 rounded-xl p-6 ${shouldShowAnimation ? (shouldShowAnimation() ? 'animate-fade-in' : '') : ''}`}
          >
            <h3 className="text-lg font-semibold mb-4">Demo Details</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-cyan-400" />
                Category: {demo.category}
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-cyan-400" />
                Live demo access
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-cyan-400" />
                {loginRoles.length > 0 ? `${loginRoles.length} login role(s)` : 'Direct access'}
              </li>
            </ul>
          </div>

          {/* Actions - Only show purchase option if not in test mode for real purchases */}
          <div
            className={`bg-slate-900 border border-slate-800 rounded-xl p-6 ${shouldShowAnimation ? (shouldShowAnimation() ? 'animate-fade-in' : '') : ''}`}
          >
            <h3 className="text-lg font-semibold mb-4">Interested?</h3>
            <p className="text-slate-400 text-sm mb-4">Try the demo first, then purchase if you like it.</p>
            <Link
              to={`/checkout/${demo.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-semibold transition-colors"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimpleDemoView;
