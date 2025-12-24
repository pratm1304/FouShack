import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, ShoppingBag, IndianRupee, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import API_URL from "../config/api";

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
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
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="border-b border-white/10 py-6 text-center">
        <div className="flex justify-center items-center gap-2">
          <Sparkles className="text-white/70" />
          <h1 className="text-4xl font-bold tracking-wide">Fou Shack Bakery</h1>
          <Sparkles className="text-white/70" />
        </div>
        <p className="text-gray-400 mt-2">Freshly Baked with Love</p>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto p-6 pb-40">

        {loading && (
          <p className="text-center text-gray-400 mt-20">Loading products...</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">

              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4 flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{p.content}</p>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1 text-white font-bold">
                    <IndianRupee className="size-4" />
                    {p.price}
                  </div>

                  <button
                    onClick={() => handleAddToCart(p)}
                    className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING CART */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur border border-white/10 rounded-2xl px-6 py-4">
          <button
            onClick={() => navigate("/customer/cart")}
            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200"
          >
            <ShoppingBag />
            Cart ({cart.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
