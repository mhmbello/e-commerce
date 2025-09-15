import subcategoryModel from "../models/subcategory.model.js";
import categoryModel from "../models/category.model.js";

// Créer une sous-catégorie
export const createSubCategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Vérifier si la catégorie existe
    const categoryExist = await categoryModel.findById(category);
    if (!categoryExist) {
      return res.status(404).json({ success: false, message: "Catégorie non trouvée" });
    }

    const subCategory = await subcategoryModel.create({ name, description, category });
    res.status(201).json({ success: true, payload: subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lister toutes les sous-catégories (avec le nom de la catégorie)
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await subcategoryModel.find().populate("category", "name");
    res.status(200).json({ success: true, payload: subCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer une sous-catégorie par ID
export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await subcategoryModel.findById(req.params.id).populate("category", "name");
    if (!subCategory) {
      return res.status(404).json({ success: false, message: "Sous-catégorie introuvable" });
    }
    res.status(200).json({ success: true, payload: subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour une sous-catégorie
export const updateSubCategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (category) {
      const categoryExist = await categoryModel.findById(category);
      if (!categoryExist) {
        return res.status(404).json({ success: false, message: "Catégorie non trouvée" });
      }
    }

    const subCategory = await subcategoryModel.findByIdAndUpdate(
      req.params.id,
      { name, description, category },
      { new: true }
    );

    if (!subCategory) {
      return res.status(404).json({ success: false, message: "Sous-catégorie introuvable" });
    }

    res.status(200).json({ success: true, payload: subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une sous-catégorie
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await subcategoryModel.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ success: false, message: "Sous-catégorie introuvable" });
    }
    res.status(200).json({ success: true, message: "Sous-catégorie supprimée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
