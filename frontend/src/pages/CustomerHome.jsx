import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router";
import API_URL from "../config/api";

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/customer/`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const existing = cart.find(p => p._id === product._id);
    const newCart = existing
      ? cart.map(p => p._id === product._id ? { ...p, qty: (p.qty || 1) + 1 } : p)
      : [...cart, { ...product, qty: 1 }];

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Title - Center on mobile, Left on laptop */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                FOU SHACK
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                100% Veg & Freshly Baked
              </p>
            </div>

            {/* Cart Button - Desktop */}
            {cart.length > 0 && (
              <button
                onClick={() => navigate("/customer/cart")}
                className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                <ShoppingBag className="size-4" />
                <span>{cart.length} items</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32 sm:pb-8">

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {products.map(p => (
            <div 
              key={p._id} 
              className="group bg-gradient-to-b from-white/5 to-transparent border border-white/5 rounded-xl sm:rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-32 sm:h-40 lg:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <h3 className="text-sm sm:text-base font-semibold line-clamp-1">{p.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">{p.content}</p>

                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <div className="flex items-center text-white font-bold text-sm sm:text-base">
                    <IndianRupee className="size-3 sm:size-4" />
                    <span>{p.price}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(p)}
                    className="bg-white text-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-200 active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FLOATING CART - Mobile Only */}
      {cart.length > 0 && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50">
          <button
            onClick={() => navigate("/customer/cart")}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-full font-semibold shadow-2xl shadow-white/10 active:scale-[0.98] transition-transform"
          >
            <ShoppingBag className="size-5" />
            View Cart ({cart.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;