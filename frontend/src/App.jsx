import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import AddPage from './pages/AddPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import toast from "react-hot-toast"
import CustomerHome from './pages/CustomerHome.jsx';
import CartPage from './pages/CartPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import OrdersPage from './pages/OrderPage.jsx'
import InventoryPage from './pages/InventoryPage.jsx'; 

const App = () => {
  return (
    <div data-theme="light" className='realtive h-full w-full'>
      <Routes>
        <Route path="/" element={<Navigate to="/customer/" replace />} />

        <Route path="/admin/" element={<HomePage />} />
        <Route path="/admin/add" element={<AddPage />} />
        <Route path="/admin/:id" element={<ProductDetailPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />

        <Route path="/customer/" element={<CustomerHome />} />
        <Route path="/customer/cart" element={<CartPage />} />
        <Route path="/customer/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  )
}

export default App
