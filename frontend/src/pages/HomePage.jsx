import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import axios from 'axios'
import toast from 'react-hot-toast'
import ProductCard from '../components/ProductCard'


const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async ()=> {
      try {
        const res = await axios.get("http://localhost:5001/admin")
        console.log(res.data);
        setProducts(res.data);
        
      } catch (error) {
        console.log("Error fetching products");
        
      } finally {
        setLoading(false)
      }
    }

    fetchProducts();
  }, [])

  return (
  <div className="min-h-screen">
    <Navbar />

    <div className="container mx-auto p-4 min-h-screen">
      {loading && <div className="text-center text-primary py-10">Loading Products...</div>}
      
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} setProducts={setProducts} />
          ))}
        </div>
      )}
    </div>
  </div>
)




}

export default HomePage