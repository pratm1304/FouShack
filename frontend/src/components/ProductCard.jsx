import { IndianRupeeIcon, PenSquareIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'

const ProductCard = ({ product, setProducts }) => {

    const navigate = useNavigate();
    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:5001/admin/${id}`)
            setProducts((prev) => prev.filter((product) => product._id !== id))
            toast.success("Product deleted")

        } catch (error) {
            toast.error("Error deleting the product")
        }
    }

    return (
  <Link
    to={`/admin/${product._id}`}
    className="relative mt-2 w-full h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
  >
    {/* Background Image */}
    <img
      src={`http://localhost:5001/${product.imageUrl}`}
      alt={product.title}
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Dark Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-800/70 to-transparent"></div>

    {/* Foreground Content */}
    <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
      <h3 className="font-bold text-lg mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
        {product.title}
      </h3>
      <p className="text-sm mb-3 line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        {product.content}
      </p>

      {/* Price and Icons Row */}
      <div className="flex items-center justify-between mt-2">
        <span className="flex items-center gap-1 text-yellow-300 font-semibold text-sm">
          <IndianRupeeIcon className=" size-3" /> {product.price}
        </span>

        <div className="flex items-center gap-2">
          <PenSquareIcon className="size-5 text-blue-300 cursor-pointer hover:text-blue-100 transition" />
          <button
            onClick={(e) => handleDelete(e, product._id)}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
          >
            <Trash2Icon className="size-5 text-red-400 hover:text-red-200 transition" />
          </button>
        </div>
      </div>
    </div>
  </Link>
)


}

export default ProductCard