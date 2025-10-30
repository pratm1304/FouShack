import { getOrders, getProduct, sendOrder, getAllProducts, createRazorpayOrder,
  verifyPaymentAndSaveOrder } from "../controllers/appControllers.js";
import express from "express"

const router = express.Router();
// Orders related
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.get("/order", getOrders);      // GET orders
router.post("/order", sendOrder);     // POST new order


// Razorpay routes (ADD THESE)
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyPaymentAndSaveOrder);


export default router