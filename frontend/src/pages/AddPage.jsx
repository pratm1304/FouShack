import { ArrowLeftIcon, Sparkles, ImageIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Navigate } from 'react-router'
import API_URL from '../config/api'

const AddPage = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState(null)

  const navigate = useNavigate()

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // first selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !image) {
      toast.error("All fields are required")
      return
    }

    try {
      // FormData create karo for file upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("price", price);
      formData.append("image", image); // file input

      await axios.post(`${API_URL}/admin`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      toast.success("Product Added")
      navigate("/admin")
    } catch (error) {
      toast.error("Product couldn't be added")
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50'>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className='container relative z-10 mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          {/* Back Button */}
          <Link 
            to={"/admin"} 
            className='inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-purple-50 text-purple-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300'
          >
            <ArrowLeftIcon className='size-5' />
            Back to products
          </Link>

          {/* Main Card */}
          <div className='mt-6 bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-100'>
            {/* Header Section with Gradient */}
            <div className='bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-8 py-6 relative overflow-hidden'>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              
              <div className='relative z-10 flex items-center gap-3'>
                <div className='bg-white/20 backdrop-blur-sm p-3 rounded-2xl'>
                  <Sparkles className='size-6 text-white' />
                </div>
                <h2 className='text-white text-3xl font-bold drop-shadow-lg'>Add New Product</h2>
              </div>
            </div>

            {/* Form Section */}
            <div className='px-8 py-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Title Input */}
                <div className='space-y-2'>
                  <label className='block text-purple-900 font-semibold text-sm'>
                    Product Title
                  </label>
                  <input 
                    className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-purple-300" 
                    type="text"
                    placeholder='Enter product name...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                {/* Description Input */}
                <div className='space-y-2'>
                  <label className='block text-purple-900 font-semibold text-sm'>
                    Description
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-purple-300 resize-none h-24" 
                    placeholder='Describe your delicious product...'
                    value={content}
                    onChange={(e) => setContent(e.target.value)} 
                  />
                </div>

                {/* Price Input */}
                <div className='space-y-2'>
                  <label className='block text-purple-900 font-semibold text-sm'>
                    Price (₹)
                  </label>
                  <input 
                    className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-purple-300" 
                    type="number"
                    placeholder='0'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} 
                  />
                </div>

                {/* Image Upload */}
                <div className='space-y-2'>
                  <label className='block text-purple-900 font-semibold text-sm'>
                    Product Image
                  </label>
                  <div className='relative'>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:cursor-pointer"
                    />
                  </div>
                  {image && (
                    <p className='text-sm text-purple-600 mt-2 flex items-center gap-2'>
                      <ImageIcon className='size-4' />
                      {image.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className='pt-4'>
                  <button 
                    type='submit' 
                    className='w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2'
                  >
                    <Sparkles className='size-5' />
                    Add Product
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative Bottom Wave */}
            <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPage