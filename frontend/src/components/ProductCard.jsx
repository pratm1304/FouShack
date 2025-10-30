import { IndianRupeeIcon, PenSquareIcon, Trash2Icon, Sparkles } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import API_URL from '../config/api'

const ProductCard = ({ product, setProducts }) => {
    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            await axios.delete(`${API_URL}/admin/${id}`)
            setProducts((prev) => prev.filter((product) => product._id !== id))
            toast.success("Product deleted successfully! 🗑️")
        } catch (error) {
            toast.error("Error deleting the product")
        }
    }

    return (
        <Link
            to={`/admin/${product._id}`}
            className="group relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.05] bg-white"
        >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>

            {/* Decorative Corner Badge
            <div className="absolute top-4 right-4 z-20">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg animate-pulse">
                    <Sparkles className="size-4 text-white" />
                </div>
            </div> */}

            {/* Purple Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-white/10 to-transparent"></div>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6 text-white">
                {/* Title */}
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-2 drop-shadow-2xl group-hover:text-yellow-300 transition-colors duration-300 font-serif">
                    {product.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm sm:text-base mb-4 line-clamp-2 text-purple-100 drop-shadow-lg leading-relaxed">
                    {product.content}
                </p>

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-300/40">
                    {/* Price Badge */}
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-900 px-4 py-2 rounded-full font-bold text-base sm:text-lg shadow-lg group-hover:shadow-yellow-400/50 transition-shadow">
                        <IndianRupeeIcon className="size-4 sm:size-5" /> 
                        <span>{product.price}</span>
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/80 hover:bg-blue-500 p-2 rounded-full transition-all shadow-md hover:shadow-blue-500/50 backdrop-blur-sm">
                            <PenSquareIcon className="size-5 text-white" />
                        </div>
                        <button
                            onClick={(e) => handleDelete(e, product._id)}
                            className="bg-red-500/80 hover:bg-red-600 p-2 rounded-full transition-all shadow-md hover:shadow-red-500/50 backdrop-blur-sm"
                        >
                            <Trash2Icon className="size-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
        </Link>
    )
}

export default ProductCard