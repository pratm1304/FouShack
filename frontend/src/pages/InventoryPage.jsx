

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link, useLocation } from 'react-router';
// import { ArrowLeft, Plus, Minus, Package, Save, RefreshCw, Calendar } from 'lucide-react';
// import toast from 'react-hot-toast';
// import API_URL from '../config/api';

// const InventoryPage = () => {
//   const [products, setProducts] = useState([]);
//   const [inventory, setInventory] = useState({});
//   const [yesterdayInventory, setYesterdayInventory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const location = useLocation();

//   // Check if user is admin based on route
//   const isAdmin = location.pathname.includes('/admin');

//   useEffect(() => {
//     fetchProducts();
//     loadYesterdayData();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const endpoint = isAdmin ? `${API_URL}/admin` : `${API_URL}/customer`;
//       const res = await axios.get(endpoint);
//       setProducts(res.data);

//       // Initialize inventory from localStorage or default to 0
//       const savedInventory = JSON.parse(localStorage.getItem('inventory')) || {};
//       const initialInventory = {};

//       res.data.forEach(product => {
//         initialInventory[product._id] = savedInventory[product._id] || {
//           admin: 0,
//           chef: 0,
//           sales: 0
//         };
//       });

//       setInventory(initialInventory);
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadYesterdayData = () => {
//     const yesterday = JSON.parse(localStorage.getItem('yesterdayInventory')) || {};
//     setYesterdayInventory(yesterday);
//   };

//   const updateQuantity = (productId, category, operation) => {
//     // If not admin and trying to update admin column, prevent it
//     if (!isAdmin && category === 'admin') {
//       toast.error("Only admin can update this column!");
//       return;
//     }

//     setInventory(prev => {
//       const current = prev[productId]?.[category] || 0;
//       const newValue = operation === 'inc' 
//         ? current + 1 
//         : Math.max(0, current - 1);

//       return {
//         ...prev,
//         [productId]: {
//           ...prev[productId],
//           [category]: newValue
//         }
//       };
//     });
//   };

//   const handleSave = () => {
//     setSaving(true);
//     try {
//       localStorage.setItem('inventory', JSON.stringify(inventory));
//       toast.success("Inventory saved successfully! 💾");
//     } catch (error) {
//       toast.error("Failed to save inventory");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     if (window.confirm('Are you sure you want to reset all inventory to 0?')) {
//       const resetInventory = {};
//       products.forEach(product => {
//         resetInventory[product._id] = {
//           admin: 0,
//           chef: 0,
//           sales: 0
//         };
//       });
//       setInventory(resetInventory);
//       localStorage.setItem('inventory', JSON.stringify(resetInventory));
//       toast.success("Inventory reset successfully!");
//     }
//   };

//   const handleEndDay = () => {
//     if (window.confirm('End current day and move data to yesterday? This will reset today\'s inventory.')) {
//       // Save current inventory as yesterday's data
//       localStorage.setItem('yesterdayInventory', JSON.stringify(inventory));

//       // Reset current inventory
//       const resetInventory = {};
//       products.forEach(product => {
//         resetInventory[product._id] = {
//           admin: 0,
//           chef: 0,
//           sales: 0
//         };
//       });
//       setInventory(resetInventory);
//       setYesterdayInventory(inventory);
//       localStorage.setItem('inventory', JSON.stringify(resetInventory));

//       toast.success("Day ended! Yesterday's data saved.");
//     }
//   };

//   const getTotalForProduct = (productId) => {
//     const inv = inventory[productId] || { admin: 0, chef: 0, sales: 0 };
//     return inv.chef - inv.sales;
//   };

//   const getYesterdayTotal = (productId) => {
//     const inv = yesterdayInventory[productId] || { admin: 0, chef: 0, sales: 0 };
//     return inv.admin + inv.chef + inv.sales;
//   };

//   const getGrandTotal = () => {
//     return products.reduce((total, product) => {
//       return total + getTotalForProduct(product._id);
//     }, 0);
//   };

//   // Add this function after getGrandTotal()
//     const getTotalSalesToday = () => {
//     return products.reduce((totalSales, product) => {
//         const yesterdayTotal = getYesterdayTotal(product._id);
//         const todayTotal = getTotalForProduct(product._id);
//         const salesCount = yesterdayTotal - todayTotal;
//         return totalSales + (salesCount > 0 ? salesCount : 0);
//     }, 0);
//     };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 relative overflow-hidden">
//       {/* Decorative Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
//         <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
//         <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2"></div>
//       </div>

//       <div className="container relative z-10 mx-auto p-4 md:p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//           <Link 
//             to={isAdmin ? "/admin" : "/customer"}
//             className="inline-flex items-center gap-2 bg-white hover:bg-purple-50 text-purple-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
//           >
//             <ArrowLeft className="size-5" />
//             <span>Back to Products</span>
//           </Link>

//           <div className="flex gap-3">
//             {isAdmin && (
//               <>
//                 <button
//                   onClick={handleEndDay}
//                   className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
//                 >
//                   <Calendar className="size-5" />
//                   <span className="hidden sm:inline">End Day</span>
//                 </button>

//                 <button
//                   onClick={handleReset}
//                   className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
//                 >
//                   <RefreshCw className="size-5" />
//                   <span className="hidden sm:inline">Reset</span>
//                 </button>
//               </>
//             )}

//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
//             >
//               <Save className="size-5" />
//               <span>{saving ? 'Saving...' : 'Save'}</span>
//             </button>
//           </div>
//         </div>

//         {/* Title */}
//         <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-3 text-white">
//               <Package className="size-8 md:size-10" />
//               <div>
//                 <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif">Inventory Management</h1>
//                 <p className="text-purple-100 text-sm md:text-base">Track quantities for Admin, Chef, and Sales</p>
//               </div>
//             </div>
//             <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
//               <p className="text-sm font-medium">Items Remaining</p>
//               <p className="text-3xl font-bold">{getGrandTotal()}</p>
//             </div>

//             <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
//               <p className="text-sm font-medium">Total Sales</p>
//               <p className="text-3xl font-bold">{getTotalSalesToday()}</p>
//             </div>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
//               <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-pink-400 rounded-full animate-spin animation-delay-150"></div>
//             </div>
//             <p className="mt-6 text-purple-700 font-semibold text-lg animate-pulse">
//               Loading products...
//             </p>
//           </div>
//         )}

//         {/* Inventory Table */}
//         {!loading && products.length > 0 && (
//           <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
//             {/* Desktop Table */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
//                   <tr>
//                     <th className="px-6 py-4 text-left font-bold text-lg">Product Name</th>
//                     <th className="px-6 py-4 text-center font-bold text-lg">Yesterday</th>
//                     <th className="px-6 py-4 text-center font-bold text-lg">Admin</th>
//                     <th className="px-6 py-4 text-center font-bold text-lg">Chef</th>
//                     <th className="px-6 py-4 text-center font-bold text-lg">Sales</th>
//                     <th className="px-6 py-4 text-center font-bold text-lg">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((product, index) => (
//                     <tr 
//                       key={product._id}
//                       className={`border-b border-purple-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}`}
//                     >
//                       <td className="px-6 py-4">
//                         <div className="font-semibold text-purple-900 text-lg">{product.title}</div>
//                       </td>

//                       {/* Yesterday Column */}
//                       <td className="px-6 py-4">
//                         <div className="text-center">
//                           <span className="font-bold text-xl text-gray-700">
//                             {getYesterdayTotal(product._id)}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Admin Column */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-3">
//                           <button
//                             onClick={() => updateQuantity(product._id, 'admin', 'dec')}
//                             disabled={!isAdmin}
//                             className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
//                               isAdmin 
//                                 ? 'bg-red-100 hover:bg-red-200' 
//                                 : 'bg-gray-200 cursor-not-allowed opacity-50'
//                             }`}
//                           >
//                             <Minus className={`size-5 ${isAdmin ? 'text-red-600' : 'text-gray-400'}`} />
//                           </button>
//                           <span className="font-bold text-xl text-purple-900 min-w-[3rem] text-center">
//                             {inventory[product._id]?.admin || 0}
//                           </span>
//                           <button
//                             onClick={() => updateQuantity(product._id, 'admin', 'inc')}
//                             disabled={!isAdmin}
//                             className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
//                               isAdmin 
//                                 ? 'bg-green-100 hover:bg-green-200' 
//                                 : 'bg-gray-200 cursor-not-allowed opacity-50'
//                             }`}
//                           >
//                             <Plus className={`size-5 ${isAdmin ? 'text-green-600' : 'text-gray-400'}`} />
//                           </button>
//                         </div>
//                       </td>

//                       {/* Chef Column */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-3">
//                           <button
//                             onClick={() => updateQuantity(product._id, 'chef', 'dec')}
//                             className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
//                           >
//                             <Minus className="size-5 text-red-600" />
//                           </button>
//                           <span className="font-bold text-xl text-purple-900 min-w-[3rem] text-center">
//                             {inventory[product._id]?.chef || 0}
//                           </span>
//                           <button
//                             onClick={() => updateQuantity(product._id, 'chef', 'inc')}
//                             className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
//                           >
//                             <Plus className="size-5 text-green-600" />
//                           </button>
//                         </div>
//                       </td>

//                       {/* Sales Column */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-3">
//                           <button
//                             onClick={() => updateQuantity(product._id, 'sales', 'dec')}
//                             className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
//                           >
//                             <Minus className="size-5 text-red-600" />
//                           </button>
//                           <span className="font-bold text-xl text-purple-900 min-w-[3rem] text-center">
//                             {inventory[product._id]?.sales || 0}
//                           </span>
//                           <button
//                             onClick={() => updateQuantity(product._id, 'sales', 'inc')}
//                             className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
//                           >
//                             <Plus className="size-5 text-green-600" />
//                           </button>
//                         </div>
//                       </td>

//                       {/* Total Column */}
//                       <td className="px-6 py-4">
//                         <div className="text-center">
//                           <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg px-4 py-2 rounded-full">
//                             {getTotalForProduct(product._id)}
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-purple-100">
//                   <tr>
//                     <td className="px-6 py-4 font-bold text-purple-900 text-lg">Grand Total</td>
//                     <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
//                       {products.reduce((sum, p) => sum + getYesterdayTotal(p._id), 0)}
//                     </td>
//                     <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
//                       {products.reduce((sum, p) => sum + (inventory[p._id]?.admin || 0), 0)}
//                     </td>
//                     <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
//                       {products.reduce((sum, p) => sum + (inventory[p._id]?.chef || 0), 0)}
//                     </td>
//                     <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
//                       {products.reduce((sum, p) => sum + (inventory[p._id]?.sales || 0), 0)}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="inline-block bg-gradient-to-r from-purple-700 to-pink-600 text-white font-bold text-xl px-6 py-3 rounded-full shadow-lg">
//                         {getGrandTotal()}
//                       </span>
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>

//             {/* Mobile Cards */}
//             <div className="md:hidden space-y-4 p-4">
//               {products.map((product) => (
//                 <div key={product._id} className="bg-white rounded-2xl shadow-lg p-4 border-2 border-purple-100">
//                   <h3 className="font-bold text-lg text-purple-900 mb-4">{product.title}</h3>

//                   {/* Yesterday */}
//                   <div className="mb-4 pb-4 border-b-2 border-purple-200">
//                     <p className="text-sm text-gray-600 font-semibold mb-2">Yesterday's Total:</p>
//                     <div className="text-center">
//                       <span className="text-3xl font-bold text-gray-700">
//                         {getYesterdayTotal(product._id)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Admin */}
//                   <div className="mb-3">
//                     <p className="text-sm text-purple-600 font-semibold mb-2">Admin {!isAdmin && '🔒'}</p>
//                     <div className="flex items-center justify-between">
//                       <button
//                         onClick={() => updateQuantity(product._id, 'admin', 'dec')}
//                         disabled={!isAdmin}
//                         className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                           isAdmin 
//                             ? 'bg-red-100 hover:bg-red-200' 
//                             : 'bg-gray-200 cursor-not-allowed opacity-50'
//                         }`}
//                       >
//                         <Minus className={`size-5 ${isAdmin ? 'text-red-600' : 'text-gray-400'}`} />
//                       </button>
//                       <span className="font-bold text-2xl text-purple-900">
//                         {inventory[product._id]?.admin || 0}
//                       </span>
//                       <button
//                         onClick={() => updateQuantity(product._id, 'admin', 'inc')}
//                         disabled={!isAdmin}
//                         className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                           isAdmin 
//                             ? 'bg-green-100 hover:bg-green-200' 
//                             : 'bg-gray-200 cursor-not-allowed opacity-50'
//                         }`}
//                       >
//                         <Plus className={`size-5 ${isAdmin ? 'text-green-600' : 'text-gray-400'}`} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Chef */}
//                   <div className="mb-3">
//                     <p className="text-sm text-purple-600 font-semibold mb-2">Chef</p>
//                     <div className="flex items-center justify-between">
//                       <button
//                         onClick={() => updateQuantity(product._id, 'chef', 'dec')}
//                         className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
//                       >
//                         <Minus className="size-5 text-red-600" />
//                       </button>
//                       <span className="font-bold text-2xl text-purple-900">
//                         {inventory[product._id]?.chef || 0}
//                       </span>
//                       <button
//                         onClick={() => updateQuantity(product._id, 'chef', 'inc')}
//                         className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center"
//                       >
//                         <Plus className="size-5 text-green-600" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Sales */}
//                   <div className="mb-3">
//                     <p className="text-sm text-purple-600 font-semibold mb-2">Sales</p>
//                     <div className="flex items-center justify-between">
//                       <button
//                         onClick={() => updateQuantity(product._id, 'sales', 'dec')}
//                         className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
//                       >
//                         <Minus className="size-5 text-red-600" />
//                       </button>
//                       <span className="font-bold text-2xl text-purple-900">
//                         {inventory[product._id]?.sales || 0}
//                       </span>
//                       <button
//                         onClick={() => updateQuantity(product._id, 'sales', 'inc')}
//                         className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center"
//                       >
//                         <Plus className="size-5 text-green-600" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Total */}
//                   <div className="pt-3 border-t border-purple-200">
//                     <div className="flex items-center justify-between">
//                       <span className="text-purple-700 font-semibold">Total:</span>
//                       <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg px-4 py-2 rounded-full">
//                         {getTotalForProduct(product._id)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && products.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center border-2 border-purple-100">
//               <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
//                 <Package className="size-12 text-purple-500" />
//               </div>
//               <h3 className="text-2xl font-bold text-purple-900 mb-3">No Products Yet</h3>
//               <p className="text-purple-600">Add products to start managing inventory!</p>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animation-delay-150 {
//           animation-delay: 150ms;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default InventoryPage;



// ========================================================================================================================

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router';
import { ArrowLeft, Plus, Minus, Package, Save, RefreshCw, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState({});
    const [yesterdayInventory, setYesterdayInventory] = useState({});
    const [yesterdayDate, setYesterdayDate] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const location = useLocation();

    // Check if user is admin based on route
    const isAdmin = location.pathname.includes('/admin');

    useEffect(() => {
        fetchProducts();
        loadYesterdayData();
        updateDateTime();

        // Update time every second
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const updateDateTime = () => {
        const now = new Date();
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        setCurrentDateTime(now.toLocaleString('en-IN', options));
    };

    const fetchProducts = async () => {
        try {
            const endpoint = isAdmin ? `${API_URL}/admin` : `${API_URL}/customer`;
            const res = await axios.get(endpoint);
            setProducts(res.data);

            // Initialize inventory from localStorage or default to 0
            const savedInventory = JSON.parse(localStorage.getItem('inventory')) || {};
            const initialInventory = {};

            res.data.forEach(product => {
                initialInventory[product._id] = savedInventory[product._id] || {
                    admin: 0,
                    chef: 0,
                    sales: 0,
                    zomato: 0
                };
            });

            setInventory(initialInventory);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const loadYesterdayData = () => {
        const yesterday = JSON.parse(localStorage.getItem('yesterdayInventory')) || {};
        const savedDate = localStorage.getItem('yesterdayDate') || '';
        setYesterdayInventory(yesterday);
        setYesterdayDate(savedDate);
    };

    const updateQuantity = (productId, category, operation) => {
        // If not admin and trying to update admin column, prevent it
        if (!isAdmin && category === 'admin') {
            toast.error("Only admin can update this column!");
            return;
        }

        setInventory(prev => {
            const current = prev[productId]?.[category] || 0;
            const newValue = operation === 'inc'
                ? current + 1
                : Math.max(0, current - 1);

            return {
                ...prev,
                [productId]: {
                    ...prev[productId],
                    [category]: newValue
                }
            };
        });
    };

    const handleSave = () => {
        setSaving(true);
        try {
            localStorage.setItem('inventory', JSON.stringify(inventory));
            toast.success("Inventory saved successfully! 💾");
        } catch (error) {
            toast.error("Failed to save inventory");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all inventory to 0?')) {
            const resetInventory = {};
            products.forEach(product => {
                resetInventory[product._id] = {
                    admin: 0,
                    chef: 0,
                    sales: 0,
                    zomato: 0
                };
            });
            setInventory(resetInventory);
            localStorage.setItem('inventory', JSON.stringify(resetInventory));
            toast.success("Inventory reset successfully!");
        }
    };

    const handleEndDay = () => {
    if (window.confirm('End current day and move data to yesterday? This will reset today\'s inventory.')) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        // **SAVE FINAL STOCK**
        const finalStock = {};
        products.forEach(product => {
            finalStock[product._id] = getTotalForProduct(product._id);
        });

        localStorage.setItem('yesterdayInventory', JSON.stringify(finalStock));
        localStorage.setItem('yesterdayDate', dateStr);

        // RESET TODAY’S INPUTS
        const resetInventory = {};
        products.forEach(product => {
            resetInventory[product._id] = { admin: 0, chef: 0, sales: 0, zomato: 0 };
        });

        setInventory(resetInventory);
        setYesterdayInventory(finalStock);
        setYesterdayDate(dateStr);
        localStorage.setItem('inventory', JSON.stringify(resetInventory));

        toast.success("Day ended! Yesterday stock saved & frozen.");
    }
};


    const getTotalForProduct = (productId) => {
    const baseStock = getYesterdayTotal(productId);
    const inv = inventory[productId] || { chef: 0, sales: 0, zomato: 0 };

    return baseStock + Number(inv.chef || 0) - Number(inv.sales || 0) - Number(inv.zomato || 0);
};



    const getYesterdayTotal = (productId) => {
    return Number(yesterdayInventory[productId]) || 0;
};


    const getGrandTotal = () => {
        return products.reduce((total, product) => {
    const val = Number(getTotalForProduct(product._id)) || 0;
    return total + val;
}, 0);

    };

    const getTotalSalesToday = () => {
    return products.reduce((totalRevenue, product) => {
        const salesCount = (inventory[product._id]?.sales || 0);
        const zomatoCount = (inventory[product._id]?.zomato || 0);
const price = Number(product.price) || 0;
const revenue = (salesCount + zomatoCount) * price;
        return totalRevenue + revenue;
    }, 0);
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2"></div>
            </div>

            <div className="container relative z-10 mx-auto p-4 md:p-6">
                {/* Date/Time Badge at Top */}
                <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
                        <div className="flex items-center gap-2">
                            <Clock className="size-5" />
                            <span className="font-bold text-base md:text-lg">{currentDateTime}</span>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <Link
                        to={isAdmin ? "/admin" : "/customer"}
                        className="inline-flex items-center gap-2 bg-white hover:bg-purple-50 text-purple-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <ArrowLeft className="size-5" />
                        <span>Back to Products</span>
                    </Link>

                    <div className="flex gap-3 flex-wrap">
                        {isAdmin && (
                            <>
                                <button
                                    onClick={handleEndDay}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Calendar className="size-5" />
                                    <span className="hidden sm:inline">End Day</span>
                                </button>

                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    <RefreshCw className="size-5" />
                                    <span className="hidden sm:inline">Reset</span>
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            <Save className="size-5" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                    </div>
                </div>

                {/* Title */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3 text-white">
                            <Package className="size-8 md:size-10" />
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif">Fou Shack Production</h1>
                                <p className="text-purple-100 text-sm md:text-base">Track quantities for Admin, Chef, and Sales</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
                                <p className="text-sm font-medium">Items Remaining</p>
                                <p className="text-3xl font-bold">{getGrandTotal()}</p>
                            </div>

                            <div className="bg-green-500/30 backdrop-blur-sm rounded-2xl px-6 py-3 text-white border-2 border-white/30">
                                <p className="text-sm font-medium">Total Sales Today</p>
                                <p className="text-3xl font-bold">₹{getTotalSalesToday()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-pink-400 rounded-full animate-spin animation-delay-150"></div>
                        </div>
                        <p className="mt-6 text-purple-700 font-semibold text-lg animate-pulse">
                            Loading products...
                        </p>
                    </div>
                )}

                {/* Inventory Table */}
                {!loading && products.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-lg">Product Name</th>
                                        <th className="px-6 py-4 text-center font-bold text-lg">
                                            Stock
                                            {yesterdayDate && <div className="text-xs font-normal text-purple-100 mt-1">{yesterdayDate}</div>}
                                        </th>
                                        <th className="px-6 py-4 text-center font-bold text-lg">Admin</th>
                                        <th className="px-6 py-4 text-center font-bold text-lg">Chef</th>
                                        <th className="px-6 py-4 text-center font-bold text-lg">Sales</th>
                                        <th className="px-6 py-4 text-center font-bold text-lg">Zomato</th>
                                        <th className="px-6 py-4 text-center font-bold text-lg">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr
                                            key={product._id}
                                            className={`border-b border-purple-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-purple-900 text-lg">{product.title}</div>
                                            </td>

                                            {/* Yesterday Column */}
                                            <td className="px-6 py-4">
                                                <div className="text-center">
                                                    <span className="font-bold text-xl text-gray-700">
                                                        {getYesterdayTotal(product._id)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Admin Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'admin', 'dec')}
                                                        disabled={!isAdmin}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAdmin
                                                            ? 'bg-red-100 hover:bg-red-200'
                                                            : 'bg-gray-200 cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        <Minus className={`size-5 ${isAdmin ? 'text-red-600' : 'text-gray-400'}`} />
                                                    </button>
                                                    <span className="font-bold text-xl text-purple-900 min-w-[3rem] text-center">
                                                        {inventory[product._id]?.admin || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'admin', 'inc')}
                                                        disabled={!isAdmin}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAdmin
                                                            ? 'bg-green-100 hover:bg-green-200'
                                                            : 'bg-gray-200 cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        <Plus className={`size-5 ${isAdmin ? 'text-green-600' : 'text-gray-400'}`} />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Chef Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'chef', 'dec')}
                                                        className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="size-5 text-red-600" />
                                                    </button>
                                                    <span className="font-bold text-xl text-purple-900 min-w-[3rem] text-center">
                                                        {inventory[product._id]?.chef || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'chef', 'inc')}
                                                        className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="size-5 text-green-600" />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Sales Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'sales', 'dec')}
                                                        className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="size-5 text-red-600" />
                                                    </button>
                                                    <span className="font-bold text-xl text-purple-900 min-w-[3rem] text-center">
                                                        {inventory[product._id]?.sales || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'sales', 'inc')}
                                                        className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="size-5 text-green-600" />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Zomato Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'zomato', 'dec')}
                                                        className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="size-5 text-red-600" />
                                                    </button>
                                                    <span className="font-bold text-xl text-purple-900 min-w-[3rem] text-center">
                                                        {inventory[product._id]?.zomato || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 'zomato', 'inc')}
                                                        className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="size-5 text-green-600" />
                                                    </button>
                                                </div>
                                            </td>



                                            {/* Total Column */}
                                            <td className="px-6 py-4">
                                                <div className="text-center">
                                                    <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg px-4 py-2 rounded-full">
                                                        {getTotalForProduct(product._id)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-purple-100">
                                    <tr>
                                        <td className="px-6 py-4 font-bold text-purple-900 text-lg">Grand Total</td>
                                        <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
                                            {products.reduce((sum, p) => sum + getYesterdayTotal(p._id), 0)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
                                            {products.reduce((sum, p) => sum + (inventory[p._id]?.admin || 0), 0)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
                                            {products.reduce((sum, p) => sum + (inventory[p._id]?.chef || 0), 0)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
                                            {products.reduce((sum, p) => sum + (inventory[p._id]?.sales || 0), 0)}
                                        </td>

                                        <td className="px-6 py-4 text-center font-bold text-purple-900 text-xl">
                                            {products.reduce((sum, p) => sum + (inventory[p._id]?.zomato || 0), 0)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block bg-gradient-to-r from-purple-700 to-pink-600 text-white font-bold text-xl px-6 py-3 rounded-full shadow-lg">
                                                {getGrandTotal()}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4 p-4">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-2xl shadow-lg p-4 border-2 border-purple-100">
                                    <h3 className="font-bold text-lg text-purple-900 mb-4">{product.title}</h3>

                                    {/* Yesterday */}
                                    <div className="mb-4 pb-4 border-b-2 border-purple-200">
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Yesterday's Total:</p>
                                        {yesterdayDate && <p className="text-xs text-gray-500 mb-2">{yesterdayDate}</p>}
                                        <div className="text-center">
                                            <span className="text-3xl font-bold text-gray-700">
                                                {getYesterdayTotal(product._id)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Admin */}
                                    <div className="mb-3">
                                        <p className="text-sm text-purple-600 font-semibold mb-2">Admin {!isAdmin && '🔒'}</p>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => updateQuantity(product._id, 'admin', 'dec')}
                                                disabled={!isAdmin}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin
                                                    ? 'bg-red-100 hover:bg-red-200'
                                                    : 'bg-gray-200 cursor-not-allowed opacity-50'
                                                    }`}
                                            >
                                                <Minus className={`size-5 ${isAdmin ? 'text-red-600' : 'text-gray-400'}`} />
                                            </button>
                                            <span className="font-bold text-2xl text-purple-900">
                                                {inventory[product._id]?.admin || 0}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product._id, 'admin', 'inc')}
                                                disabled={!isAdmin}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin
                                                    ? 'bg-green-100 hover:bg-green-200'
                                                    : 'bg-gray-200 cursor-not-allowed opacity-50'
                                                    }`}
                                            >
                                                <Plus className={`size-5 ${isAdmin ? 'text-green-600' : 'text-gray-400'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Chef */}
                                    <div className="mb-3">
                                        <p className="text-sm text-purple-600 font-semibold mb-2">Chef</p>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => updateQuantity(product._id, 'chef', 'dec')}
                                                className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
                                            >
                                                <Minus className="size-5 text-red-600" />
                                            </button>
                                            <span className="font-bold text-2xl text-purple-900">
                                                {inventory[product._id]?.chef || 0}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product._id, 'chef', 'inc')}
                                                className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center"
                                            >
                                                <Plus className="size-5 text-green-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sales */}
                                    <div className="mb-3">
                                        <p className="text-sm text-purple-600 font-semibold mb-2">Sales</p>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => updateQuantity(product._id, 'sales', 'dec')}
                                                className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
                                            >
                                                <Minus className="size-5 text-red-600" />
                                            </button>
                                            <span className="font-bold text-2xl text-purple-900">
                                                {inventory[product._id]?.sales || 0}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product._id, 'sales', 'inc')}
                                                className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center"
                                            >
                                                <Plus className="size-5 text-green-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Zomato */}
                                    <div className="mb-3">
                                        <p className="text-sm text-purple-600 font-semibold mb-2">Zomato</p>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => updateQuantity(product._id, 'zomato', 'dec')}
                                                className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
                                            >
                                                <Minus className="size-5 text-red-600" />
                                            </button>
                                            <span className="font-bold text-2xl text-purple-900">
                                                {inventory[product._id]?.zomato || 0}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product._id, 'zomato', 'inc')}
                                                className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center"
                                            >
                                                <Plus className="size-5 text-green-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="pt-3 border-t border-purple-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-purple-700 font-semibold">Total:</span>
                                            <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg px-4 py-2 rounded-full">
                                                {getTotalForProduct(product._id)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center border-2 border-purple-100">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <Package className="size-12 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-purple-900 mb-3">No Products Yet</h3>
                            <p className="text-purple-600">Add products to start managing inventory!</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
        </div>
    );
};

export default InventoryPage;