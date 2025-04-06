import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/userRepository";

import dotenv from 'dotenv';
dotenv.config();

export class UserService {
  private userRepository = new UserRepository();

  async register(name: string, email: string, password: string, role: "Customer" | "ServiceProvider" | "Admin") {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.create({ name, email, password: hashedPassword, role });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Invalid credentials");

    return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
  }
}
