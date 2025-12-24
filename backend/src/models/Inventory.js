import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  yesterdayStock: { type: Number, default: 0 },
  admin: { type: Number, default: 0 },
  chef: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  zomato: { type: Number, default: 0 }
}, { timestamps: true });

const inventory = mongoose.model("inventory", inventorySchema);
export default inventory;