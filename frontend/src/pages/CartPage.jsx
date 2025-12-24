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

  // Validate form
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
    // Step 1: Create Razorpay order - CORRECT ROUTE
    const { data: order } = await axios.post(`${API_URL}/admin/create-razorpay-order`, {
      amount: totalAmount
    });

    // Step 2: Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "FousHack",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        try {
          // Step 3: Verify payment - CORRECT ROUTE
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
          console.error(error);
        }
      },
      prefill: {
        name: name,
        contact: mobileNumber
      },
      theme: {
        color: "#000000"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again.");
      console.error(response.error);
    });
    rzp.open();

  } catch (error) {
    toast.error("Failed to initiate payment");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 mb-6">
        <ArrowLeft /> Continue Shopping
      </button>

      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Customer Details Section */}
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="size-5" /> Customer Details
        </h2>
        
        {/* Name */}
        <input
          placeholder="Your Full Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 mb-3 text-white placeholder-gray-500"
        />
        
        {/* Mobile Number */}
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            type="tel"
            placeholder="Mobile Number *"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full bg-neutral-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="size-5" /> Delivery Address
        </h2>
        
        {/* Street Address */}
        <textarea
          placeholder="Street Address / House No. / Building *"
          value={address.street}
          onChange={(e) => handleAddressChange('street', e.target.value)}
          rows={2}
          className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 mb-3 text-white placeholder-gray-500 resize-none"
        />
        
        {/* City & State */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            placeholder="City *"
            value={address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500"
          />
          <input
            placeholder="State *"
            value={address.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500"
          />
        </div>
        
        {/* Pincode */}
        <input
          placeholder="Pincode *"
          value={address.pincode}
          onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500"
        />
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Cart Items ({cart.length})</h2>
        {cart.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Your cart is empty</p>
        ) : (
          cart.map(item => (
            <div key={item._id} className="bg-neutral-900 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{item.title}</h3>
                <button onClick={() => handleRemove(item._id)}>
                  <Trash2 className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQty(item._id, -1)}
                    className="bg-neutral-800 p-1 rounded-lg hover:bg-neutral-700"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item._id, 1)}
                    className="bg-neutral-800 p-1 rounded-lg hover:bg-neutral-700"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 font-bold">
                  <IndianRupee className="size-4" />
                  {item.price * item.qty}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total & Payment */}
      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total</h2>
        <div className="flex items-center gap-1 text-xl font-bold">
          <IndianRupee className="size-5" />
          {totalAmount}
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={loading || cart.length === 0}
        className="w-full mt-6 bg-white text-black py-4 rounded-full font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="animate-pulse">Processing...</span>
        ) : (
          <>
            <CreditCard />
            Proceed to Payment
          </>
        )}
      </button>
    </div>
  );
};

export default CartPage;