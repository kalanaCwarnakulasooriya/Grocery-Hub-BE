import mongoose, { Document, Schema } from "mongoose"

export enum Role {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  USER = "USER"
}
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  cartItem: object
  roles: Role[]
}

const userSchema = new Schema<IUser>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String, required: true},
  roles: { type: [String], enum: Object.values(Role), default: [Role.USER] },
  cartItem: {type: Object, default: {}}
}, {minimize: false})

export const User = mongoose.model<IUser>("User", userSchema)