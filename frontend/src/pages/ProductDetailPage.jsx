import { ArrowLeftIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams } from 'react-router'

const ProductDetailPage = () => {

  const { id } = useParams();
  // console.log(id)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState(null); // new state for image


  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`https://foushack-backend.onrender.com/admin/${id}`)
      // console.log(res.data.title)
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

    if(image) formData.append("image", image); // only if user selected new image

    await axios.put(`https://foushack-backend.onrender.com/admin/${id}`, formData, {
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
    <div className='min-h-screen bg-purple-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/admin"} className='input input-info btn btn-ghost bg-blue-200 text-blue-800'><ArrowLeftIcon className='size-4' />Back to products</Link>
          <div className='card mt-6 bg-blue-100'>
            <div className='card-body '>
              <h2 className='text-blue-800 text-2xl'>Update product</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <label className='label border-'>
                    <span className='label-text'>Title</span>
                  </label>
                  <input className="input input-info input-sm" type="text"
                    placeholder={title}
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
                  <input
                    className="input input-info input-sm"
                    type="number"
                    placeholder='Price'
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))} />
                </div>

                <div className='form-control mb-4'>
  <label className='label'>
    <span className='label-text'>Image</span>
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
    className="file-input file-input-bordered w-full"
  />
</div>



                <div className='card-actions justify-end'>
                  <button type='submit' className='btn btn-secondary'>Update</button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
