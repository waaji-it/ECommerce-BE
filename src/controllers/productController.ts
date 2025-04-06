import { Response } from "express";
import { AuthRequest } from "../interfaces/index";
import { ProductService } from "../services/productService";

const productService = new ProductService();

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ServiceProvider") {
      res.status(403).json({ error: "Access denied: Only Service Providers can create products" });
      return;
    }

    const { name, price, description, stock } = req.body;

    if (!req.user || !req.user.userId) {
      res.status(401).json({ error: "Unauthorized: No user found in request" });
      return;
    }

    const serviceProviderId = req.user.userId;

    const product = await productService.createProduct(name, price, description, stock, serviceProviderId);

    res.status(201).json(product);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { search, sort } = req.query;

    if (!req.user || !req.user.userId || !req.user.role) {
      res.status(401).json({ error: "Unauthorized: No user found in request" });
      return;
    }

    let serviceProvider: string | undefined = undefined;

    if (req.user.role === "ServiceProvider") {
      serviceProvider = req.user.userId;
    }

    const products = await productService.getAllProducts(
      search as string,
      sort as string,
      serviceProvider
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    return
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, description } = req.body;
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user?.userId as string;
    const { id } = req.params;

    const updatedProduct = await productService.updateProduct(id, name, price, description, userId);
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user?.userId as string;
    const { id } = req.params;

    await productService.deleteProduct(id, userId);
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
