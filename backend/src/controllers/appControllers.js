import Product from "../models/Product.js";
import Order from "../models/orderModel.js"

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


export async function addProduct(req, res){
    try {
        const { title, content, price } = req.body;

        // check if file exists
        if(!req.file){
            return res.status(400).json({ error: "Image file is required" });
        }

        const imageUrl = req.file.path; // multer uploaded file path

        const newProduct = new Product({
            title,
            content,
            price,
            imageUrl
        });

        const addedProduct = await newProduct.save();
        res.status(201).json(addedProduct);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export async function updateProduct(req, res){
  try {
    const { title, content, price } = req.body;

    // prepare update object
    const updateData = { title, content, price };

    // agar new image upload hui ho, to imageUrl update karo
    if(req.file){
      updateData.imageUrl = req.file.path;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: "Product Updated Successfully." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Product not found" });
  }
}


export async function deleteProduct(req, res){
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({message: "Product Deleted Successfully."})
        
    } catch (error) {
        res.json("Product not found");
        console.log(error);
    }
};

export async function getOrders(req, res){
  try {
    const orders = await Order.find();
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