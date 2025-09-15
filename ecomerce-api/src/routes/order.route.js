import express from "express";
import { isAdmin } from "../middlewares/admin.middleware.js";
import {
  getAllOrders,
  placeOrder,
  updateOrderStatus,
  userOrders,
} from "../controllers/order.controller.js";
import { isAuthorized } from "../middlewares/auth.js";

const orderRouter = express.Router();
// admin feature
orderRouter.get("/list", isAdmin, getAllOrders);
orderRouter.put("/status", isAdmin, updateOrderStatus);
// payment feature
orderRouter.post("/place", isAuthorized, placeOrder);

// user
orderRouter.get("/user-orders", isAuthorized, userOrders);

export default orderRouter;
