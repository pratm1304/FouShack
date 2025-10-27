import React from 'react'
import { Link } from 'react-router'
import { PlusIcon, ShoppingCartIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <header className='bg-purple-300 border-b border-base-content/10'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <h1 className='text-2xl sm:text-3xl font-bold text-primary font-mono tracking-tight'>Fou Shack</h1>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto'>
            <Link to="/admin/add" className='btn btn-primary btn-sm sm:btn-md flex items-center justify-center gap-2'>
              <PlusIcon className='size-4 sm:size-5'/>
              <span className='whitespace-nowrap'>Add Product</span>
            </Link>
            <Link to="/admin/orders" className='btn btn-secondary btn-sm sm:btn-md flex items-center justify-center gap-2'>
              <ShoppingCartIcon className='size-4 sm:size-5'/>
              <span className='whitespace-nowrap'>Check Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
};

export default Navbar