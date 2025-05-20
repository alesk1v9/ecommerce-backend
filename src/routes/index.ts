import { Router } from "express";
import apiRouter from "./api";

const router = Router();
// Import all routes
router.use("/api", apiRouter);

export default router;