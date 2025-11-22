import React from 'react'
import { Link } from 'react-router'
import { PlusIcon, ShoppingCartIcon, CakeIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <header className='bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 shadow-lg'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          {/* Logo with Bakery Icon */}
          <Link to="/admin" className='flex items-center gap-3 hover:scale-105 transition-transform'>
            <div className='bg-white p-2 rounded-full shadow-md'>
              <CakeIcon className='size-6 sm:size-8 text-purple-600' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-4xl font-bold text-white font-serif tracking-wide drop-shadow-lg'>
                Fou Shack
              </h1>
              <p className='text-xs sm:text-sm text-purple-100 font-light'>Artisan Bakery</p>
            </div>
          </Link>
          
          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto'>
            <Link 
              to="/admin/add" 
              className='btn bg-white text-purple-600 hover:bg-purple-50 border-none btn-sm sm:btn-md flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all'
            >
              <PlusIcon className='size-4 sm:size-5'/>
              <span className='whitespace-nowrap font-semibold'>Add Product</span>
            </Link>
            <Link 
              to="/admin/orders" 
              className='btn bg-yellow-400 text-purple-900 hover:bg-yellow-300 border-none btn-sm sm:btn-md flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all'
            >
              <ShoppingCartIcon className='size-4 sm:size-5'/>
              <span className='whitespace-nowrap font-semibold'>Orders</span>
            </Link>

            <Link 
              to="/admin/inventory"
              className="btn btn-primary"
            >
            Inventory
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
};

export default Navbar