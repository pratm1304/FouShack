import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, ShoppingBag, IndianRupee, Sparkles } from "lucide-react";
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
        p._id === product._id ? {...p, qty: (p.qty || 1) + 1} : p
      );
    } else {
      newCart = [...cart, {...product, qty: 1}];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      {/* Hero Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 py-5 rounded-b-xl mb-3 md:py-6 px-4 shadow-xl">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-fadeIn">
            {products.map(p => (
              <div 
                key={p._id} 
                className="group relative h-80 sm:h-86 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.03] bg-white"
              >
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={p.imageUrl} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Decorative Top Badge
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg">
                    <Sparkles className="size-4 text-white" />
                  </div>
                </div> */}

                {/* Purple Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-white/10 to-transparent"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-5 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 drop-shadow-2xl group-hover:text-yellow-300 transition-colors duration-300 font-serif">
                    {p.title}
                  </h3>
                  <p className="text-sm mb-3 line-clamp-2 text-purple-100 drop-shadow-lg leading-relaxed">
                    {p.content}
                  </p>
                  
                  {/* Price + Add to Cart in one line */}
<div className="flex items-center justify-between w-full mb-2 sm:mb-2">

  {/* Price Badge */}
  <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-900 px-3 sm:px-4 py-2 rounded-full font-bold text-base sm:text-lg shadow-lg w-fit">
    <IndianRupee className="size-4 sm:size-5" /> 
    <span>{p.price}</span>
  </div>

  {/* Add to Cart Button */}
  <button
    onClick={() => handleAddToCart(p)}
    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2.5 sm:py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 text-sm sm:text-base"
  >
    <ShoppingCart className="size-4 sm:size-5" /> 
    {cart.find(item => item._id === p._id)?.qty 
      ? `Added (${cart.find(item => item._id === p._id).qty})` 
      : 'Add to Cart'}
  </button>

</div>

                </div>

                {/* Decorative Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
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
        <div className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-xs">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-3 backdrop-blur-sm border-2 border-white/20">
            <div className="flex items-center justify-center gap-7 text-white mb-3 md:mb-4">
              <div>
                <p className="text-xs text-center md:text-sm font-medium text-purple-100">Total Items</p>
                <p className="text-xl text-center md:text-2xl font-bold">{cart.reduce((acc, item) => acc + (item.qty || 1), 0)}</p>
              </div>
              <div className="h-10 md:h-12 w-px bg-white/30"></div>
              <div>
                <p className="text-xs md:text-sm font-medium text-purple-100">Total Amount</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="size-4 md:size-5" />
                  <p className="text-xl md:text-2xl font-bold">{cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => navigate("/customer/cart")} 
                className="bg-white text-purple-600 font-bold py-3 md:py-4 px-6 md:px-8 rounded-full flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-white/30 transform hover:scale-105 hover:bg-yellow-300 text-sm md:text-base"
              >
                <ShoppingBag className="size-5 md:size-6" />
                <span className="md:text-md">Go to Cart</span>
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