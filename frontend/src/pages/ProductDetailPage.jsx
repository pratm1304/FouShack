import { ArrowLeftIcon, Sparkles, ImageIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams } from 'react-router'
import API_URL from '../config/api'

const ProductDetailPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`${API_URL}/admin/${id}`)
      setTitle(res.data.title)
      setContent(res.data.content)
      setPrice(res.data.price)
    }

    fetchProduct();
  }, [id])

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || price <= 0) {
      toast.error("All fields are required")
      return
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("price", price);

      if(image) formData.append("image", image);

      await axios.put(`${API_URL}/admin/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Product Updated");
      navigate("/admin");
    } catch (error) {
      toast.error("Product couldn't be updated");
      console.log(error);
    }
  }

  return (
    <div className='min-h-screen bg-black text-white p-6'>
      <div className='container mx-auto'>
        <div className='max-w-2xl mx-auto'>
          {/* Back Button */}
          <Link 
            to={"/admin"} 
            className='inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full border border-white/10 transition-all duration-300 mb-6'
          >
            <ArrowLeftIcon className='size-5' />
            Back to products
          </Link>

          {/* Main Card */}
          <div className='bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden'>
            {/* Header Section */}
            <div className='px-8 py-6 border-b border-white/10'>
              <div className='flex items-center gap-3'>
                <h2 className='text-white text-3xl font-bold'>Update Product</h2>
              </div>
            </div>

            {/* Form Section */}
            <div className='px-8 py-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Title Input */}
                <div className='space-y-2'>
                  <label className='block text-gray-400 font-semibold text-sm'>
                    Product Title
                  </label>
                  <input 
                    className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all text-white placeholder-gray-500" 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                {/* Description Input */}
                <div className='space-y-2'>
                  <label className='block text-gray-400 font-semibold text-sm'>
                    Description
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all text-white placeholder-gray-500 resize-none h-24" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)} 
                  />
                </div>

                {/* Price Input */}
                <div className='space-y-2'>
                  <label className='block text-gray-400 font-semibold text-sm'>
                    Price (₹)
                  </label>
                  <input 
                    className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all text-white placeholder-gray-500" 
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))} 
                  />
                </div>

                {/* Image Upload */}
                <div className='space-y-2'>
                  <label className='block text-gray-400 font-semibold text-sm'>
                    Update Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 file:cursor-pointer"
                  />
                  {image && (
                    <p className='text-sm text-gray-400 mt-2 flex items-center gap-2'>
                      <ImageIcon className='size-4' />
                      {image.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type='submit' 
                  className='w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2'
                >
                  Update Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage