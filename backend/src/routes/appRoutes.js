import { getOrders, getProduct, sendOrder, getAllProducts, createRazorpayOrder,
  verifyPaymentAndSaveOrder } from "../controllers/appControllers.js";
import express from "express"

const router = express.Router();

// 🔥 SPECIFIC ROUTES FIRST (before /:id)
router.get("/order", getOrders);                    // GET orders
router.post("/order", sendOrder);                   // POST new order
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyPaymentAndSaveOrder);

// Products - general route first
router.get("/", getAllProducts);

// 🔥 DYNAMIC ROUTES LAST (/:id catches everything)
router.get("/:id", getProduct);                     // GET single product

export default router;