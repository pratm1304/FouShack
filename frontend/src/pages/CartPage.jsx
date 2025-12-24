import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2, CreditCard, IndianRupee, ArrowLeft, MapPin, Phone, User } from "lucide-react";
import API_URL from "../config/api";

const CartPage = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateQty = (id, delta) => {
    const newCart = cart.map(item =>
      item._id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleRemove = (id) => {
    const newCart = cart.filter(item => item._id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Item removed");
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const totalAmount = cart.reduce((acc, i) => acc + i.price * (i.qty || 1), 0);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return false;
    }
    if (!address.street.trim()) {
      toast.error("Please enter street address");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("Please enter city");
      return false;
    }
    if (!address.state.trim()) {
      toast.error("Please enter state");
      return false;
    }
    if (!address.pincode.trim() || address.pincode.length < 6) {
      toast.error("Please enter valid pincode");
      return false;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    if (typeof window.Razorpay === 'undefined') {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }
    
    setLoading(true);
    try {
      const { data: order } = await axios.post(`${API_URL}/admin/create-razorpay-order`, {
        amount: totalAmount
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "FousHack",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data } = await axios.post(`${API_URL}/admin/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name,
              mobileNumber,
              address,
              items: cart,
              totalAmount
            });

            if (data.success) {
              toast.success("Payment successful! Order placed.");
              localStorage.removeItem("cart");
              setCart([]);
              navigate("/");
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name, contact: mobileNumber },
        theme: { color: "#000000" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed. Please try again."));
      rzp.open();

    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-32 lg:pb-8">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Checkout</h1>

          {/* Main Grid - Side by side on large screens */}
          <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
            
            {/* Left Column - Forms */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Customer Details */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 sm:p-4">
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-300">
                  <User className="size-4" /> Customer Details
                </h2>
                
                <div className="space-y-2.5">
                  <input
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                  
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="Mobile Number *"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 sm:p-4">
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-300">
                  <MapPin className="size-4" /> Delivery Address
                </h2>
                
                <div className="space-y-2.5">
                  <textarea
                    placeholder="Street Address / House No. *"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      placeholder="City *"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder="State *"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  
                  <input
                    placeholder="Pincode *"
                    value={address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`${inputClass} sm:w-1/2`}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Cart Items & Payment */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Cart Items */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 sm:p-4">
                <h2 className="text-sm font-semibold mb-3 text-gray-300">
                  Cart ({cart.length})
                </h2>
                
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Your cart is empty</p>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div 
                        key={item._id} 
                        className="flex items-center justify-between gap-3 bg-white/5 rounded-lg p-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{item.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <IndianRupee className="size-3" />
                            <span>{item.price} × {item.qty}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => updateQty(item._id, -1)}
                            className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-5 text-center text-sm">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item._id, 1)}
                            className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                          >
                            <Plus className="size-3" />
                          </button>
                          <button 
                            onClick={() => handleRemove(item._id)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors ml-1"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total & Payment - Desktop */}
              <div className="hidden lg:block bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total</span>
                  <div className="flex items-center gap-1 text-xl font-bold">
                    <IndianRupee className="size-5" />
                    <span>{totalAmount}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={loading || cart.length === 0}
                  className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <CreditCard className="size-4" />
                      Pay Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom - Mobile Payment */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Total Amount</span>
          <div className="flex items-center gap-1 text-lg font-bold">
            <IndianRupee className="size-4" />
            <span>{totalAmount}</span>
          </div>
        </div>
        
        <button 
          onClick={handlePayment}
          disabled={loading || cart.length === 0}
          className="w-full bg-white text-black py-3 rounded-full font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <CreditCard className="size-4" />
              Pay Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartPage;