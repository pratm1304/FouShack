import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/customer/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
    navigate("/cart"); // optional: redirect to cart after adding
  };

  if (!product) return <div className="text-center py-10">Loading product...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="card md:flex shadow-md">
        <img
          src={`http://localhost:5001/${product.imageUrl}`}
          alt={product.title}
          className="w-full md:w-1/3 h-64 object-cover rounded-md"
        />
        <div className="card-body md:w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          <p className="text-gray-600 mb-4">{product.content}</p>
          <p className="text-lg font-semibold mb-4">₹ {product.price}</p>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary flex items-center gap-2"
          >
            <ShoppingCart className="size-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
