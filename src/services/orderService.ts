import { OrderRepository } from "../repositories/orderRepository";
import { ProductRepository } from "../repositories/productRepository";
import { sendOrderConfirmationEmail } from "../utils/sendEmails";
import { UserRepository } from "../repositories/userRepository";

export class OrderService {
  private orderRepo = new OrderRepository();
  private productRepo = new ProductRepository();
  private userRepo: UserRepository = new UserRepository();


  async placeOrder(
    customerId: string,
    role: string,
    items: { product: string; quantity: number }[]
  ) {
    if (role !== "Customer") throw new Error("Only customers can place orders");

    let totalPrice = 0;

    for (const item of items) {
      const product = await this.productRepo.getProductById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      totalPrice += product.price * item.quantity;
    }

    const order = await this.orderRepo.createOrder({
      customer: customerId,
      items,
      price: totalPrice,
    });

    const populatedOrder = await this.orderRepo.getOrderWithProductDetails(order._id.toString());
    const customer = await this.userRepo.findById(customerId);
    if (!customer) throw new Error("Customer not found");

    await sendOrderConfirmationEmail(customer.email, populatedOrder);
    return order;
  }

  async getOrdersByUser(userId: string, role: string) {
    if (role === "Customer") {
      const orders = await this.orderRepo.getCustomerOrders(userId);
      return orders.map(order => ({
        _id: order._id,
        items: order.items.map((item: any) => ({
          productName: item.product.name,
          quantity: item.quantity,
          status: item.status,
        })),
        price: order.price,
        createdAt: order.createdAt,
      }));
    }

    if (role === "ServiceProvider") {
      const orders = await this.orderRepo.getOrdersByServiceProvider(userId);
      return orders.map(order => ({
        _id: order._id,
        customer: (order.customer as any)?.email || "Unknown",
        items: order.items
          .filter((item: any) => item.product.serviceProvider?.toString() === userId)
          .map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
            status: item.status,
          })),
        createdAt: order.createdAt,
      }));
    }

    throw new Error("Unauthorized");
  }

  async updateProductStatus(
    orderId: string,
    productId: string,
    userId: string,
    role: string,
    status: "Pending" | "Shipped" | "Delivered"
  ) {
    const product = await this.productRepo.getProductByIdWithServiceProvider(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (role !== "ServiceProvider" || product.serviceProvider._id.toString() !== userId) {
      throw new Error("Unauthorized to update product status in this order");
    }

    const order = await this.orderRepo.getOrderWithProductDetails(orderId);
    if (!order) throw new Error("Order not found");

    const itemToUpdate = order.items.find(
      (item: any) =>
        item.product._id.toString() === productId &&
        item.product.serviceProvider.toString() === userId
    );

    if (!itemToUpdate) throw new Error("Product not found in your order scope");

    itemToUpdate.status = status;

    const updatedOrder = await this.orderRepo.saveOrder(order);

    const filteredItems = updatedOrder.items.filter(
      (item: any) => item.product.serviceProvider.toString() === userId
    );

    return {
      _id: updatedOrder._id,
      customer: updatedOrder.customer,
      price: updatedOrder.price,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      items: filteredItems.map((item: any) => ({
        _id: item._id,
        quantity: item.quantity,
        status: item.status,
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price
        }
      }))
    };
  }
}
