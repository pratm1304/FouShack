import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { ArrowLeftIcon, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
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

  // Get payment status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'badge-success',
          icon: <CheckCircle className='size-4' />,
          text: 'PAID'
        }
      case 'pending':
        return {
          color: 'badge-warning',
          icon: <AlertCircle className='size-4' />,
          text: 'PENDING'
        }
      case 'failed':
        return {
          color: 'badge-error',
          icon: <XCircle className='size-4' />,
          text: 'FAILED'
        }
      default:
        return {
          color: 'badge-ghost',
          icon: <AlertCircle className='size-4' />,
          text: 'UNKNOWN'
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className='max-w-7xl mx-auto'>
        <Link to={"/admin"} className='btn btn-ghost bg-blue-200 text-blue-800'>
          <ArrowLeftIcon className='size-4'/>Back to products
        </Link>
        
        <h2 className="mt-6 text-3xl font-bold mb-6">All Orders 📦</h2>

        {loading && (
          <div className="text-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Loading Orders...</p>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No orders yet!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => {
            const statusBadge = getStatusBadge(order.paymentStatus);
            
            return (
              <div key={order._id} className="bg-white shadow-lg rounded-lg p-5 flex flex-col hover:shadow-xl transition-shadow">
                {/* Header with Status */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-purple-600">{order.name}</h3>
                    <p className="text-xs text-gray-500">Order #{order._id?.slice(-8)}</p>
                  </div>
                  <div className={`badge ${statusBadge.color} gap-2 p-3`}>
                    {statusBadge.icon}
                    {statusBadge.text}
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</p>
                </div>

                {/* Items */}
                <div className="mb-3 flex-1">
                  <h4 className="font-semibold text-sm mb-2">Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span 
                        key={idx} 
                        className='badge badge-outline badge-warning p-3'
                      >
                        {item.title} × {item.qty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Payment ID (if paid) */}
                {order.paymentStatus === 'paid' && order.razorpayPaymentId && (
                  <div className="bg-green-50 p-2 rounded mb-3">
                    <p className="text-xs text-green-800">
                      <strong>Payment ID:</strong> {order.razorpayPaymentId}
                    </p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="pt-3 border-t">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className='size-3' />
                    {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", { 
                      timeZone: "Asia/Kolkata" 
                    })}
                  </span>
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