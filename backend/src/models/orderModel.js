import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true }, // NEW
  address: { // NEW
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, default: 1 }
    }
  ],
  totalAmount: { type: Number, required: true },

  // Payment fields
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;