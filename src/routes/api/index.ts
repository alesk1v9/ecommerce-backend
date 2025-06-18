import { Router } from "express";
import userRoutes from "./user-routes";
import authRoutes from "./auth-routes";
import productRoutes from "./product-routes";
import categoryRoutes from "./category-routes";
import orderRoutes from "./order-routes";
import checkoutRoutes from "./checkout-routes";
// import webhooksRoutes from "./webhook";

const router = Router();

// Import all routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/checkout", checkoutRoutes);
// router.use("/webhooks", webhooksRoutes);

export default router;