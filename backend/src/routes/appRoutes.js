import express from "express"
import { getAllProducts,getProduct,getOrders, addProduct , updateProduct, deleteProduct } from "../controllers/appControllers.js";
import { upload } from "../middleware/upload.js"; // multer middleware

const router = express.Router();
router.get("/", getAllProducts);
router.get("/orders", getOrders);
router.get("/:id", getProduct);
router.post("/", upload.single("image"), addProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;