import { IndianRupeeIcon, PenSquareIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'

const ProductCard = ({ product, setProducts }) => {

    const navigate = useNavigate();
    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            await axios.delete(`https://foushack.onrender.com/admin/${id}`)
            setProducts((prev) => prev.filter((product) => product._id !== id))
            toast.success("Product deleted")

        } catch (error) {
            toast.error("Error deleting the product")
        }
    }

    return (
        <Link to={`/admin/${product._id}`}
            className='w-full sm:w-72 md:w-80 lg:w-80 bg-blue-100 hover:shadow-lg transition-all duration-200
            border-t-4 border-solid border-blue-300 rounded-lg overflow-hidden'
        >
            <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover" />

            <div className='card-body p-4'>
                <h3 className='card-title text-base-content text-sm sm:text-base'>{product.title}</h3>
                <p className='text-base-content/70 line-clamp-3 text-xs sm:text-sm'>{product.content}</p>
                <span className='badge badge-outline badge-primary flex items-center gap-1 text-base-content/70 text-xs sm:text-sm mt-2'>
                    <IndianRupeeIcon className='size-3' /> {product.price}
                </span>
                <div className='mt-4 flex items-center justify-between'>
    <PenSquareIcon className='size-5' />
    <button onClick={(e) => handleDelete(e, product._id)} className='btn btn-ghost btn-xs text-error p-1'>
        <Trash2Icon className='size-5' />
    </button>
</div>

            </div>
        </Link>
    )

}

export default ProductCard
