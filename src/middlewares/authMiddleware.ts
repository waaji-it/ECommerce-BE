import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthRequest } from '../interfaces/index';
import { User } from '../models/userModel';
import { IUser } from '../interfaces/index';

dotenv.config();

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId).select("-password") as IUser | null;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    req.user = {
      userId: String(user._id),
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

