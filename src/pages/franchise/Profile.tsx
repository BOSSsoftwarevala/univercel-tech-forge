import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Building2, FileText, 
  Shield, Calendar, Award, Edit2, Upload, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FranchiseProfile = () => {
  const profileData = {
    businessName: 'TechVision Solutions Pvt Ltd',
    ownerName: 'Rajesh Kumar',
    franchiseCode: 'FRN-MH-2024-001',
    email: 'raj***@techvision.com',
    phone: '+91 98***45678',
    address: '123 Business Park, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    gst: 'GSTIN***4567',
    pan: 'PAN***890',
    kycStatus: 'verified',
    joinedAt: 'January 2024',
    contractExpiry: 'December 2025',
    commissionRate: 15,
    territories: ['Mumbai', 'Thane', 'Navi Mumbai'],
    totalSales: '₹42.5L',
    totalLeads: 156,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Franchise Profile</h1>
          <p className="text-slate-400">Manage your franchise account and business details</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* KYC Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-emerald-400">KYC Verified</p>
            <p className="text-xs text-slate-400">Your account is fully verified and active</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Check className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-indigo-400" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Business Name</label>
                <p className="font-medium text-white">{profileData.businessName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Owner Name</label>
                <p className="font-medium text-white">{profileData.ownerName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Franchise Code</label>
                <p className="font-mono text-indigo-400">{profileData.franchiseCode}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Commission Rate</label>
                <p className="font-medium text-emerald-400">{profileData.commissionRate}%</p>
              </div>
            </div>

            <div className="h-px bg-slate-700/50" />

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email (Masked)</p>
                  <p className="text-white">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Phone (Masked)</p>
                  <p className="text-white">{profileData.phone}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-700/50" />

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Business Address</p>
                <p className="text-white">{profileData.address}</p>
                <p className="text-slate-400 text-sm">
                  {profileData.city}, {profileData.state} - {profileData.pincode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Quick Info */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <Award className="w-5 h-5 text-amber-400" />
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Sales</span>
                <span className="font-bold text-emerald-400">{profileData.totalSales}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Leads</span>
                <span className="font-bold text-white">{profileData.totalLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Territories</span>
                <span className="font-bold text-indigo-400">{profileData.territories.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contract Info */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <Calendar className="w-5 h-5 text-purple-400" />
                Contract Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Joined</span>
                <span className="text-white">{profileData.joinedAt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Expires</span>
                <span className="text-amber-400">{profileData.contractExpiry}</span>
              </div>
            </CardContent>
          </Card>

          {/* Territories */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <Building2 className="w-5 h-5 text-indigo-400" />
                My Territories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.territories.map((territory) => (
                  <Badge 
                    key={territory}
                    className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                  >
                    {territory}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Documents Section */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-indigo-400" />
            KYC Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">GST Certificate</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  Verified
                </Badge>
              </div>
              <p className="font-mono text-white">{profileData.gst}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">PAN Card</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  Verified
                </Badge>
              </div>
              <p className="font-mono text-white">{profileData.pan}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-center justify-center">
              <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 gap-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseProfile;
