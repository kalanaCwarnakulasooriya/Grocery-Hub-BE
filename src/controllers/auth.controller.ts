import { Request, Response } from "express"
import { IUser, Role, User } from "../models/user.model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details. All fields are required" })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) 
      return res.status(400).json({ success: false, message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    })

    const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "7d"})

    res.cookie('token',token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ 
      success: true, 
      user: {name: user.name, email: user.email} 
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    })
  }
}


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" })
    }

    const user = await User.findOne({ email })

    if (!user) 
      return res.status(400).json({ success: false, message: "Invalid email or password" })

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) 
      return res.status(400).json({ success: false, message: "Invalid email or password" })

    const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "7d"})

    res.cookie('token',token, {
      httpOnly: true, // Prevent TypeScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time
    })

    return res.status(200).json({ 
      success: true, 
      user: {name: user.name, email: user.email} 
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    })
  }
}


export const isAuth = async (req:Request, res:Response) => {
  try{
    const { userId } = req.body
    const user = await User.findById(userId).select("-password")
    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ 
      success: false, 
      message: error.message
    })
  }
}


export const logout = async (req:Request, res:Response) => {
  try{
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    return res.json({ success: true, message: "Logged Out" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ 
      success: false, 
      message: error.message
    })
  }
}