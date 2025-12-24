import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Package, IndianRupee, Sparkles, MapPin, Phone } from 'lucide-react'
import { format } from 'date-fns-tz'
import API_URL from '../config/api'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/orders`)
        
        if (Array.isArray(res.data)) {
          setOrders(res.data)
          console.log(res.data)
        } else {
          console.error("Expected array, got:", res.data)
          toast.error("Invalid data format received")
          setOrders([])
        }
      } catch (err) {
        console.log(err)
        toast.error("Failed to fetch orders")
        setOrders([])
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
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          textColor: 'text-green-500',
          icon: <CheckCircle className='size-5' />,
          text: 'PAID'
        }
      case 'pending':
        return {
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          textColor: 'text-yellow-500',
          icon: <AlertCircle className='size-5' />,
          text: 'PENDING'
        }
      case 'failed':
        return {
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          textColor: 'text-red-500',
          icon: <XCircle className='size-5' />,
          text: 'FAILED'
        }
      default:
        return {
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          textColor: 'text-gray-500',
          icon: <AlertCircle className='size-5' />,
          text: 'UNKNOWN'
        }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className='container mx-auto p-4 md:p-6'>
        {/* Back Button */}
        <Link 
          to={"/admin"} 
          className='inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-6 py-3 rounded-full border border-white/10 transition-all mb-6'
        >
          <ArrowLeft className='size-5'/>
          <span>Back to Products</span>
        </Link>
        
        {/* Header */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <Package className="size-8 md:size-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">All Orders</h1>
              <p className="text-gray-400 text-sm md:text-base">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} received
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-400 font-semibold text-lg animate-pulse">
              Loading orders...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 max-w-md text-center">
              <div className="w-20 md:w-24 h-20 md:h-24 bg-neutral-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Package className="size-10 md:size-12 text-gray-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">No Orders Yet</h3>
              <p className="text-gray-400">Orders will appear here once customers start placing them!</p>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {orders.map(order => {
            const statusBadge = getStatusBadge(order.paymentStatus);
            
            return (
              <div 
                key={order._id} 
                className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {/* Status Header */}
                <div className={`${statusBadge.bgColor} border-b ${statusBadge.borderColor} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${statusBadge.textColor}`}>
                      {statusBadge.icon}
                      <span className="font-bold text-sm md:text-base">{statusBadge.text}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  {/* Customer Name & Order ID */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl md:text-2xl text-white mb-1">
                      {order.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      #{order._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {/* Mobile Number */}
                  {order.mobileNumber && (
                    <div className="mb-4 flex items-center gap-2 text-gray-400">
                      <Phone className="size-4" />
                      <span className="text-sm font-medium">{order.mobileNumber}</span>
                    </div>
                  )}

                  {/* Address */}
                  {order.address && (
                    <div className="mb-4 bg-neutral-800 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-start gap-2">
                        <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-300">
                          <p className="font-medium">{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state}</p>
                          <p className="font-semibold">{order.address.pincode}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="mb-4 bg-neutral-800 rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-gray-400 mb-1 font-semibold">Total Amount</p>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="size-6 text-white" />
                      <p className="text-3xl font-bold text-white">{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-400 mb-3 flex items-center gap-2">
                      <Package className="size-4" />
                      Order Items
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <span 
                          key={idx} 
                          className='bg-neutral-800 border border-white/10 text-white px-3 py-2 rounded-full text-xs font-semibold'
                        >
                          {item.title} × {item.qty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Payment ID (if paid) */}
                  {order.paymentStatus === 'paid' && order.razorpayPaymentId && (
                    <div className={`${statusBadge.bgColor} border ${statusBadge.borderColor} p-3 rounded-2xl mb-4`}>
                      <p className={`text-xs ${statusBadge.textColor} font-semibold mb-1`}>
                        Payment ID
                      </p>
                      <p className={`text-xs ${statusBadge.textColor} font-mono break-all`}>
                        {order.razorpayPaymentId}
                      </p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className='size-4' />
                      <span>
                        {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a", { 
                          timeZone: "Asia/Kolkata" 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage