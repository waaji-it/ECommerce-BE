import { User } from "../models/userModel";
import { IUser } from "../interfaces/index";

export class UserRepository {
  async create(userData: Partial<IUser>) {
    return await User.create(userData);
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }
  
  async findById(userId: string) {
    return await User.findById(userId);
  }
}
