import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Mail, Calendar, Percent, Save } from 'lucide-react';

interface ResellerProfile {
  id: string;
  commission_rate: number;
  status: string;
  joined_at: string;
  user: {
    email: string;
    created_at: string;
  };
}

export default function ResellerProfile() {
  const [profile, setProfile] = useState<ResellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commissionRate, setCommissionRate] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('reseller-profile', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      setProfile(data);
      setCommissionRate(data.reseller.commission_rate.toString());
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    const rate = parseFloat(commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error('Please enter a valid commission rate (0-100%)');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('reseller-profile', {
        body: {
          commission_rate: rate
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Profile updated successfully');
      setProfile(prev => prev ? { ...prev, reseller: data.reseller } : null);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8 text-gray-500">Failed to load profile</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your reseller account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your reseller account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="font-medium capitalize">{profile.reseller.status}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{profile.user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">
                  {new Date(profile.reseller.joined_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Percent className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Commission Rate</p>
                <p className="font-medium">{profile.reseller.commission_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Update your reseller preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="commission">Commission Rate (%)</Label>
              <Input
                id="commission"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="10.0"
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Your commission rate is set by administrators. This field shows your current rate.
              </p>
            </div>

            <Button
              onClick={updateProfile}
              disabled={saving}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>
            Overview of your reseller account performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profile.reseller.commission_rate}%
              </div>
              <p className="text-sm text-gray-600">Commission Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {profile.reseller.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </div>
              <p className="text-sm text-gray-600">Account Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor((new Date().getTime() - new Date(profile.reseller.joined_at).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-sm text-gray-600">Days as Reseller</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
