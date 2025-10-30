import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import axios from 'axios'
import toast from 'react-hot-toast'
import ProductCard from '../components/ProductCard'
import API_URL from '../config/api'


const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async ()=> {
      try {
        const res = await axios.get(`${API_URL}/admin`)
        console.log(res.data);
        setProducts(res.data);
        
      } catch (error) {
        console.log("Error fetching products");
        
      } finally {
        setLoading(false)
      }
    }

    fetchProducts();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <Navbar />

      <div className="container relative z-10 mx-auto p-4 min-h-screen">
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
            {products.map(product => (
              <ProductCard key={product._id} product={product} setProducts={setProducts} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center border-2 border-purple-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🍰</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-3">No Products Yet</h3>
              <p className="text-purple-600">Start adding your delicious bakery items!</p>
            </div>
          </div>
        )}
      </div>

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
  )
}

export default HomePage