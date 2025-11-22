import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: { type: String, required: true },
      admin: { type: Number, default: 0 },
      chef: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      zomato: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 }
    }
  ],
  totalRevenue: { type: Number, default: 0 },
  updatedBy: { type: String }, // employee/admin identifier
}, { timestamps: true });

export default mongoose.model("Inventory", InventorySchema);
