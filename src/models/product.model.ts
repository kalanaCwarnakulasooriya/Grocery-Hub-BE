import mongoose, { Document, Schema } from "mongoose"

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  description: string
  seller: mongoose.Types.ObjectId // for userId
  price: number
  offerPrice: number
  image?: string[]
  category?: string[]
  inStock?: boolean
  createdAt?: Date
  updatedAt?: Date
}

const productSchema = new Schema<IProduct>({
  name: {type: String, required: true},
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: {type: String, required: true},
  price: {type: Number, required: true},
  offerPrice: {type: Number, required: true},
  image: { type: [String], required: true },
  category: { type: [String], required: true },
  inStock: {type: Boolean, default: true}
}, { timestamps: true })

export const Product = mongoose.model<IProduct>("Product", productSchema)