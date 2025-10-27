// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ShoppingCart } from "lucide-react";
// import { useNavigate } from "react-router";

// const CustomerHome = () => {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("https://foushack.onrender.com/customer/")
//       .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
//       .catch(err => console.log(err));
//   }, []);

//   const handleAddToCart = (product) => {
//     const existing = cart.find(p => p._id === product._id);
//     let newCart;
//     if (existing) {
//       newCart = cart.map(p => 
//         p._id === product._id ? {...p, qty: (p.qty || 1) + 1} : p
//       );
//     } else {
//       newCart = [...cart, {...product, qty: 1}];
//     }
//     setCart(newCart);
//     localStorage.setItem("cart", JSON.stringify(newCart));
//   };

//   return (
//     <div className="container bg-purple-200 min-h-screen Cmx-auto p-4">
//       <h1 className="text-2xl text-center font-bold mb-6">Welcome to Fou Shack </h1>
//       <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map(p => (
//           <div key={p._id} className="card bg-base-100 shadow-md p-3">
//             <img src={p.imageUrl} alt={p.title} className="w-full rounded-md h-48 object-cover"/>
//             <h3 className="text-lg text-center font-semibold">{p.title}</h3>
//             <p className="text-gray-600 text-center">{p.content}</p>
//             <p className="font-bold mt-2 text-center">₹ {p.price}</p>
//             <button
//               onClick={() => handleAddToCart(p)}
//               className="btn btn-secondary mt-3 flex items-center gap-2"
//             >
//               <ShoppingCart className="size-4" /> 
//               {cart.find(item => item._id === p._id)?.qty 
//                 ? `Added (${cart.find(item => item._id === p._id).qty})` 
//                 : 'Add to Cart'}
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Cart Summary */}
//       {cart.length > 0 && (
//         <div className="fixed bottom-4 right-4 p-4 bg-white shadow-md rounded-lg w-64">
//           <p className="font-bold">Total Items: {cart.reduce((acc, item) => acc + (item.qty || 1), 0)}</p>
//           <p className="font-bold">Total Amount: ₹ {cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)}</p>
//           <button 
//             onClick={() => navigate("/customer/cart")} 
//             className="btn btn-success mt-2 w-full"
//           >
//             Go to Cart / Checkout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerHome;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { LucideShoppingBasket, ShoppingBagIcon, ShoppingBasketIcon, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://foushack.onrender.com/customer/")
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
  }, []);

  const handleAddToCart = (product) => {
    const existing = cart.find(p => p._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(p => 
        p._id === product._id ? {...p, qty: (p.qty || 1) + 1} : p
      );
    } else {
      newCart = [...cart, {...product, qty: 1}];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="container bg-purple-200 min-h-screen min-w-full mx-auto p-4 pb-40">
      <h1 className="text-3xl text-purple-700 text-center font-bold mb-6">Welcome to Fou Shack </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p._id} className="card shadow-lg rounded-lg overflow-hidden relative h-80">
            {/* Full Background Image */}
            <img 
              src={p.imageUrl} 
              alt={p.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Darker Gradient Overlay - increased darkness */}
            <div className="absolute rounded-3xl inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30"></div>
            
            {/* Content on Top */}
            <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
              <h3 className="text-xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{p.title}</h3>
              <p className="text-sm mb-3 line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">{p.content}</p>
              <p className="text-2xl font-bold mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">₹ {p.price}</p>
              <button
                onClick={() => handleAddToCart(p)}
                className="btn btn-secondary mx-auto mt-3 flex rounded-3xl items-center max-w-36 gap-2 font-bold"
              >
                <ShoppingCart className="size-4" /> 
                {cart.find(item => item._id === p._id)?.qty 
                  ? `Added (${cart.find(item => item._id === p._id).qty})` 
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 max-w-xs mx-auto rounded-3xl left-0 right-0 p-4 bg-purple-300  shadow-lg border-t z-50"> {/* Changed positioning */}
          <div className="container mx-auto max-w-md"> {/* Added container for centering */}
            <p className="font-bold text-center">Total Items : {cart.reduce((acc, item) => acc + (item.qty || 1), 0)}</p>
            <p className="font-bold text-center">Total Amount : ₹{cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)}</p>
            
            <div className="flex justify-center">
              <button 
                onClick={() => navigate("/customer/cart")} 
                className="btn w-32 text-white btn-success mt-2"
              >
                <ShoppingBagIcon className="size-4" />
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
