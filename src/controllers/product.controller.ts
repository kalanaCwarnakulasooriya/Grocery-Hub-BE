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
      seller : req.user.sub
    })

    const product = await Product.findOne({ name })
    if (product) {
      return res.status(400).json({
        message: "Product already exist",
      })
    }

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

export const getAllProduct = async (req: AUthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) | 1
    const limit = parseInt(req.query.limit as string) | 10
    const skip = (page - 1) * limit
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Product.countDocuments()

    res.status(200).json({
      message: "Product Fetched Successfully",
      data: products,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Failed to fetch product",
    })
  }
}

export const getProductById = async (req: AUthRequest, res: Response) => {
  try {
    const productId = req.params.id as string | 1
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    res.status(200).json({
      message: "Product Fetched Successfully",
      data: product
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Failed to fetch product",
    })
  }
}

export const updateProduct = async (req: AUthRequest, res: Response) => {
  try {
    const productId = req.params.id as string | 1
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

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        offerPrice,
        category,
        inStock,
        image: imageURL,
      },
      { new: false }
    )

    res.status(200).json({
      message: "Product updated successfully",
      data: updateProduct
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Failed to update product",
    })
  }
}