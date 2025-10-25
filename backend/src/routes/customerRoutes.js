import { getOrders, sendOrder, getAllProducts } from "../controllers/appControllers.js";
import express from "express"

const router = express.Router();
// Orders related
router.get("/", getAllProducts);
router.get("/order", getOrders);      // GET orders
router.post("/order", sendOrder);     // POST new order

export default router