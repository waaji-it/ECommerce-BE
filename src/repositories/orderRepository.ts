import { Order } from "../models/orderModel";

export class OrderRepository {
  async createOrder(data: any) {
    return await Order.create(data);
  }

  async getOrderById(id: string) {
    return await Order.findById(id).populate("items.product");
  }

  async getCustomerOrders(customerId: string) {
    return await Order.find({ customer: customerId }).populate("items.product");
  }

  async getOrdersByServiceProvider(providerId: string) {
    const orders = await Order.find().populate("items.product customer");
    return orders.filter(order =>
      order.items.some((item: any) => item.product.serviceProvider?.toString() === providerId)
    );
  }

  async getOrderWithProductDetails(orderId: string) {
    return await Order.findById(orderId).populate("items.product", "name price");
  }

  async saveOrder(order: any) {
    return await order.save();
  }
}
