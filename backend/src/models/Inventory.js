import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  admin: {
    type: Number,
    default: 0
  },
  chef: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  zomato: {
    type: Number,
    default: 0
  },
  yesterdayStock: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);