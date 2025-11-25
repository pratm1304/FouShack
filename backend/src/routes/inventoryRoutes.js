import express from 'express';
import { getTodayInventory, getYesterdayInventory, saveInventory, endDay } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/today', getTodayInventory);
router.get('/yesterday', getYesterdayInventory);  // ✅ UNCOMMENT THIS
router.post('/save', saveInventory);
router.post('/end-day', endDay);

export default router;