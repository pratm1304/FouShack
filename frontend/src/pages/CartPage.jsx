import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [name, setName] = useState(""); 
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

    if(!name.trim()){
      toast.error("Please enter your name before placing the order!");
      return;
    }

    try {
      await axios.post("https://foushack.onrender.com/customer/order", { 
        name,
        items: cart,
        totalAmount
   });
      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/customer/");
    } catch (error) {
      console.log(error);
      toast.error("Error placing order!");
    }
  };


  return (
    <div className="container min-h-screen mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart 🛒</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
        <div className="mb-4">
            <label className="block font-semibold mb-1">Enter Your Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="input input-bordered w-full max-w-sm"
              placeholder="John Doe"
            />
          </div>
          {cart.map(item => (
            <div key={item._id} className="flex justify-between items-center bg-purple-200 p-3 mb-2 shadow-md rounded">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p>₹ {item.price} x {item.qty}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-sm" onClick={() => updateQty(item._id, 1)}>+</button>
                <button className="btn btn-sm" onClick={() => updateQty(item._id, -1)}>-</button>
                <button className="btn btn-error btn-sm" onClick={() => handleRemove(item._id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-4 font-bold">
            Total Amount: ₹ {totalAmount}
          </div>
          <button className="btn btn-success mt-4" onClick={handleOrder}>Place Order</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
