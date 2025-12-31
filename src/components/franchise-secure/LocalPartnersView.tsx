import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Building2, Star, RefreshCw, Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface LocalPartnersViewProps {
  franchiseId: string;
  region: string;
}

interface Partner {
  id: string;
  name: string;
  masked_email: string;
  status: string;
  type: 'reseller' | 'influencer';
  performance_score?: number;
}

export function LocalPartnersView({ franchiseId, region }: LocalPartnersViewProps) {
  const [resellers, setResellers] = useState<Partner[]>([]);
  const [influencers, setInfluencers] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      // Fetch resellers in region (mock for now - would use actual region filter)
      const { data: resellerData } = await supabase
        .from('reseller_accounts')
        .select('id, full_name, masked_email, status')
        .limit(10);

      if (resellerData) {
        setResellers(resellerData.map(r => ({
          id: r.id,
          name: r.full_name || 'Unknown',
          masked_email: r.masked_email || '***@***.com',
          status: r.status || 'pending',
          type: 'reseller' as const,
          performance_score: Math.floor(Math.random() * 30) + 70
        })));
      }

      // Fetch influencers (mock data for now)
      setInfluencers([
        { id: '1', name: 'Social Star', masked_email: 's***@***.com', status: 'active', type: 'influencer', performance_score: 85 },
        { id: '2', name: 'Content Creator', masked_email: 'c***@***.com', status: 'active', type: 'influencer', performance_score: 78 },
        { id: '3', name: 'Brand Ambassador', masked_email: 'b***@***.com', status: 'pending', type: 'influencer', performance_score: 65 },
      ]);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [franchiseId, region]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          partner.type === 'reseller' ? 'bg-blue-500/20' : 'bg-pink-500/20'
        }`}>
          {partner.type === 'reseller' ? (
            <Building2 className="w-5 h-5 text-blue-400" />
          ) : (
            <Star className="w-5 h-5 text-pink-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{partner.name}</p>
          <p className="text-xs text-slate-400 font-mono">{partner.masked_email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {partner.performance_score && (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800">
            <span className={`text-xs font-medium ${
              partner.performance_score >= 80 ? 'text-emerald-400' :
              partner.performance_score >= 60 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {partner.performance_score}%
            </span>
          </div>
        )}
        <Badge className={getStatusColor(partner.status)}>
          {partner.status}
        </Badge>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">Local Partners</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchPartners}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Tabs defaultValue="resellers" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-slate-900/50">
          <TabsTrigger value="resellers" className="gap-2">
            <Building2 className="w-4 h-4" />
            Resellers ({resellers.length})
          </TabsTrigger>
          <TabsTrigger value="influencers" className="gap-2">
            <Star className="w-4 h-4" />
            Influencers ({influencers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resellers" className="space-y-2 mt-4">
          {resellers.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No resellers in your territory</p>
            </div>
          ) : (
            resellers.map(partner => (
              <PartnerCard key={partner.id} partner={partner} />
            ))
          )}
        </TabsContent>

        <TabsContent value="influencers" className="space-y-2 mt-4">
          {influencers.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Star className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No influencers in your territory</p>
            </div>
          ) : (
            influencers.map(partner => (
              <PartnerCard key={partner.id} partner={partner} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <p className="text-xs text-slate-500 mt-4 text-center">
        <Eye className="w-3 h-3 inline mr-1" />
        View only • Cannot approve or suspend partners
      </p>
    </motion.div>
  );
}
