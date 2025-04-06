import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.get("/", authMiddleware, getAllProducts);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
