import React from 'react'
import { Link } from 'react-router'
import { Plus, Package, ShoppingBag } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="bg-neutral-900 border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg bg-neutral-900/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/admin" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
             FOU SHACK 
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            {/* Add Product Button */}
            <Link 
              to="/admin/add" 
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add Product</span>
            </Link>

            {/* Orders Button */}
            <Link 
              to="/admin/orders" 
              className="flex items-center gap-2 bg-neutral-800 text-white border border-white/10 px-4 py-2 rounded-full font-semibold hover:bg-neutral-700 transition-all duration-300"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar