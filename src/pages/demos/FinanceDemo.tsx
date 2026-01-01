import { useState } from "react";
import { CreditCard, TrendingUp, Calculator, FileText, Users, IndianRupee, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const loans = [
  { id: 1, name: "Rahul Sharma", amount: "₹5,00,000", emi: "₹12,500", status: "Active", due: "15 Jan" },
  { id: 2, name: "Priya Patel", amount: "₹3,50,000", emi: "₹8,750", status: "Active", due: "20 Jan" },
  { id: 3, name: "Amit Kumar", amount: "₹8,00,000", emi: "₹20,000", status: "Overdue", due: "10 Jan" },
  { id: 4, name: "Sneha Gupta", amount: "₹2,00,000", emi: "₹5,000", status: "Closed", due: "-" },
];

export default function FinanceDemo() {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [tenure, setTenure] = useState("12");

  const emi = Math.round(parseInt(loanAmount) / parseInt(tenure) * 1.1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-violet-400" />
            <span className="text-xl font-bold text-white">FinanceHub</span>
            <Badge variant="outline" className="ml-2 text-violet-400 border-violet-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-violet-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-violet-400 cursor-pointer">Loans</span>
            <span className="hover:text-violet-400 cursor-pointer">Payments</span>
            <span className="hover:text-violet-400 cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Portfolio</p>
                  <p className="text-2xl font-bold text-white">₹45.2 Cr</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2 flex items-center"><ArrowUpRight className="h-4 w-4" /> +12.5%</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Loans</p>
                  <p className="text-2xl font-bold text-white">234</p>
                </div>
                <FileText className="h-8 w-8 text-violet-400" />
              </div>
              <p className="text-violet-400 text-sm mt-2">₹18.5 Cr disbursed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Collections</p>
                  <p className="text-2xl font-bold text-white">₹2.8 Cr</p>
                </div>
                <IndianRupee className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">This month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Overdue</p>
                  <p className="text-2xl font-bold text-white">₹45L</p>
                </div>
                <PieChart className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-400 text-sm mt-2 flex items-center"><ArrowDownRight className="h-4 w-4" /> 12 accounts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Recent Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.map(loan => (
                  <div key={loan.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{loan.name}</p>
                      <p className="text-white/60 text-sm">EMI: {loan.emi}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-violet-400 font-semibold">{loan.amount}</p>
                      <Badge className={
                        loan.status === "Active" ? "bg-green-600" :
                        loan.status === "Overdue" ? "bg-red-600" : "bg-gray-600"
                      }>{loan.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5" /> EMI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white/70 text-sm">Loan Amount (₹)</label>
                <Input value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="bg-white/10 border-white/20 text-white" />
              </div>
              <div>
                <label className="text-white/70 text-sm">Tenure (months)</label>
                <Input value={tenure} onChange={e => setTenure(e.target.value)} className="bg-white/10 border-white/20 text-white" />
              </div>
              <div className="p-4 bg-violet-600/20 rounded-lg text-center">
                <p className="text-white/70 text-sm">Monthly EMI</p>
                <p className="text-3xl font-bold text-violet-400">₹{emi.toLocaleString()}</p>
              </div>
              <Button className="w-full bg-violet-600 hover:bg-violet-700">Apply for Loan</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
