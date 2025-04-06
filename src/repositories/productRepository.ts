import { Product } from "../models/productModel";
import { IProduct } from "../interfaces/index";

export class ProductRepository {

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    return await Product.create(productData);
  }
  async getAllProducts(search?: string, sort?: string, serviceProvider?: string) {
    let query = Product.find();

    if (serviceProvider) {
      query = query.where("serviceProvider").equals(serviceProvider);
    }

    if (search) {
      query = query.where("name", new RegExp(search, "i"));
    }

    if (sort === "priceAsc") query = query.sort({ price: 1 });
    if (sort === "priceDesc") query = query.sort({ price: -1 });
    if (sort === "nameAsc") query = query.sort({ name: 1 });
    if (sort === "nameDesc") query = query.sort({ name: -1 });

    return await query.exec();
  }

  async getProductById(productId: string) {
    return await Product.findById(productId);
  }

  async updateProduct(productId: string, updateData: Partial<IProduct>) {
    return await Product.findByIdAndUpdate(productId, updateData, { new: true });
  }

  async deleteProduct(productId: string) {
    return await Product.findByIdAndDelete(productId);
  }
  async getProductByIdWithServiceProvider(productId: string) {
    return await Product.findById(productId).populate("serviceProvider");
  }
}
