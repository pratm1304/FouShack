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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const existing = cart.find(p => p._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(p =>
        p._id === product._id ? { ...p, qty: (p.qty || 1) + 1 } : p
      );
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const toggleProductExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-pink-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      {/* Hero Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 py-2 rounded-b-xl mb-3 md:py-6 px-4 shadow-xl">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
            <Sparkles className="size-6 md:size-8 text-yellow-300 animate-pulse" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg font-serif">
              Fou Shack Bakery
            </h1>
            <Sparkles className="size-6 md:size-8 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-purple-100 text-base md:text-lg font-medium">Freshly Baked with Love ✨</p>
        </div>
      </div>

      <div className="container relative z-10 mx-auto p-4 min-h-screen pb-48 md:pb-56">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-pink-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="mt-6 text-purple-700 font-semibold text-lg animate-pulse">
              Loading delicious products...
            </p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 animate-fadeIn">
            {products.map(p => (
              <div
                key={p._id}
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white"
              >
                {/* Desktop/Tablet Layout - Full Image Background */}
                <div className="hidden md:block h-80">
                  {/* Background Image with Zoom Effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-2xl group-hover:text-yellow-300 transition-colors duration-300 font-serif">
                      {p.title}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2 text-purple-100 drop-shadow-lg leading-relaxed">
                      {p.content}
                    </p>

                    {/* Price + Add to Cart in one line */}
                    <div className="flex items-center justify-between gap-3">
                      {/* Price Badge */}
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-900 px-4 py-2.5 rounded-full font-bold text-lg shadow-lg">
                        <IndianRupee className="size-5" />
                        <span>{p.price}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p);
                        }}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
                      >
                        <ShoppingCart className="size-5" />
                        {cart.find(item => item._id === p._id)?.qty
                          ? `(${cart.find(item => item._id === p._id).qty})`
                          : 'Add'}
                      </button>
                    </div>
                  </div>

                  {/* Decorative Bottom Wave */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
                </div>

                {/* Mobile Layout - Square Image on Top, Content Below */}
                <div className="md:hidden flex flex-col">
                  {/* Square Image */}
                  <div
                    className="aspect-square overflow-hidden cursor-pointer"
                    onClick={() => toggleProductExpand(p._id)}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full rounded-b-lg object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Content Below Image - Fixed Height Container */}
                  <div className="p-3 rounded-t-lg bg-pink-100 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold mb-2 text-purple-900 font-serif line-clamp-2">
                      {p.title}
                    </h3>

                    {/* Description - Absolute positioned overlay */}
                    {expandedProduct === p._id && (
                      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setExpandedProduct(null)}>
                        <div className="bg-white rounded-2xl p-3 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-md font-bold mb-1 text-purple-900 font-serif">
                            {p.title}
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed mb-4">
                            {p.content}
                          </p>
                          <div className="flex justify-center">
                            <button
                              onClick={() => setExpandedProduct(null)}
                              className="w-[50%] h-[32px] bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full"
                            >
                              Close
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Price + Add to Cart */}
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      {/* Price Badge */}
                      <div className="flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-900 px-2 py-1.5 rounded-full font-bold text-xs shadow-md">
                        <IndianRupee className="size-3" />
                        <span>{p.price}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p);
                        }}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-1.5 px-3 rounded-full flex items-center justify-center gap-1 transition-all duration-300 shadow-md text-xs"
                      >
                        <ShoppingCart className="size-3" />
                        {cart.find(item => item._id === p._id)?.qty
                          ? `(${cart.find(item => item._id === p._id).qty})`
                          : 'Add'}
                      </button>
                    </div>
                  </div>

                  {/* Decorative Bottom Wave */}
                  <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md text-center border-2 border-purple-100">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center">
                <span className="text-3xl md:text-4xl">🍰</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-900 mb-2 md:mb-3">No Products Yet</h3>
              <p className="text-purple-600 text-sm md:text-base">Check back soon for delicious bakery items!</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
{cart.length > 0 && (
  <div className="fixed bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[40%] sm:w-[70%] sm:max-w-xs md:max-w-xs">
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl shadow-xl p-3 md:p-4 backdrop-blur-sm border border-white/20 scale-[0.95] md:scale-100">
      
      {/* Cart Details */}
      <div className="flex items-center justify-center gap-5 text-white mb-2 md:mb-4">
        <div>
          <p className="text-[10px] md:text-sm text-center font-medium text-purple-100">Total Items</p>
          <p className="text-lg md:text-2xl text-center font-bold">
            {cart.reduce((acc, item) => acc + (item.qty || 1), 0)}
          </p>
        </div>

        <div className="h-8 md:h-12 w-px bg-white/30"></div>

        <div>
          <p className="text-[10px] md:text-sm font-medium text-center text-purple-100">Total Amount</p>
          <div className="flex items-center justify-center gap-1">
            <IndianRupee className="size-3 md:size-5" />
            <p className="text-lg text-center md:text-2xl font-bold">
              {cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/customer/cart")}
          className="bg-white text-purple-600 font-bold py-2.5 md:py-4 px-5 md:px-8 rounded-full flex items-center justify-center gap-2 md:gap-3 text-xs md:text-base transition-all duration-300 shadow-lg hover:shadow-white/30 transform hover:scale-105 hover:bg-yellow-300"
        >
          <ShoppingBag className="size-4 md:size-6" />
          <span className="md:text-md">Cart</span>
        </button>
      </div>
    </div>
  </div>
)}


      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default CustomerHome;