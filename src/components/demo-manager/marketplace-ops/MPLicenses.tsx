import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KeySquare, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPLicenses = () => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('user_licenses').select('*').order('created_at', { ascending: false }).limit(50);
      setLicenses(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <KeySquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">License Manager</h1>
            <p className="text-sm text-muted-foreground">{licenses.length} licenses issued</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : licenses.length === 0 ? (
          <EmptyState icon={<KeySquare className="w-12 h-12" />} title="No licenses issued" description="Licenses are generated upon purchase" />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Key</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{l.license_key?.slice(0, 16) || '—'}...</TableCell>
                    <TableCell>{l.product_id?.slice(0, 8) || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{l.status || 'active'}</Badge></TableCell>
                    <TableCell>{l.current_installs || 0} / {l.max_installs || '∞'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{l.expires_at ? new Date(l.expires_at).toLocaleDateString() : 'Never'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default MPLicenses;
