import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { AuthRequest } from "../interfaces";

const orderService = new OrderService();

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await orderService.placeOrder(req.user!.userId, req.user!.role, req.body.items);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user!.userId, req.user!.role);
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateOrderItemStatus = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.user); 
    const { orderId, productId } = req.params;
    const { status } = req.body;
    const updated = await orderService.updateProductStatus(
      orderId,
      productId,
      req.user!.userId,
      req.user!.role,
      status
    );
    res.json(updated);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
};
