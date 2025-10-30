import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
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
  };
  
  const totalAmount = cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

  const handleOrder = async () => {
    // Validation
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
      // Step 1: Create Razorpay Order
      const { data: order } = await axios.post(
        `${API_URL}/customer/create-razorpay-order`,
        { amount: totalAmount }
      );

      // Step 2: Open Razorpay Payment Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: order.amount,
        currency: "INR",
        name: "Fou Shack",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Verify Payment on Backend
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
          color: "#8B5CF6" // Purple color
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
    <div className="container min-h-screen mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart 🛒</h1>
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty!</p>
          <button 
            onClick={() => navigate("/customer/")}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Name Input */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Enter Your Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="input input-bordered w-full max-w-md"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Cart Items */}
          {cart.map(item => (
            <div key={item._id} className="flex justify-between items-center bg-purple-200 p-3 mb-2 shadow-md rounded">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p>₹ {item.price} x {item.qty || 1}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="btn btn-sm" 
                  onClick={() => updateQty(item._id, -1)}
                  disabled={item.qty <= 1}
                >
                  -
                </button>
                <span className="font-bold px-2">{item.qty || 1}</span>
                <button 
                  className="btn btn-sm" 
                  onClick={() => updateQty(item._id, 1)}
                >
                  +
                </button>
                <button 
                  className="btn btn-error btn-sm" 
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Amount */}
          <div className="bg-purple-300 p-4 rounded-lg mt-4 mb-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Amount:</span>
              <span>₹ {totalAmount}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button 
            className={`btn btn-success btn-lg w-full ${loading ? 'loading' : ''}`}
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? 'Processing...' : '💳 Proceed to Payment'}
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;