// Continent Super Admin - Countries Screen (DB-Driven)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';

interface CountriesViewProps {
  onViewCountry?: (countryId: string) => void;
}

const CountriesView = ({ onViewCountry }: CountriesViewProps) => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('franchise_accounts')
          .select('id, country, status, created_at')
          .order('created_at', { ascending: false })
          .limit(50);

        // Group by country
        const countryMap: Record<string, { count: number; statuses: string[]; id: string }> = {};
        (data || []).forEach(f => {
          if (!f.country) return;
          if (!countryMap[f.country]) {
            countryMap[f.country] = { count: 0, statuses: [], id: f.id };
          }
          countryMap[f.country].count++;
          countryMap[f.country].statuses.push(f.status || 'unknown');
        });

        const countriesList = Object.entries(countryMap).map(([country, info]) => ({
          id: info.id,
          country,
          franchises: info.count,
          status: info.statuses.includes('active') ? 'Active' : 'Pending',
        }));

        setCountries(countriesList);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Countries</h1>
        <p className="text-muted-foreground">Manage countries under this continent</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Globe2 className="h-5 w-5" />
            Country Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : countries.length === 0 ? (
            <EmptyState title="No countries found" description="Countries will appear here when franchises are registered" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Country</TableHead>
                  <TableHead className="text-muted-foreground">Franchises</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((country, index) => (
                  <motion.tr
                    key={country.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-border"
                  >
                    <TableCell className="font-medium text-foreground">{country.country}</TableCell>
                    <TableCell className="text-foreground">{country.franchises}</TableCell>
                    <TableCell>
                      <Badge variant={country.status === 'Active' ? 'default' : 'secondary'}
                        className={country.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500' : ''}>
                        {country.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => onViewCountry?.(country.id)} className="border-border">
                        <Eye className="h-4 w-4 mr-1" /> View Summary
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CountriesView;
