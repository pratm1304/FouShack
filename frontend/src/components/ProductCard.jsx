import { IndianRupeeIcon, PenSquareIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import API_URL from "../config/api";

const ProductCard = ({ product, setProducts }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      await axios.delete(`${API_URL}/admin/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product deleted successfully! 🗑️");
    } catch (error) {
      toast.error("Error deleting the product");
    }
  };

  return (
    <Link
      to={`/admin/${product._id}`}
      className="group relative w-full h- sm:h-86 rounded-3xl overflow-hidden shadow-xl bg-white hover:bg-white/95 flex flex-col transition-all duration-500"
    >
      {/* Image Section */}
      <div className="h-1/2 rounded-b-xl w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="h-1/2 mt-0 flex flex-col justify-between p-2 sm:p-6 text-gray-900">
        {/* Title */}
        <h3 className=" font-bold text-sm sm:text-2xl lg:text-3xl sm:mb-0.5 text-purple-700 group-hover:text-yellow-500 transition-colors duration-300 font-serif">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-base mb-3 sm:mb-4 line-clamp-1 text-gray-600 leading-relaxed">
          {product.content}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-300/40">
          {/* Price */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-sm sm:text-lg shadow-lg group-hover:shadow-yellow-400/50 transition-shadow">
            <IndianRupeeIcon className="size-3 sm:size-5" />
            <span>{product.price}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex p-2 justify-end items-center gap-2 sm:gap-3">
            <div className="bg-blue-500/80 hover:bg-blue-500 p-1.5 sm:p-2 rounded-full transition-all shadow-md hover:shadow-blue-500/50 backdrop-blur-sm">
              <PenSquareIcon className="size-4 sm:size-5 text-white" />
            </div>
            <button
              onClick={(e) => handleDelete(e, product._id)}
              className="bg-red-500/80 hover:bg-red-600 p-1.5 sm:p-2 rounded-full transition-all shadow-md hover:shadow-red-500/50 backdrop-blur-sm"
            >
              <Trash2Icon className="size-4 sm:size-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
    </Link>
  );
};

export default ProductCard;
