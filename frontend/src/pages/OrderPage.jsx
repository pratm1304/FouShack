import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import {ArrowLeftIcon, Clock, Clock10 } from 'lucide-react'
import { format } from 'date-fns-tz';
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
        <div className='max-w-2xl'>
        <Link to={"/admin"} className='btn btn-ghost bg-blue-200 text-blue-800'><ArrowLeftIcon className='size-4'/>Back to products</Link>
        </div>
      <h2 className="mt-4 text-2xl font-bold mb-6">All Orders</h2>
      {loading && <div className="text-center text-primary py-10">Loading Orders...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Order #{order._id}</h3>
        
            <p className=" text-purple-600 mb-1 font-bold text-lg"> {order.name}</p>
            <p className="text-lg text-gray-600 font-bold mb-1"> ₹{order.totalAmount}</p>
            <div className="mt-2">
              <h4 className="font-semibold">Items:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {order.items.map((item, idx) => (
                  <li className='badge p-3 m-1 badge-soft badge-warning' key={idx}>{item.title} x {item.qty}</li>
                ))}
              </ul>
                <span className="text-sm mt-2 text-gray-500 flex items-center gap-1">
  <Clock className='size-4' />
  {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", { timeZone: "Asia/Kolkata" })}
</span>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
