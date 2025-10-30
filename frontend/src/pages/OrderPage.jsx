import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Package, IndianRupee, Sparkles } from 'lucide-react'
import { format } from 'date-fns-tz'
import API_URL from '../config/api'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/orders`)
        setOrders(res.data)
        console.log(res.data)
      } catch (err) {
        console.log(err)
        toast.error("Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          icon: <CheckCircle className='size-5' />,
          text: 'PAID'
        }
      case 'pending':
        return {
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          icon: <AlertCircle className='size-5' />,
          text: 'PENDING'
        }
      case 'failed':
        return {
          color: 'from-red-500 to-rose-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          icon: <XCircle className='size-5' />,
          text: 'FAILED'
        }
      default:
        return {
          color: 'from-gray-500 to-slate-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          icon: <AlertCircle className='size-5' />,
          text: 'UNKNOWN'
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className='relative z-10 container mx-auto p-4 md:p-6'>
        {/* Back Button */}
        <Link 
          to={"/admin"} 
          className='inline-flex items-center gap-2 bg-white hover:bg-purple-50 text-purple-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all mb-6'
        >
          <ArrowLeft className='size-5'/>
          <span>Back to Products</span>
        </Link>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3 text-white">
            <Package className="size-8 md:size-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif">All Orders</h1>
              <p className="text-purple-100 text-sm md:text-base">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} received
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-pink-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="mt-6 text-purple-700 font-semibold text-lg animate-pulse">
              Loading orders...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md text-center border-2 border-purple-100">
              <div className="w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Package className="size-10 md:size-12 text-purple-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-900 mb-3">No Orders Yet</h3>
              <p className="text-purple-600">Orders will appear here once customers start placing them!</p>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fadeIn">
          {orders.map(order => {
            const statusBadge = getStatusBadge(order.paymentStatus);
            
            return (
              <div 
                key={order._id} 
                className="bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {/* Status Header */}
                <div className={`bg-gradient-to-r ${statusBadge.color} p-4 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      {statusBadge.icon}
                      <span className="font-bold text-sm md:text-base">{statusBadge.text}</span>
                    </div>
                    <Sparkles className="size-5 animate-pulse" />
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  {/* Customer Name & Order ID */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl md:text-2xl text-purple-900 mb-1">
                      {order.name}
                    </h3>
                    <p className="text-xs text-purple-400 font-mono">
                      #{order._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4">
                    <p className="text-xs text-purple-600 mb-1 font-semibold">Total Amount</p>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="size-6 text-purple-900" />
                      <p className="text-3xl font-bold text-purple-900">{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-purple-700 mb-3 flex items-center gap-2">
                      <Package className="size-4" />
                      Order Items
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <span 
                          key={idx} 
                          className='bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-xs font-semibold'
                        >
                          {item.title} × {item.qty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Payment ID (if paid) */}
                  {order.paymentStatus === 'paid' && order.razorpayPaymentId && (
                    <div className={`${statusBadge.bgColor} p-3 rounded-2xl mb-4`}>
                      <p className={`text-xs ${statusBadge.textColor} font-semibold mb-1`}>
                        Payment ID
                      </p>
                      <p className={`text-xs ${statusBadge.textColor} font-mono break-all`}>
                        {order.razorpayPaymentId}
                      </p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="pt-4 border-t border-purple-100">
                    <div className="flex items-center gap-2 text-xs text-purple-500">
                      <Clock className='size-4' />
                      <span>
                        {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a", { 
                          timeZone: "Asia/Kolkata" 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Bottom Wave */}
                <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  )
}

export default OrdersPage