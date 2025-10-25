import { ArrowLeftIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Navigate } from 'react-router'

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

    await axios.post("http://localhost:5001/admin", formData, {
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
    <div className='min-h-screen bg-purple-200'>
      <div className='container   mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/admin"} className='btn btn-ghost bg-blue-200 text-blue-800'><ArrowLeftIcon className='size-4' />Back to products</Link>
          <div className='card mt-6 bg-blue-100'>
            <div className='card-body '>
              <h2 className='text-blue-800 text-2xl'>Add new product</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <label className='label border-'>
                    <span className='label-text'>Title</span>
                  </label>
                  <input className="input input-info input-sm" type="text"
                    placeholder='Product Name'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
                </div>


                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Description</span>
                  </label>
                  <input className="input input-info input-sm" type="text"
                    placeholder='Describe the product'
                    value={content}
                    onChange={(e) => setContent(e.target.value)} />
                </div>

                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Price</span>
                  </label>
                  <input className="input validator input-sm" type="number"
                    placeholder='0'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />



                <div className='card-actions justify-end'>
                  <button type='submit' className='btn btn-secondary'>Add</button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AddPage
