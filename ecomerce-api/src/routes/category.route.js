import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesWithProductCount,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", createCategory);        // Créer une catégorie
router.get("/", getCategories);          // Lister toutes les catégories
router.get("/:id", getCategoryById);     // Récupérer une catégorie par ID
router.put("/:id", updateCategory);      // Modifier une catégorie
router.delete("/:id", deleteCategory);   // Supprimer une catégorie
router.get("/test/with-product-count", getCategoriesWithProductCount); // Lister les catégories avec le nombre de produits

export default router;
