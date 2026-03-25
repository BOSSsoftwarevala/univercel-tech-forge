import { useState } from 'react';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  users: number;
  permissions: string;
  color: string;
}

const initialRoles: Role[] = [
  { id: 'super_admin', name: 'Super Admin', users: 2, permissions: 'Full Access', color: 'bg-red-500' },
  { id: 'franchise', name: 'Franchise', users: 42, permissions: '28 modules', color: 'bg-green-500' },
  { id: 'reseller', name: 'Reseller', users: 156, permissions: '12 modules', color: 'bg-blue-500' },
  { id: 'developer', name: 'Developer', users: 28, permissions: '8 modules', color: 'bg-purple-500' },
  { id: 'influencer', name: 'Influencer', users: 89, permissions: '6 modules', color: 'bg-orange-500' },
  { id: 'prime', name: 'Prime User', users: 234, permissions: '10 modules', color: 'bg-yellow-500' },
  { id: 'support', name: 'Support', users: 12, permissions: '15 modules', color: 'bg-cyan-500' },
  { id: 'seo', name: 'SEO Manager', users: 5, permissions: '8 modules', color: 'bg-pink-500' },
];

const RoleManager = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState('');

  const handleEdit = (role: Role) => {
    setEditingRole({ ...role });
  };

  const handleSaveEdit = () => {
    if (!editingRole) return;
    setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
    toast.success(`Role "${editingRole.name}" updated successfully`);
    setEditingRole(null);
  };

  const handleDelete = () => {
    if (!deletingRole) return;
    setRoles(roles.filter(r => r.id !== deletingRole.id));
    toast.success(`Role "${deletingRole.name}" deleted successfully`);
    setDeletingRole(null);
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    const newRole: Role = {
      id: newRoleName.toLowerCase().replace(/\s+/g, '_'),
      name: newRoleName,
      users: 0,
      permissions: newRolePermissions || '0 modules',
      color: 'bg-gray-500',
    };
    setRoles([...roles, newRole]);
    toast.success(`Role "${newRoleName}" created successfully`);
    setNewRoleName('');
    setNewRolePermissions('');
    setIsAddDialogOpen(false);
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" />
              Role Manager
            </h1>
            <p className="text-muted-foreground">Manage user roles and their access levels</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 rounded-full ${role.color}`} />
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeletingRole(role)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Users</span>
                    <span className="font-medium">{role.users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Permissions</span>
                    <Badge variant="outline">{role.permissions}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update the role name and permissions.</DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-permissions">Permissions</Label>
                <Input
                  id="edit-permissions"
                  value={editingRole.permissions}
                  onChange={(e) => setEditingRole({ ...editingRole, permissions: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new role with specified permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Role Name</Label>
              <Input
                id="new-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-permissions">Permissions</Label>
              <Input
                id="new-permissions"
                value={newRolePermissions}
                onChange={(e) => setNewRolePermissions(e.target.value)}
                placeholder="e.g., 5 modules"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingRole} onOpenChange={(open) => !open && setDeletingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{deletingRole?.name}" role? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SuperAdminLayout>
  );
};

export default RoleManager;
