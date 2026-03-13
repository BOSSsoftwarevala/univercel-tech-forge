import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  getProductApiMappings,
  createProductApiMapping,
  updateProductApiMapping,
  deleteProductApiMapping,
} from '@/routes/product-api';

interface Mapping {
  id: string;
  product_id: string;
  service_id: string;
  is_active: boolean;
  tenant_id: string;
  product_name?: string;
  service_name?: string;
}

interface Props {
  tenantId: string;
}

export default function ProductAPIControl({ tenantId }: Props) {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterProduct, setFilterProduct] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Mapping | null>(null);
  const [form, setForm] = useState({ product_id: '', service_id: '', is_active: true });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await getProductApiMappings(tenantId, filterProduct || undefined);
    if (err) { setError(err.message); setLoading(false); return; }
    setMappings((data ?? []) as Mapping[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId, filterProduct]);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ product_id: '', service_id: '', is_active: true });
    setDialogOpen(true);
  };

  const openEdit = (m: Mapping) => {
    setEditTarget(m);
    setForm({ product_id: m.product_id, service_id: m.service_id, is_active: m.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editTarget) {
      await updateProductApiMapping(editTarget.id, form, tenantId);
    } else {
      await createProductApiMapping(form, tenantId);
    }
    setSaving(false);
    setDialogOpen(false);
    load();
  };

  const handleToggle = async (m: Mapping) => {
    await updateProductApiMapping(m.id, { is_active: !m.is_active }, tenantId);
    load();
  };

  const handleDelete = async (m: Mapping) => {
    if (!confirm('Remove this mapping?')) return;
    await deleteProductApiMapping(m.id, tenantId);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product API Control</h2>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Mapping</Button>
      </div>

      <div className="flex gap-4 items-center">
        <Label className="shrink-0">Filter by Product ID:</Label>
        <Input
          placeholder="Product ID"
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : error ? (
            <div className="p-6 text-red-500">Error: {error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No mappings found</TableCell></TableRow>
                )}
                {mappings.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-sm">{m.product_id}</TableCell>
                    <TableCell className="font-mono text-sm">{m.service_id}</TableCell>
                    <TableCell>
                      <Switch checked={m.is_active} onCheckedChange={() => handleToggle(m)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Edit className="w-3 h-3" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(m)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editTarget ? 'Edit Mapping' : 'Add Mapping'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Product ID</Label><Input value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} /></div>
            <div><Label>Service ID</Label><Input value={form.service_id} onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))} /></div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label>Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.product_id || !form.service_id}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
