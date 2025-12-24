import Inventory from "../models/Inventory.js";

// Get inventory (no date needed - only one entry per product)
export const getTodayInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get yesterday stock from inventory
export const getYesterdayInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    
    res.json({ 
      date: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, ' '),
      inventory 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Save/Update inventory
export const saveInventory = async (req, res) => {
  try {
    const { inventory } = req.body;
    const updates = [];

    for (const [productId, data] of Object.entries(inventory)) {
      const updated = await Inventory.findOneAndUpdate(
        { productId },
        {
          productId,
          admin: Number(data.admin) || 0,
          chef: Number(data.chef) || 0,
          sales: Number(data.sales) || 0,
          zomato: Number(data.zomato) || 0,
          yesterdayStock: Number(data.yesterdayStock) || 0,
        },
        { upsert: true, new: true }
      );
      updates.push(updated);
    }

    res.json({ message: "Inventory saved successfully", inventory: updates });
  } catch (error) {
    console.error("Save inventory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// End day - move total to yesterdayStock, reset everything else to 0
export const endDay = async (req, res) => {
  try {
    const { inventory } = req.body;

    for (const [productId, data] of Object.entries(inventory)) {
      await Inventory.findOneAndUpdate(
        { productId },
        {
          yesterdayStock: Number(data.yesterdayStock), // already FINAL stock
          admin: 0,
          chef: 0,
          sales: 0,
          zomato: 0,
        },
        { new: true, upsert: true }
      );
    }

    res.json({ success: true, message: "✔ Stock successfully rolled to next day" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};



