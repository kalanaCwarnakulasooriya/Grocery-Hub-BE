import { Router } from "express";
import { upload } from "../middlewares/upload";
import { addProduct } from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { Role } from "../models/auth.model";

const router = Router();

router.post(
  "/add",
  authenticate,
  requireRole([Role.ADMIN, Role.SELLER]),
  upload.single("image"),
  addProduct
)

export default router;
