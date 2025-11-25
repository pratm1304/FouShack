import Inventory from "../models/Inventory.js";
import { formatDate } from "../utils/dateFormatter.js"

// Get today's inventory
export const getTodayInventory = async (req, res) => {
  try {
    const today = formatDate();
    const inventory = await Inventory.find({ date: today });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get yesterday inventory
export const getYesterdayInventory = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayDate = yesterday.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).replace(/ /g, ' ');

    const inventory = await Inventory.find({ date: yesterdayDate });

    res.json({ date: yesterdayDate, inventory });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Save/Update inventory for today
export const saveInventory = async (req, res) => {
  try {
    const { inventory } = req.body;
    const today = formatDate();
    const updates = [];

    for (const [productId, data] of Object.entries(inventory)) {
      const updated = await Inventory.findOneAndUpdate(
        { productId, date: today },
        {
          productId,
          date: today,
          admin: data.admin || 0,
          chef: data.chef || 0,
          sales: data.sales || 0,
          zomato: data.zomato || 0,
          yesterdayStock: data.yesterdayStock || 0,
        },
        { upsert: true, new: true }
      );
      updates.push(updated);
    }

    res.json({ message: "Inventory saved successfully", inventory: updates });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Save end-day: shift today's final stock into yesterdayStock
export const endDay = async (req, res) => {
  try {
    const { inventory } = req.body;
    const today = formatDate();

    for (const [productId, data] of Object.entries(inventory)) {
      await Inventory.findOneAndUpdate(
        { productId, date: today },
        {
          productId,
          date: today,
          admin: 0,
          chef: 0,
          sales: 0,
          zomato: 0,
          yesterdayStock: data.yesterdayStock,
        },
        { upsert: true }
      );
    }

    res.json({ success: true, message: "Day closed successfully" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
