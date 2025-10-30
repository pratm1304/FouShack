import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, IndianRupee, ArrowLeft } from "lucide-react";
import API_URL from "../config/api";

const CartPage = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [name, setName] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateQty = (id, delta) => {
    const newCart = cart.map(item => 
      item._id === id ? {...item, qty: Math.max(1, (item.qty || 1) + delta)} : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleRemove = (id) => {
    const newCart = cart.filter(item => item._id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Item removed from cart");
  };
  
  const totalAmount = cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

  const handleOrder = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name before placing the order!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const { data: order } = await axios.post(
        `${API_URL}/customer/create-razorpay-order`,
        { amount: totalAmount }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Fou Shack",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data } = await axios.post(
              `${API_URL}/customer/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                name,
                items: cart,
                totalAmount
              }
            );

            if (data.success) {
              toast.success("Payment successful! Order placed!");
              localStorage.removeItem("cart");
              setCart([]);
              setName("");
              navigate("/customer/");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed!");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: name,
        },
        theme: {
          color: "#8B5CF6"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.error("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setLoading(false);
        toast.error("Payment failed! Please try again.");
        console.error("Payment failed:", response.error);
      });

      rzp.open();

    } catch (error) {
      setLoading(false);
      console.error("Error initiating payment:", error);
      toast.error("Error initiating payment!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="container relative z-10 mx-auto p-4 md:p-6 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/customer/")}
          className="mb-6 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-semibold transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span>Continue Shopping</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3 text-white">
            <ShoppingCart className="size-8 md:size-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif">Your Cart</h1>
              <p className="text-purple-100 text-sm md:text-base">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your basket
              </p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShoppingCart className="size-10 md:size-12 text-purple-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-purple-900 mb-3">Your cart is empty!</h3>
            <p className="text-purple-600 mb-6">Add some delicious items to get started</p>
            <button 
              onClick={() => navigate("/customer/")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-8 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Name Input */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <label className="block text-purple-900 font-bold text-lg mb-3">
                👤 Your Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-3 md:py-4 border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors text-base md:text-lg"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map(item => (
                <div 
                  key={item._id} 
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Item Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg md:text-xl text-purple-900 mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-purple-600">
                          <IndianRupee className="size-4" />
                          <span className="font-semibold">{item.price}</span>
                          <span className="text-purple-400">×</span>
                          <span className="font-semibold">{item.qty || 1}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-purple-100 rounded-full p-1">
                          <button 
                            className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => updateQty(item._id, -1)}
                            disabled={item.qty <= 1}
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="font-bold text-purple-900 px-3 text-lg">
                            {item.qty || 1}
                          </span>
                          <button 
                            className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors"
                            onClick={() => updateQty(item._id, 1)}
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          className="w-10 h-10 md:w-12 md:h-12 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                          onClick={() => handleRemove(item._id)}
                        >
                          <Trash2 className="size-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-4 pt-4 border-t border-purple-100">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-600 font-medium">Item Total:</span>
                        <div className="flex items-center gap-1 text-xl font-bold text-purple-900">
                          <IndianRupee className="size-5" />
                          <span>{item.price * (item.qty || 1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl shadow-xl p-6 md:p-8">
              <div className="flex justify-between items-center text-white mb-6">
                <span className="text-xl md:text-2xl font-bold">Total Amount:</span>
                <div className="flex items-center gap-2 text-3xl md:text-4xl font-bold">
                  <IndianRupee className="size-7 md:size-9" />
                  <span>{totalAmount}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button 
                className={`w-full bg-white text-purple-600 font-bold py-4 md:py-5 px-6 rounded-full hover:bg-yellow-300 transition-all shadow-lg flex items-center justify-center gap-3 text-base md:text-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="size-6" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;