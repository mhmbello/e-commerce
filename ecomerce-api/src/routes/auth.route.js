import express from "express";
import {
  handleAdminLogin,
  handleLogin,
  handleRegister,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", handleRegister);
userRouter.post("/login", handleLogin);
userRouter.post("/admin", handleAdminLogin);
userRouter.get("/all", getAllUsers);
userRouter.delete("/:id", deleteUser);

export default userRouter;
