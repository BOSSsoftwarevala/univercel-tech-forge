import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Play, Wallet, Headphones, LogOut, 
  ExternalLink, Download, MessageCircle, ChevronRight,
  CheckCircle, Clock, Star, Crown, Shield, Sparkles,
  Plus, History, HelpCircle, ArrowRight, Gift, Zap,
  User, Bell, Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';

const SimpleUserDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showFAQDialog, setShowFAQDialog] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  // User data from auth or fallback
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const purchasedProducts = [
    { 
      id: '1', 
      name: 'Restaurant POS', 
      purchaseDate: '2024-01-15', 
      status: 'active',
      demoUrl: 'https://demo.softwarevala.com/restaurant-pos',
      downloadUrl: '#'
    },
    { 
      id: '2', 
      name: 'Hotel Management', 
      purchaseDate: '2024-01-10', 
      status: 'active',
      demoUrl: 'https://demo.softwarevala.com/hotel',
      downloadUrl: '#'
    },
  ];

  const demoHistory = [
    { id: '1', name: 'School ERP', viewedAt: '2024-01-20', status: 'demo' },
    { id: '2', name: 'Gym Management', viewedAt: '2024-01-18', status: 'demo' },
  ];

  const transactions = [
    { id: '1', type: 'credit', amount: 1000, date: '2024-01-20', description: 'Added via UPI' },
    { id: '2', type: 'debit', amount: 500, date: '2024-01-18', description: 'Product Purchase' },
    { id: '3', type: 'credit', amount: 2000, date: '2024-01-15', description: 'Referral Bonus' },
  ];

  const faqs = [
    { q: 'How do I download my purchased product?', a: 'Go to "My Products" tab and click the Download button next to your product.' },
    { q: 'How can I add money to my wallet?', a: 'Go to Wallet tab and click "Add Money". You can pay via UPI, Card, or Net Banking.' },
    { q: 'What is the refund policy?', a: 'We offer 7-day money-back guarantee on all purchases.' },
    { q: 'How do I contact support?', a: 'Go to Support tab and click "Start Chat" to connect with our 24/7 support team.' },
  ];

  const walletBalance = 2500;

  const tabs = [
    { id: 'products', label: 'My Products', icon: Package, count: purchasedProducts.length },
    { id: 'demos', label: 'My Demos', icon: Play, count: demoHistory.length },
    { id: 'wallet', label: 'Wallet', icon: Wallet, badge: `₹${walletBalance.toLocaleString()}` },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleAddMoney = () => {
    if (!addMoneyAmount || parseInt(addMoneyAmount) < 100) {
      toast.error('Minimum amount is ₹100');
      return;
    }
    toast.success(`₹${addMoneyAmount} will be added to your wallet`);
    setShowAddMoneyDialog(false);
    setAddMoneyAmount('');
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('Message sent! Our team will respond within 2 hours.');
    setShowChatDialog(false);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-teal/20 blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
            </div>

            <div className="relative z-10 text-center">
              {/* Crown/Star Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="mb-8"
              >
                <div className="relative mx-auto w-28 h-28">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center"
                    animate={{ 
                      boxShadow: [
                        '0 0 30px hsl(var(--primary) / 0.4)',
                        '0 0 60px hsl(var(--primary) / 0.6)',
                        '0 0 30px hsl(var(--primary) / 0.4)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-14 h-14 text-primary-foreground fill-primary-foreground" />
                  </motion.div>
                  
                  {/* Floating sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        y: [0, -20, -40]
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: 0.5 + i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      style={{
                        left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                        top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 60}%`,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-neon-teal to-primary bg-clip-text text-transparent">
                  Welcome, {userName}!
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Your dashboard is ready
                </p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30"
                >
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">Verified Member</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setShowWelcome(false)}
              className="absolute bottom-10 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Skip →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Software<span className="text-primary">Vala</span></span>
            </Link>
            
            <div className="flex items-center gap-3">
              {/* User Badge */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{userName}</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-xs">
                  Member
                </Badge>
              </div>
              
              <Button variant="ghost" size="icon" onClick={() => toast.info('Notifications coming soon!')}>
                <Bell className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-card to-neon-teal/10 border-primary/20 overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Welcome Back!</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Hello, {userName} 👋</h2>
                <p className="text-muted-foreground">Manage your products, demos, and wallet all in one place.</p>
              </div>
              <div className="hidden md:block">
                <Button onClick={() => navigate('/demos')} className="bg-primary hover:bg-primary/90">
                  Browse More Demos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{purchasedProducts.length}</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Play className="w-8 h-8 text-neon-teal mx-auto mb-2" />
              <p className="text-2xl font-bold">{demoHistory.length}</p>
              <p className="text-sm text-muted-foreground">Demos Viewed</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Wallet className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <p className="text-2xl font-bold">₹{walletBalance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Gift className="w-8 h-8 text-neon-purple mx-auto mb-2" />
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Rewards</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="secondary" className={activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : ''}>
                  {tab.count}
                </Badge>
              )}
              {tab.badge && (
                <Badge variant="secondary" className={activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-neon-green/20 text-neon-green'}>
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Purchased Products</h2>
                <Button onClick={() => navigate('/demos')} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Buy More
                </Button>
              </div>
              
              {purchasedProducts.length > 0 ? (
                <div className="grid gap-4">
                  {purchasedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-card border-border hover:border-primary/30 transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-neon-teal/20 flex items-center justify-center">
                              <Package className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">Purchased: {product.purchaseDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-neon-green/20 text-neon-green border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(product.demoUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => toast.success(`Downloading ${product.name}...`)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="text-center py-16">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                    <p className="text-muted-foreground mb-6">Start exploring our demo library to find the perfect software for your business.</p>
                    <Button onClick={() => navigate('/demos')}>
                      Browse Demos
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'demos' && (
            <motion.div
              key="demos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Demo History</h2>
                <Button onClick={() => navigate('/demos')} variant="outline">
                  Explore More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="grid gap-4">
                {demoHistory.map((demo, index) => (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-card border-border hover:border-primary/30 transition-all">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-teal/20 flex items-center justify-center">
                            <Play className="w-7 h-7 text-neon-purple" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{demo.name}</h3>
                            <p className="text-sm text-muted-foreground">Viewed: {demo.viewedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Demo
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/demo/${demo.id}`)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Demo
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/checkout/${demo.id}`)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold mb-6">My Wallet</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <Card className="bg-gradient-to-br from-primary/20 via-card to-neon-teal/20 border-primary/30">
                  <CardContent className="p-8 text-center">
                    <Wallet className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                    <p className="text-5xl font-bold text-primary mb-6">₹{walletBalance.toLocaleString()}</p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => setShowAddMoneyDialog(true)} className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Money
                      </Button>
                      <Button variant="outline" onClick={() => setShowTransactionDialog(true)}>
                        <History className="w-4 h-4 mr-2" />
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Wallet Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Your wallet is secure and view-only.</p>
                      <p className="text-xs text-muted-foreground mt-1">Contact support for any wallet queries.</p>
                    </div>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Referral program coming soon!')}>
                      <Gift className="w-4 h-4 mr-3" />
                      Refer & Earn ₹500
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold mb-6">Support</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Card */}
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <Headphones className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
                    <p className="text-muted-foreground mb-6">Our support team is here to help you 24/7.</p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => setShowChatDialog(true)} className="bg-primary hover:bg-primary/90">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                      <Button variant="outline" onClick={() => setShowFAQDialog(true)}>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        View FAQs
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">support@softwarevala.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <Headphones className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">+91 1800-XXX-XXXX</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Response Time</p>
                        <p className="font-medium">Within 2 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>Enter the amount you want to add. Minimum ₹100.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[500, 1000, 2000, 5000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAddMoneyAmount(amount.toString())}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMoneyDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMoney}>Proceed to Pay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction History Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-neon-green/20' : 'bg-destructive/20'}`}>
                    {tx.type === 'credit' ? (
                      <Plus className="w-5 h-5 text-neon-green" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-destructive rotate-45" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${tx.type === 'credit' ? 'text-neon-green' : 'text-destructive'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a Conversation</DialogTitle>
            <DialogDescription>Our support team typically responds within 2 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChatDialog(false)}>Cancel</Button>
            <Button onClick={handleSendChat}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={showFAQDialog} onOpenChange={setShowFAQDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50">
                <p className="font-medium mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleUserDashboard;