// Get today's inventory

import Inventory from "../models/Inventory.js";


export const getTodayInventory = async (req, res) => {
  try {
    const today = formatDate();

    const inventory = await Inventory.find({ date: today });

    if (inventory.length === 0) {
      return res.json([]);
    }

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};



// Get yesterday's inventory
export async function getYesterdayInventory(req, res) {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    
    const inventory = await Inventory.find({ date: yesterdayDate });
    res.json({ date: yesterdayDate, inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const saveYesterdayStock = async (req, res) => {
  try {
    const { yesterdayInventory } = req.body;

    for (const productId in yesterdayInventory) {
      await Inventory.findOneAndUpdate(
        { productId, date: new Date().toLocaleDateString("en-IN") },
        { yesterdayStock: yesterdayInventory[productId] },
        { upsert: true }
      );
    }

    res.json({ success: true, message: "End-day record saved." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error while saving end of day" });
  }
};


// Save/Update inventory
export async function saveInventory(req, res) {
  try {
    console.log("Received inventory from frontend:", req.body);

    const { inventory } = req.body;

    const today = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });

    const updates = [];
    
    for (const [productId, data] of Object.entries(inventory)) {
      const update = await Inventory.findOneAndUpdate(
        { productId, date: today },
        {
          productId,
          date: today,
          admin: data.admin || 0,
          chef: data.chef || 0,
          sales: data.sales || 0,
          zomato: data.zomato || 0,
          yesterdayStock: data.yesterdayStock || 0
        },
        { upsert: true, new: true }
      );
      updates.push(update);
    }

    res.json({ message: "Inventory saved successfully", inventory: updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

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


