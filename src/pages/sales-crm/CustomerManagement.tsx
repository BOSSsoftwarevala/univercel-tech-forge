import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  MessageSquare,
  MoreVertical,
  Star,
  Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const customers = [
  { 
    id: 1, 
    name: "Tech Solutions Pvt Ltd", 
    contact: "Rajesh Mehta",
    email: "rajesh@techsolutions.com", 
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    totalDeals: 5,
    totalValue: "₹12,50,000",
    lastContact: "2 days ago",
    rating: 5
  },
  { 
    id: 2, 
    name: "Digital Dreams Agency", 
    contact: "Anita Sharma",
    email: "anita@digitaldreams.in", 
    phone: "+91 87654 32109",
    location: "Delhi, NCR",
    totalDeals: 3,
    totalValue: "₹8,75,000",
    lastContact: "1 week ago",
    rating: 4
  },
  { 
    id: 3, 
    name: "StartUp Hub India", 
    contact: "Karan Patel",
    email: "karan@startuphub.co", 
    phone: "+91 76543 21098",
    location: "Bangalore, Karnataka",
    totalDeals: 8,
    totalValue: "₹25,00,000",
    lastContact: "Yesterday",
    rating: 5
  },
  { 
    id: 4, 
    name: "Green Energy Corp", 
    contact: "Meera Reddy",
    email: "meera@greenenergy.com", 
    phone: "+91 65432 10987",
    location: "Hyderabad, Telangana",
    totalDeals: 2,
    totalValue: "₹4,50,000",
    lastContact: "3 days ago",
    rating: 4
  },
];

const activityHistory = [
  { type: "call", note: "Discussed new project requirements", date: "Jan 15, 2024", time: "2:30 PM" },
  { type: "email", note: "Sent proposal document v2", date: "Jan 12, 2024", time: "11:00 AM" },
  { type: "meeting", note: "Product demo completed", date: "Jan 10, 2024", time: "4:00 PM" },
  { type: "note", note: "Customer interested in premium plan", date: "Jan 8, 2024", time: "10:15 AM" },
];

const CustomerManagement = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
          <p className="text-slate-500 mt-1">Manage your customer relationships</p>
        </div>
        <Button className="gap-2 bg-blue-500 hover:bg-blue-600" size="lg">
          <Plus className="w-5 h-5" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search customers..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCustomer.id === customer.id 
                      ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500">
                      <AvatarFallback className="text-white font-medium">
                        {customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{customer.name}</p>
                      <p className="text-sm text-slate-500 truncate">{customer.contact}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: customer.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500">
                  <AvatarFallback className="text-white text-xl font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                  <p className="text-slate-500">{selectedCustomer.contact}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: selectedCustomer.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">Activity History</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium text-slate-800">{selectedCustomer.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="font-medium text-slate-800">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="font-medium text-slate-800">{selectedCustomer.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Last Contact</p>
                        <p className="font-medium text-slate-800">{selectedCustomer.lastContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-slate-200">
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-blue-600">{selectedCustomer.totalDeals}</p>
                      <p className="text-sm text-slate-500 mt-1">Total Deals</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-green-600">{selectedCustomer.totalValue}</p>
                      <p className="text-sm text-slate-500 mt-1">Total Value</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-4">
                  {activityHistory.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl bg-slate-50"
                    >
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'call' ? 'bg-green-100' :
                        activity.type === 'email' ? 'bg-blue-100' :
                        activity.type === 'meeting' ? 'bg-purple-100' : 'bg-yellow-100'
                      }`}>
                        {activity.type === 'call' && <Phone className="w-5 h-5 text-green-600" />}
                        {activity.type === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'meeting' && <Calendar className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'note' && <MessageSquare className="w-5 h-5 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{activity.note}</p>
                        <p className="text-sm text-slate-500">{activity.date} at {activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <div className="space-y-4">
                  <textarea 
                    placeholder="Add a note about this customer..."
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button className="bg-blue-500 hover:bg-blue-600">Save Note</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerManagement;
