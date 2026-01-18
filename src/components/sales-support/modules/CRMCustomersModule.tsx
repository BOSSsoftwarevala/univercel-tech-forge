import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Edit, Eye, Ticket, History, Star, DollarSign, Phone, Mail, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Customer {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  totalPurchases: number;
  ticketCount: number;
  supportScore: number;
  status: "active" | "churned" | "at_risk";
  lastContact: string;
  industry: string;
}

const CRMCustomersModule = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "CUS-001", company: "Tech Solutions Ltd", contact: "John Davidson", email: "john@techsol.com", phone: "+1 555-0101", totalPurchases: 125000, ticketCount: 8, supportScore: 92, status: "active", lastContact: "2 days ago", industry: "Technology" },
    { id: "CUS-002", company: "Healthcare Plus", contact: "Maria Santos", email: "maria@hcplus.com", phone: "+1 555-0102", totalPurchases: 89000, ticketCount: 3, supportScore: 98, status: "active", lastContact: "1 week ago", industry: "Healthcare" },
    { id: "CUS-003", company: "Retail Mart", contact: "Lisa Patterson", email: "lisa@retailmart.com", phone: "+1 555-0103", totalPurchases: 45000, ticketCount: 12, supportScore: 65, status: "at_risk", lastContact: "3 weeks ago", industry: "Retail" },
    { id: "CUS-004", company: "EduLearn Academy", contact: "Robert Kim", email: "robert@edulearn.com", phone: "+1 555-0104", totalPurchases: 67000, ticketCount: 5, supportScore: 85, status: "active", lastContact: "5 days ago", industry: "Education" },
    { id: "CUS-005", company: "Global Logistics", contact: "James Turner", email: "james@globallog.com", phone: "+1 555-0105", totalPurchases: 23000, ticketCount: 18, supportScore: 42, status: "churned", lastContact: "2 months ago", industry: "Logistics" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleEditProfile = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setEditDrawerOpen(true);
    }
  };

  const handleViewHistory = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setHistoryDrawerOpen(true);
    }
  };

  const handleSaveProfile = () => {
    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.id === selectedCustomer.id ? selectedCustomer : c
      ));
      toast.success("Profile updated", { description: `${selectedCustomer.company} saved successfully` });
      setEditDrawerOpen(false);
    }
  };

  const handleRaiseTicket = (customerId: string) => {
    toast.loading("Creating support ticket...", { id: `ticket-${customerId}` });
    setTimeout(() => {
      toast.success("Support ticket created", { id: `ticket-${customerId}`, description: "TKT-NEW assigned to queue" });
    }, 600);
  };

  const handleCall = (customerId: string, phone: string) => {
    window.open(`tel:${phone}`, '_self');
    toast.info(`Initiating call to ${phone}`, { description: "Call center connecting..." });
  };

  const handleEmail = (customerId: string, email: string) => {
    window.open(`mailto:${email}`, '_blank');
    toast.info(`Opening email composer for ${email}`, { description: "Email client opened" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-300";
      case "at_risk": return "bg-amber-500/20 text-amber-300";
      case "churned": return "bg-red-500/20 text-red-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const filteredCustomers = customers.filter(c => 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const atRiskCount = customers.filter(c => c.status === "at_risk").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">CRM / Customer Management</h2>
          <p className="text-slate-400">Full customer profiles with history and support scores</p>
        </div>
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 bg-slate-800/50 border-slate-600"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{customers.length}</div>
            <div className="text-xs text-slate-400">Total Customers</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{activeCustomers}</div>
            <div className="text-xs text-slate-400">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">${(totalRevenue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-slate-400">Total Revenue</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <History className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{atRiskCount}</div>
            <div className="text-xs text-slate-400">At Risk</div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-cyan-500/20 text-cyan-300 text-lg">{customer.company.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 text-sm">{customer.id}</span>
                        <span className="font-medium text-slate-100">{customer.company}</span>
                        <Badge className={getStatusColor(customer.status)}>{customer.status.replace('_', ' ')}</Badge>
                        <Badge variant="outline" className="text-slate-400">{customer.industry}</Badge>
                      </div>
                      <p className="text-sm text-slate-400">{customer.contact} • {customer.email} • {customer.phone}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span>Purchases: ${customer.totalPurchases.toLocaleString()}</span>
                        <span>Tickets: {customer.ticketCount}</span>
                        <span className={getScoreColor(customer.supportScore)}>Score: {customer.supportScore}%</span>
                        <span>Last: {customer.lastContact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleCall(customer.id, customer.phone)} className="text-cyan-400">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEmail(customer.id, customer.email)} className="text-cyan-400">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditProfile(customer.id)} className="border-slate-600 text-slate-300">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewHistory(customer.id)} className="border-cyan-500/30 text-cyan-300">
                      <Eye className="w-3 h-3 mr-1" />
                      History
                    </Button>
                    <Button size="sm" onClick={() => handleRaiseTicket(customer.id)} className="bg-amber-500 hover:bg-amber-600">
                      <Ticket className="w-3 h-3 mr-1" />
                      Ticket
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Drawer */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent className="bg-slate-900 border-slate-700">
          <SheetHeader>
            <SheetTitle className="text-cyan-100">Edit Customer Profile</SheetTitle>
            <SheetDescription className="text-slate-400">
              Update customer information for {selectedCustomer?.company}
            </SheetDescription>
          </SheetHeader>
          {selectedCustomer && (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Company Name</Label>
                <Input 
                  value={selectedCustomer.company}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, company: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Contact Person</Label>
                <Input 
                  value={selectedCustomer.contact}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, contact: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input 
                  value={selectedCustomer.email}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, email: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Phone</Label>
                <Input 
                  value={selectedCustomer.phone}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveProfile} className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditDrawerOpen(false)} className="border-slate-600">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* History Drawer */}
      <Sheet open={historyDrawerOpen} onOpenChange={setHistoryDrawerOpen}>
        <SheetContent className="bg-slate-900 border-slate-700">
          <SheetHeader>
            <SheetTitle className="text-cyan-100">Customer History</SheetTitle>
            <SheetDescription className="text-slate-400">
              Purchase and ticket history for {selectedCustomer?.company}
            </SheetDescription>
          </SheetHeader>
          {selectedCustomer && (
            <ScrollArea className="h-[calc(100vh-150px)] mt-6">
              <div className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <h4 className="text-cyan-300 font-medium mb-2">Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-slate-400">Total Purchases:</div>
                      <div className="text-slate-100">${selectedCustomer.totalPurchases.toLocaleString()}</div>
                      <div className="text-slate-400">Support Tickets:</div>
                      <div className="text-slate-100">{selectedCustomer.ticketCount}</div>
                      <div className="text-slate-400">Support Score:</div>
                      <div className="text-slate-100">{selectedCustomer.supportScore}%</div>
                      <div className="text-slate-400">Last Contact:</div>
                      <div className="text-slate-100">{selectedCustomer.lastContact}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <h4 className="text-cyan-300 font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm text-slate-400">
                      <p>• Last purchase: 2 weeks ago</p>
                      <p>• Support ticket opened: {selectedCustomer.lastContact}</p>
                      <p>• Contract renewed: 3 months ago</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CRMCustomersModule;
