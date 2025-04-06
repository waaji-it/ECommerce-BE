import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await userService.register(name, email, password, role);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await userService.login(email, password);
    res.json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
