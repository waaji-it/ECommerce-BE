import { Document, Types } from "mongoose";
import mongoose from "mongoose";
import { Request } from "express";

export interface Order {
  _id: string | Types.ObjectId;
  price: number;
  items: OrderItem[];
}

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "Customer" | "ServiceProvider" | "Admin";
}

export interface IOrder {
  customer: string | mongoose.Types.ObjectId;
  items: { product: string; quantity: number }[];
  price: number;
  status: "Pending" | "Shipped" | "Delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  stock: number;
  serviceProvider: mongoose.Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}
