import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

const roles = [
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
          <Button>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
    </SuperAdminLayout>
  );
};

export default RoleManager;
