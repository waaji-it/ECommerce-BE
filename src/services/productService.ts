import { ProductRepository } from "../repositories/productRepository";
import { IProduct } from "../interfaces/index";

export class ProductService {
  private productRepository = new ProductRepository();

  async createProduct(
    name: string,
    price: number,
    description: string,
    stock: number,
    serviceProvider: string
  ): Promise<IProduct> {
    return await this.productRepository.createProduct({
      name,
      price,
      description,
      stock,
      serviceProvider: serviceProvider as any,
    });
  }

  async getAllProducts(search?: string, sort?: string, serviceProvider?: string) {
    return await this.productRepository.getAllProducts(search, sort, serviceProvider);
  }


  async updateProduct(productId: string, name: string, price: number, description: string, userId: string) {
    const product = await this.productRepository.getProductById(productId);
    if (!product) throw new Error("Product not found");
    if (product.serviceProvider.toString() !== userId) throw new Error("Unauthorized");

    return await this.productRepository.updateProduct(productId, { name, price, description });
  }

  async deleteProduct(productId: string, userId: string) {
    const product = await this.productRepository.getProductById(productId);
    if (!product) throw new Error("Product not found");
    if (product.serviceProvider.toString() !== userId) throw new Error("Unauthorized");

    return await this.productRepository.deleteProduct(productId);
  }
}
