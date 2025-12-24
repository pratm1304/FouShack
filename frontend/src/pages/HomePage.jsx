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
        toast.error("Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts();
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto p-4 md:p-6 min-h-screen">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-400 font-semibold text-lg animate-pulse">
              Loading delicious products...
            </p>
          </div>
        )}
        
        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} setProducts={setProducts} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-12 max-w-md text-center">
              <div className="w-20 h-20 bg-neutral-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🍰</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Products Yet</h3>
              <p className="text-gray-400">Start adding your delicious bakery items!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage;