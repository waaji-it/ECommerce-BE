import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/index";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Customer", "ServiceProvider", "Admin"], default: "Customer" },
});

export const User = mongoose.model<IUser>("User", userSchema);
