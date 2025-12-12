import { Router } from "express";
import { upload } from "../middlewares/upload";
import { addProduct, getAllProduct, getProductById } from "../controllers/product.controller";
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

router.get(
  "/all",
  requireRole([Role.ADMIN, Role.SELLER]),
  getAllProduct
)

router.get(
  "/:id",
  requireRole([Role.ADMIN, Role.SELLER]),
  getProductById
)

export default router;
