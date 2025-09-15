import categoryModel from "../models/category.model.js";

// Créer une catégorie ou sous-catégorie
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    const exist = await categoryModel.findOne({ name });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "Catégorie déjà existante" });
    }

    const category = await categoryModel.create({ name, description, parent: parent || null });
    res.status(201).json({ success: true, payload: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lister toutes les catégories principales et leurs sous-catégories
export const getCategories = async (req, res) => {
  try {
    // Récupère toutes les catégories principales
    const categories = await categoryModel.find({ parent: null }).lean();

    // Pour chaque catégorie principale, récupère ses sous-catégories
    for (let cat of categories) {
      const subs = await categoryModel.find({ parent: cat._id }).lean();
      cat.subCategories = subs; // ajoute un champ subCategories
    }

    res.status(200).json({ success: true, payload: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Récupérer une catégorie par ID avec ses sous-catégories
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ success: false, message: "Catégorie introuvable" });
    }

    const subCategories = await categoryModel.find({ parent: category._id }).lean();
    res.status(200).json({ success: true, payload: { ...category, subCategories } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { name, description, parent: parent || null },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Catégorie introuvable" });
    }

    res.status(200).json({ success: true, payload: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une catégorie (et ses sous-catégories)
export const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Catégorie introuvable" });
    }

    // Supprimer également toutes les sous-catégories
    await categoryModel.deleteMany({ parent: category._id });

    res.status(200).json({ success: true, message: "Catégorie et sous-catégories supprimées" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
