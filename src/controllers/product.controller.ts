import { Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import { AUthRequest } from "../middlewares/auth"
import { Product } from "../models/product.model"

export const addProduct = async (req: AUthRequest, res: Response) => {
  try {
    const { name, description, price, offerPrice, category, inStock } = req.body
    
    let imageURL = ""

    if (req.file) {
      const result: any = await new Promise((resole, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) {
              return reject(error)
            }
            resole(result) // success return
          }
        )
        upload_stream.end(req.file?.buffer)
      })
      imageURL = result.secure_url
    }

    const newProduct = new Product({
      name,
      description,
      price,
      offerPrice,
      category,
      inStock,
      image: imageURL,
      seller : req.user._id
    })

    await newProduct.save()
    
    res.status(201).json({
      message: "Product added successfully",
      data: newProduct
    })
  } catch (error) {
    console.error(error)
    if ((error as any ).code === 11000) {
      return res.status(400).json({
        message: "Product already exist",
      })
    }
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const productList = async (req: any, res: any) => {
  try {
    const products = await Product.find()
    res.status(200).json({
      message: "Product list",
      data: products
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const productById = async (req: any, res: any) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json({
      message: "Product list",
      data: product
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const changeStock = async (req: any, res: any) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json({
      message: "Product list",
      data: product
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}