import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { FIXED_PRICE, FIXED_CURRENCY } from '@/lib/payment/fixed-price-validator';
import { initiatePayment, type PaymentGateway } from '@/lib/payment/payment-gateway-handler';

const SimpleCheckout = () => {
  const { demoId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'India',
  });
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fixed price — $249 USD for all products
  const product = {
    id: demoId,
    name: 'Software License',
    price: FIXED_PRICE,
    currency: FIXED_CURRENCY,
  };

  const countries = [
    'India', 'UAE', 'Saudi Arabia', 'Kenya', 'Nigeria', 'South Africa', 
    'Egypt', 'Singapore', 'Malaysia', 'Indonesia', 'United States', 'United Kingdom'
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill all fields');
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    const result = await initiatePayment({
      productId: product.id || 'unknown',
      productName: product.name,
      customerName: formData.name,
      customerEmail: formData.email,
      gateway: selectedGateway,
    });

    if (!result.success) {
      toast.error(result.error || 'Payment initiation failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    toast.success('Order created! Redirecting to payment...');

    if (result.redirectUrl) {
      window.location.href = result.redirectUrl;
    } else {
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={`/demo/${demoId}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Demo</span>
            </Link>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 max-w-xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-cyan-400' : 'text-slate-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-cyan-500 text-white' : 'bg-slate-800'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-sm font-medium">Your Details</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-800">
            <div className={`h-full bg-cyan-500 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-cyan-400' : 'text-slate-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-cyan-500 text-white' : 'bg-slate-800'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        {/* Step 1: User Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6">Your Details</h2>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-500 transition-all mt-6"
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400">{product.name}</span>
                <span className="font-bold">${product.price} {product.currency}</span>
              </div>
              <div className="flex items-center justify-between py-3 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-cyan-400">${product.price} {product.currency}</span>
              </div>
            </div>

            {/* Gateway Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="grid grid-cols-3 gap-3">
                {(['stripe', 'flutterwave', 'payu'] as PaymentGateway[]).map((gw) => (
                  <button
                    key={gw}
                    onClick={() => setSelectedGateway(gw)}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all capitalize ${
                      selectedGateway === gw
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {gw}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <p className="text-slate-400 text-sm mb-6">
                Complete your purchase securely. Your account will be automatically created after payment.
              </p>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-lg font-bold hover:from-emerald-400 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay Now — ${product.price} {product.currency}
                  </>
                )}
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Details
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SimpleCheckout;