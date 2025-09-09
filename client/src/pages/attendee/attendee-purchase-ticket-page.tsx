import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { CheckCircle, CreditCard, ArrowLeft, Shield, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

const AttendeePurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseASuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/dashboard/tickets");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess, navigate]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseASuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Success state with enhanced animations
  if (isPurchaseSuccess) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center animate-bounce-in">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-2xl">
            <div className="space-y-6">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-scale-in" />
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-green-600 animate-fade-in-up">
                  Payment Successful!
                </h2>
                <p className="text-gray-700 text-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  Your ticket has been purchased successfully.
                </p>
                <div className="mt-4 p-3 bg-green-100 rounded-lg animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <p className="text-green-700 text-sm font-medium">
                    🎫 Check your tickets in "My Tickets"
                  </p>
                </div>
                <p className="text-gray-500 text-sm animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                  Redirecting to your tickets in a few seconds...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header with back button */}
      <div className="container mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Complete Payment
            </h1>
            <p className="text-gray-400">Secure checkout for your event ticket</p>
          </div>

          {/* Payment Form */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl animate-slide-up">
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
              <Shield className="w-4 h-4 text-green-400" />
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Secure Payment</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg animate-shake">
                <div className="text-red-300 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Credit Card Number */}
              <div className="space-y-2">
                <Label className="text-gray-300 font-medium">Credit Card Number</Label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className="bg-gray-800/50 border-gray-600 text-white pl-12 pr-4 py-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    disabled={isProcessing}
                  />
                  <CreditCard className="absolute h-5 w-5 text-gray-400 group-focus-within:text-purple-400 top-3.5 left-4 transition-colors duration-200" />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label className="text-gray-300 font-medium">Cardholder Name</Label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="John Smith"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white pl-4 pr-4 py-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Purchase Button */}
              <div className="pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={handlePurchase}
                  disabled={isProcessing || !cardNumber.trim() || !cardholderName.trim()}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Purchase Ticket
                    </div>
                  )}
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="text-center pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                  <span className="text-yellow-400 text-xs">⚠️</span>
                  <span className="text-yellow-300 text-xs font-medium">
                    Demo Mode - No real payment required
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Security Info */}
          <div className="mt-6 text-center animate-fade-in-delayed">
            <p className="text-gray-500 text-sm">
              Your payment information is protected by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-bounce-in {
          animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-fade-in-delayed {
          animation: fadeIn 0.8s ease-out 1s both;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AttendeePurchaseTicketPage;
