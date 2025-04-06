import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { placeOrder, getOrders, updateOrderItemStatus } from "../controllers/orderController";

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getOrders);
router.patch("/:orderId/product/:productId", authMiddleware, updateOrderItemStatus);

export default router;
