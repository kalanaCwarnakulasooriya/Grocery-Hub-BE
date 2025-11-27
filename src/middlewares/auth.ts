import { NextFunction, Response, Request } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" })
  }

  try {
    const tokenDecoded = jwt.verify(token, JWT_SECRET)
    if(tokenDecoded.id) {
      req.body.userId = tokenDecoded.id
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({
      message: "Invalid or expire token"
    })
  }
}

export default authUser