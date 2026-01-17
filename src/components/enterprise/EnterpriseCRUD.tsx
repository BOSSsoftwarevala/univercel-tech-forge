/**
 * JIRA-CRUD-01/02/03/04: Enterprise CRUD Component
 * Provides standardized CRUD operations with full audit trail
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Eye, RefreshCw, Download, Upload, 
  Search, Filter, Loader2, Check, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useEnterpriseAudit, AuditModule } from '@/hooks/useEnterpriseAudit';
import { toast } from 'sonner';

interface CRUDConfig {
  tableName: string;
  entityName: string;
  module: AuditModule;
  primaryKey?: string;
  softDeleteField?: string;
  columns: ColumnConfig[];
  allowCreate?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowExport?: boolean;
  allowImport?: boolean;
}

interface ColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date' | 'boolean';
  required?: boolean;
  editable?: boolean;
  options?: { value: string; label: string }[];
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface EnterpriseCRUDProps {
  config: CRUDConfig;
  onRowClick?: (row: Record<string, unknown>) => void;
  customActions?: (row: Record<string, unknown>) => React.ReactNode;
}

export const EnterpriseCRUD: React.FC<EnterpriseCRUDProps> = ({
  config,
  onRowClick,
  customActions,
}) => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [actionLoading, setActionLoading] = useState(false);

  const { logCrudOperation } = useEnterpriseAudit();

  const primaryKey = config.primaryKey || 'id';
  const softDeleteField = config.softDeleteField || 'deleted_at';

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from(config.tableName as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setData((result as unknown as Record<string, unknown>[]) || []);
    } catch (err) {
      console.error('[CRUD] Fetch error:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [config.tableName, searchQuery, softDeleteField]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CREATE
  const handleCreate = async () => {
    setActionLoading(true);
    try {
      const { data: newRow, error } = await supabase
        .from(config.tableName as any)
        .insert(formData)
        .select()
        .single();

      if (error) throw error;

      await logCrudOperation('create', config.entityName, newRow[primaryKey], config.module, undefined, formData);

      toast.success(`${config.entityName} created`);
      setShowCreateModal(false);
      setFormData({});
      fetchData();
    } catch (err) {
      console.error('[CRUD] Create error:', err);
      toast.error('Failed to create');
    } finally {
      setActionLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!selectedRow) return;
    setActionLoading(true);
    
    try {
      const rowId = selectedRow[primaryKey] as string;
      const oldValues = { ...selectedRow };

      const { error } = await supabase
        .from(config.tableName as any)
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq(primaryKey, rowId);

      if (error) throw error;

      await logCrudOperation('update', config.entityName, rowId, config.module, oldValues, formData);

      toast.success(`${config.entityName} updated`);
      setShowEditModal(false);
      setSelectedRow(null);
      setFormData({});
      fetchData();
    } catch (err) {
      console.error('[CRUD] Update error:', err);
      toast.error('Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  // SOFT DELETE
  const handleDelete = async () => {
    if (!selectedRow) return;
    setActionLoading(true);
    
    try {
      const rowId = selectedRow[primaryKey] as string;

      const { error } = await supabase
        .from(config.tableName as any)
        .update({ [softDeleteField]: new Date().toISOString() })
        .eq(primaryKey, rowId);

      if (error) throw error;

      await logCrudOperation('soft_delete', config.entityName, rowId, config.module, selectedRow);

      toast.success(`${config.entityName} deleted`);
      setShowDeleteConfirm(false);
      setSelectedRow(null);
      fetchData();
    } catch (err) {
      console.error('[CRUD] Delete error:', err);
      toast.error('Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  // EXPORT
  const handleExport = async () => {
    try {
      const csvContent = [
        config.columns.map(c => c.label).join(','),
        ...data.map(row => 
          config.columns.map(c => `"${row[c.key] || ''}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.tableName}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      await logCrudOperation('read', config.entityName, 'bulk_export', config.module);
      toast.success('Export completed');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const openEditModal = (row: Record<string, unknown>) => {
    setSelectedRow(row);
    setFormData({ ...row });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (row: Record<string, unknown>) => {
    setSelectedRow(row);
    setShowDeleteConfirm(true);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">{config.entityName} Management</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {config.allowExport !== false && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          )}
          {config.allowCreate !== false && (
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add {config.entityName}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No {config.entityName.toLowerCase()}s found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/50 border-b border-border">
                <tr>
                  {config.columns.map(col => (
                    <th key={col.key} className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      {col.label}
                    </th>
                  ))}
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <motion.tr
                    key={row[primaryKey] as string}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border hover:bg-accent/30 cursor-pointer"
                    onClick={() => onRowClick?.(row)}
                  >
                    {config.columns.map(col => (
                      <td key={col.key} className="p-3 text-sm">
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] || '-')}
                      </td>
                    ))}
                    <td className="p-3">
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        {config.allowEdit !== false && (
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(row)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {config.allowDelete !== false && (
                          <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(row)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                        {customActions?.(row)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={() => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setFormData({});
        setSelectedRow(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{showEditModal ? 'Edit' : 'Create'} {config.entityName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {config.columns
              .filter(col => col.editable !== false)
              .map(col => (
                <div key={col.key}>
                  <label className="text-sm font-medium">{col.label}{col.required && ' *'}</label>
                  <Input
                    type={col.type === 'email' ? 'email' : col.type === 'number' ? 'number' : 'text'}
                    value={String(formData[col.key] || '')}
                    onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                    required={col.required}
                    className="mt-1"
                  />
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setFormData({});
            }}>
              Cancel
            </Button>
            <Button onClick={showEditModal ? handleUpdate : handleCreate} disabled={actionLoading}>
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {showEditModal ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {config.entityName}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {config.entityName.toLowerCase()}? This action can be undone by an administrator.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EnterpriseCRUD;
