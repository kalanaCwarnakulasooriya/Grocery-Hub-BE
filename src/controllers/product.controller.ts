import cloudinary from "../config/cloudinary"
import Product from "../models/product"

export const addProduct = async (req: any, res: any) => {
  try {
    let productData = JSON.parse(req.body.productData)

    const images = req.files

    let imagesUrl = await Promise.all(
      images.map(async (item: any) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        })
        return result.secure_url
      })
    )

    await Product.create({...productData, image: imagesUrl})

    res.status(200).json({
      message: "Product added successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const productList = async (req: any, res: any) => {
  
}

export const productById = async (req: any, res: any) => {

}

export const changeStock = async (req: any, res: any) => {

}