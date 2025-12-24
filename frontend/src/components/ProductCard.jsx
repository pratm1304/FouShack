import React from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Edit, Trash2, IndianRupee } from 'lucide-react'
import API_URL from '../config/api'

const ProductCard = ({ product, setProducts }) => {

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?")
    if (!confirmed) return

    try {
      await axios.delete(`${API_URL}/admin/${product._id}`)
      
      // Update state to remove deleted product
      setProducts(prev => prev.filter(p => p._id !== product._id))
      
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      console.log(error)
    }
  }

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        <img 
          src={product.imageUrl} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Hover Overlay with Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/admin/${product._id}`}
            className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-all transform hover:scale-110"
          >
            <Edit className="size-5" />
          </Link>
          
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
          >
            <Trash2 className="size-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-1 truncate">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {product.content}
        </p>

        {/* Price */}
        <div className="flex items-center gap-1 text-white font-bold text-xl">
          <IndianRupee className="size-5" />
          <span>{product.price}</span>
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className="h-1 bg-white"></div>
    </div>
  )
}

export default ProductCard;