import express from "express";
import { isAuth, login, logout, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";

const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/is-auth", authenticate, isAuth)
userRouter.get("/logout",authenticate, logout)

export default userRouter