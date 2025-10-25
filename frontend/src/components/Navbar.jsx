import React from 'react'
import { Link } from 'react-router'
import { PlusIcon, ShoppingCartIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <header className='bg-purple-300 border-b border-base-content/10'>
      <div className='mx-2 max-w-screen p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-primary font-mono tracking-tight'>Fou Shack</h1>
          <div className='flex items-center gap-4'>
            <Link to="/admin/add" className='btn btn-primary flex items-center gap-2'>
              <PlusIcon className='size-5'/>
              <span>Add Product</span>
            </Link>
            <Link to="/admin/orders" className='btn btn-secondary flex items-center gap-2'>
              <ShoppingCartIcon className='size-5'/>
              <span>Check Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
};

export default Navbar
