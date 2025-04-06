import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/index";

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
  serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});
export const Product = mongoose.model<IProduct>("Product", productSchema);
