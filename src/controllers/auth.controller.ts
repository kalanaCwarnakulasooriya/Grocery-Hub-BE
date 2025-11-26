import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../models/user.model"
import jwt from "jsonwebtoken"

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

    const user = await User.create({ name, email, password: hashedPassword })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

    res.cookie('token',token, {
      httpOnly: true,
      sequre: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ success: true, user: {name: user.name, email: user.email} })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}