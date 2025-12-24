import { getOrders, getProduct, sendOrder, getAllProducts, createRazorpayOrder,
  verifyPaymentAndSaveOrder } from "../controllers/appControllers.js";
import express from "express"

const router = express.Router();

// 🔥 SPECIFIC ROUTES FIRST
router.get("/orders", getOrders);                   // Changed from "/order" to "/orders"
router.post("/order", sendOrder);                   // POST new order
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyPaymentAndSaveOrder);

// Products
router.get("/", getAllProducts);                    // GET all products
router.get("/:id", getProduct);                     // GET single product (LAST!)

export default router;