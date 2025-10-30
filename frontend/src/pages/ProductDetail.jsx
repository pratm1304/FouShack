import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { ShoppingCart, IndianRupeeIcon, Sparkles, ArrowLeft } from "lucide-react";
import API_URL from "../config/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/customer/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
    navigate("/cart"); // optional: redirect to cart after adding
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-pink-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-purple-700 font-semibold text-lg animate-pulse">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container relative z-10 mx-auto p-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-purple-50 text-purple-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300"
        >
          <ArrowLeft className="size-5" />
          Back
        </button>

        {/* Product Detail Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-100">
          <div className="md:flex">
            {/* Product Image Section */}
            <div className="md:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-50">
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg animate-pulse">
                  <Sparkles className="size-5 text-white" />
                </div>
              </div>
              <img
                src={`${API_URL}/${product.imageUrl}`}
                alt={product.title}
                className="w-full h-full min-h-[400px] object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
            </div>

            {/* Product Info Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4 font-serif">
                {product.title}
              </h1>

              {/* Description */}
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {product.content}
              </p>

              {/* Price Badge */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-900 px-6 py-4 rounded-2xl font-bold text-3xl shadow-lg">
                  <IndianRupeeIcon className="size-7" />
                  <span>{product.price}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart className="size-6" />
                Add to Cart
              </button>

              {/* Decorative Element */}
              <div className="mt-8 flex items-center gap-2 text-purple-600">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                <Sparkles className="size-5" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;