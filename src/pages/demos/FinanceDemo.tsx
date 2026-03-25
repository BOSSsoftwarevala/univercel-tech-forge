import { useState } from "react";
import { CreditCard, TrendingUp, Calculator, FileText, Users, IndianRupee, PieChart, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Loan { id: number; name: string; amount: number; emi: number; status: string; due: string; }

const initialLoans: Loan[] = [
  { id: 1, name: "Rahul Sharma", amount: 500000, emi: 12500, status: "Active", due: "15 Jan" },
  { id: 2, name: "Priya Patel", amount: 350000, emi: 8750, status: "Active", due: "20 Jan" },
  { id: 3, name: "Amit Kumar", amount: 800000, emi: 20000, status: "Overdue", due: "10 Jan" },
  { id: 4, name: "Sneha Gupta", amount: 200000, emi: 5000, status: "Closed", due: "-" },
];

export default function FinanceDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [loanAmount, setLoanAmount] = useState("500000");
  const [tenure, setTenure] = useState("12");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [newLoan, setNewLoan] = useState({ name: "", amount: "", tenure: "12" });
  const [stats, setStats] = useState({ portfolio: 4520000000, activeLoans: 234, collections: 28000000, overdue: 4500000 });

  const emi = Math.round(parseInt(loanAmount || "0") / parseInt(tenure || "1") * 1.1);

  const addLoan = () => {
    if (!newLoan.name || !newLoan.amount) { toast.error("Fill all fields"); return; }
    const amount = parseInt(newLoan.amount);
    const loan: Loan = { id: loans.length + 1, name: newLoan.name, amount, emi: Math.round(amount / parseInt(newLoan.tenure) * 1.1), status: "Active", due: "30 days" };
    setLoans([loan, ...loans]);
    setStats({ ...stats, activeLoans: stats.activeLoans + 1, portfolio: stats.portfolio + amount });
    setShowLoanModal(false);
    setNewLoan({ name: "", amount: "", tenure: "12" });
    toast.success(`Loan approved for ${loan.name}!`);
  };

  const updateLoanStatus = (loanId: number, newStatus: string) => {
    setLoans(loans.map(l => {
      if (l.id === loanId) {
        if (newStatus === "Closed" && l.status !== "Closed") setStats({ ...stats, collections: stats.collections + l.amount });
        toast.success(`Loan status updated to ${newStatus}`);
        return { ...l, status: newStatus };
      }
      return l;
    }));
  };

  const applyForLoan = () => {
    toast.success(`Loan application submitted for ₹${parseInt(loanAmount).toLocaleString()}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-violet-400" />
            <span className="text-xl font-bold text-white">FinanceHub</span>
            <Badge variant="outline" className="ml-2 text-violet-400 border-violet-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Loans", "Payments", "Reports"].map(tab => (
              <Button key={tab} variant={activeTab === tab ? "default" : "ghost"} className={activeTab === tab ? "bg-violet-600 hover:bg-violet-700" : "text-white/80 hover:text-violet-400 hover:bg-white/10"} onClick={() => { setActiveTab(tab); toast.info(`Viewing ${tab}`); }}>{tab}</Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{activeTab}</h1>
          <Button onClick={() => setShowLoanModal(true)} className="bg-violet-600 hover:bg-violet-700"><Plus className="h-4 w-4 mr-2" /> New Loan</Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Total Portfolio</p><p className="text-2xl font-bold text-white">₹{(stats.portfolio / 10000000).toFixed(1)} Cr</p></div><TrendingUp className="h-8 w-8 text-green-400" /></div><p className="text-green-400 text-sm mt-2 flex items-center"><ArrowUpRight className="h-4 w-4" /> +12.5%</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Active Loans</p><p className="text-2xl font-bold text-white">{stats.activeLoans}</p></div><FileText className="h-8 w-8 text-violet-400" /></div><p className="text-violet-400 text-sm mt-2">₹18.5 Cr disbursed</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Collections</p><p className="text-2xl font-bold text-white">₹{(stats.collections / 10000000).toFixed(1)} Cr</p></div><IndianRupee className="h-8 w-8 text-emerald-400" /></div><p className="text-emerald-400 text-sm mt-2">This month</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Overdue</p><p className="text-2xl font-bold text-white">₹{(stats.overdue / 100000).toFixed(0)}L</p></div><PieChart className="h-8 w-8 text-red-400" /></div><p className="text-red-400 text-sm mt-2 flex items-center"><ArrowDownRight className="h-4 w-4" /> 12 accounts</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader><CardTitle className="text-white">Recent Loans</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.map(loan => (
                  <div key={loan.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div><p className="text-white font-medium">{loan.name}</p><p className="text-white/60 text-sm">EMI: ₹{loan.emi.toLocaleString()}</p></div>
                    <div className="flex items-center gap-2">
                      <p className="text-violet-400 font-semibold">₹{(loan.amount / 100000).toFixed(1)}L</p>
                      <Select value={loan.status} onValueChange={(v) => updateLoanStatus(loan.id, v)}>
                        <SelectTrigger className={`w-24 h-7 text-xs ${loan.status === "Active" ? "bg-green-600 border-green-600" : loan.status === "Overdue" ? "bg-red-600 border-red-600" : "bg-gray-600 border-gray-600"} text-white`}><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-white/20"><SelectItem value="Active">Active</SelectItem><SelectItem value="Overdue">Overdue</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Calculator className="h-5 w-5" /> EMI Calculator</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-white/70 text-sm">Loan Amount (₹)</label><Input value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="bg-white/10 border-white/20 text-white" /></div>
              <div><label className="text-white/70 text-sm">Tenure (months)</label><Input value={tenure} onChange={e => setTenure(e.target.value)} className="bg-white/10 border-white/20 text-white" /></div>
              <div className="p-4 bg-violet-600/20 rounded-lg text-center"><p className="text-white/70 text-sm">Monthly EMI</p><p className="text-3xl font-bold text-violet-400">₹{emi.toLocaleString()}</p></div>
              <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={applyForLoan}>Apply for Loan</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showLoanModal} onOpenChange={setShowLoanModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader><DialogTitle>Create New Loan</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Borrower Name</Label><Input placeholder="Enter name" value={newLoan.name} onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" /></div>
            <div><Label>Loan Amount (₹)</Label><Input type="number" placeholder="e.g., 500000" value={newLoan.amount} onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" /></div>
            <div><Label>Tenure (months)</Label><Select value={newLoan.tenure} onValueChange={(v) => setNewLoan({ ...newLoan, tenure: v })}><SelectTrigger className="bg-white/10 border-white/20 text-white mt-1"><SelectValue /></SelectTrigger><SelectContent className="bg-zinc-800 border-white/20">{["6", "12", "24", "36", "48", "60"].map(t => <SelectItem key={t} value={t}>{t} months</SelectItem>)}</SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowLoanModal(false)} className="border-white/20 text-white">Cancel</Button><Button onClick={addLoan} className="bg-violet-600 hover:bg-violet-700">Approve Loan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60"><p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p></footer>
    </div>
  );
}
