/**
 * Transport Module
 * Manage buses, routes, and tracking
 */
import { 
  Bus, Plus, MapPin, Users, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSchoolData } from "@/hooks/useSchoolData";
import { toast } from "sonner";

export const TransportModule = () => {
  const { transportRoutes, stats } = useSchoolData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bus className="w-7 h-7 text-amber-500" />
            Transport Management
          </h2>
          <p className="text-slate-400">Manage routes, vehicles, and student mapping</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Add route')}>
          <Plus className="w-4 h-4 mr-2" /> Add Route
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Routes", value: stats.totalRoutes.toString(), icon: MapPin, color: "bg-blue-500" },
          { label: "Active Buses", value: stats.totalRoutes.toString(), icon: Bus, color: "bg-green-500" },
          { label: "Students Using", value: "0", icon: Users, color: "bg-purple-500" },
          { label: "On Time %", value: "95%", icon: Clock, color: "bg-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Routes List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Active Routes</CardTitle>
        </CardHeader>
        <CardContent>
          {transportRoutes.length === 0 ? (
            <div className="text-center py-12">
              <Bus className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No routes configured yet</p>
              <Button className="mt-4 bg-amber-500" onClick={() => toast.info('Add route')}>
                <Plus className="w-4 h-4 mr-2" /> Add First Route
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transportRoutes.map((route, idx) => (
                <div 
                  key={route.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                      <Bus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{route.route_name}</p>
                      <p className="text-sm text-slate-400">
                        Vehicle: {route.vehicle_number || 'N/A'} • Driver: {route.driver_name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Badge className={route.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {route.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
