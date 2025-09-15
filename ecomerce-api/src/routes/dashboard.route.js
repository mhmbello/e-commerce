import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

// Middleware admin si nécessaire
// import { verifyAdmin } from "../middleware/auth.middleware.js";

router.get("/dashboard", /*verifyAdmin,*/ getDashboardStats);

export default router;
