import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log("Server is running");
})