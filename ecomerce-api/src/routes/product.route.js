import express from "express";

import {
  handleAddProduct,
  handleAllProducts,
  handleRemoveProduct,
  handleSingleProduct,
  getProductById,
  handleUpdateProduct,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
const productRouter = express.Router();

productRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  isAdmin,
  handleAddProduct
);
productRouter.get("/all", handleAllProducts);
productRouter.get("/:id", handleSingleProduct);
productRouter.delete("/:id", isAdmin, handleRemoveProduct);
productRouter.get("/:id", getProductById);
productRouter.put(
  "/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  isAdmin,
  handleUpdateProduct
);
export default productRouter;
