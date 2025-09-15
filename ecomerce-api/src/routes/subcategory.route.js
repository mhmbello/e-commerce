import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subcategory.controller.js";

const router = express.Router();

router.post("/", createSubCategory);        // Créer une sous-catégorie
router.get("/", getSubCategories);          // Lister toutes les sous-catégories
router.get("/:id", getSubCategoryById);     // Récupérer une sous-catégorie
router.put("/:id", updateSubCategory);      // Modifier une sous-catégorie
router.delete("/:id", deleteSubCategory);   // Supprimer une sous-catégorie

export default router;
