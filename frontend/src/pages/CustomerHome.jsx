import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://foushack.onrender.com/")
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
  }, []);

  const handleAddToCart = (product) => {
    const existing = cart.find(p => p._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(p => 
        p._id === product._id ? {...p, qty: (p.qty || 1) + 1} : p
      );
    } else {
      newCart = [...cart, {...product, qty: 1}];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="container bg-purple-200 min-h-screen Cmx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-6">Welcome to Fou Shack </h1>
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p._id} className="card bg-base-100 shadow-md p-3">
            <img src={`https://foushack.onrender.com/${p.imageUrl}`} alt={p.title} className="w-full rounded-md h-48 object-cover"/>
            <h3 className="text-lg text-center font-semibold">{p.title}</h3>
            <p className="text-gray-600 text-center">{p.content}</p>
            <p className="font-bold mt-2 text-center">₹ {p.price}</p>
            <button
              onClick={() => handleAddToCart(p)}
              className="btn btn-secondary mt-3 flex items-center gap-2"
            >
              <ShoppingCart className="size-4" /> 
              {cart.find(item => item._id === p._id)?.qty 
                ? `Added (${cart.find(item => item._id === p._id).qty})` 
                : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 p-4 bg-white shadow-md rounded-lg w-64">
          <p className="font-bold">Total Items: {cart.reduce((acc, item) => acc + (item.qty || 1), 0)}</p>
          <p className="font-bold">Total Amount: ₹ {cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)}</p>
          <button 
            onClick={() => navigate("/cart")} 
            className="btn btn-success mt-2 w-full"
          >
            Go to Cart / Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
