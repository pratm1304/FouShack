import Product from "../models/Product.js";
import Order from "../models/orderModel.js"
import { cloudinary } from '../config.js/cloudinary.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function getAllProducts(_req, res){
    try {
        const products = await Product.find().sort({createdAt: -1});
        res.json(products);
    } catch (error) {
        res.json("Internal server error");
        console.log(error);
    }
};

export async function getProduct(req, res){
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.json("Internal server error");
        console.log(error);
    }
};

// ADD PRODUCT
export async function addProduct(req, res) {
  try {
    const { title, content, price } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({
      title,
      content,
      price,
      imageUrl: req.file.path, // Cloudinary URL
      cloudinaryId: req.file.filename // Store Cloudinary ID for deletion
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// UPDATE PRODUCT
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { title, content, price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If new image uploaded, delete old one from Cloudinary
    if (req.file) {
      if (product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      }
      product.imageUrl = req.file.path;
      product.cloudinaryId = req.file.filename;
    }

    product.title = title;
    product.content = content;
    product.price = price;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE PRODUCT
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary
    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


// export async function addProduct(req, res){
//     try {
//         const { title, content, price } = req.body;

//         // check if file exists
//         if(!req.file){
//             return res.status(400).json({ error: "Image file is required" });
//         }

//         const imageUrl = req.file.path; // multer uploaded file path

//         const newProduct = new Product({
//             title,
//             content,
//             price,
//             imageUrl
//         });

//         const addedProduct = await newProduct.save();
//         res.status(201).json(addedProduct);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export async function updateProduct(req, res){
//   try {
//     const { title, content, price } = req.body;

//     // prepare update object
//     const updateData = { title, content, price };

//     // agar new image upload hui ho, to imageUrl update karo
//     if(req.file){
//       updateData.imageUrl = req.file.path;
//     }

//     await Product.findByIdAndUpdate(req.params.id, updateData);
//     res.json({ message: "Product Updated Successfully." });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Product not found" });
//   }
// }


// export async function deleteProduct(req, res){
//     try {
//         await Product.findByIdAndDelete(req.params.id);
//         res.json({message: "Product Deleted Successfully."})
        
//     } catch (error) {
//         res.json("Product not found");
//         console.log(error);
//     }
// };

export async function getOrders(req, res){
  try {
    const orders = await Order.find().sort({createdAt:-1});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function sendOrder (req, res) {
  try {
    const { name, items, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({ name, items, totalAmount, status: "pending" });
    const saved = await order.save();
    console.log(saved)
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.log("error in sending order",err);
    res.status(500).json({ message: "Server error" });
  }
};

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE RAZORPAY ORDER
export async function createRazorpayOrder(req, res) {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ 
      message: "Failed to create payment order", 
      error: error.message 
    });
  }
}

// VERIFY PAYMENT AND SAVE ORDER
export async function verifyPaymentAndSaveOrder(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      items,
      totalAmount
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified - save order with 'paid' status
      const order = new Order({
        name,
        items,
        totalAmount,
        paymentStatus: 'paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      });

      await order.save();
      res.json({ 
        success: true, 
        message: "Payment verified and order placed successfully!",
        order 
      });
    } else {
      // Invalid signature
      res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment verification failed",
      error: error.message 
    });
  }
}