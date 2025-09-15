import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la sous-catégorie est obligatoire"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category", // relation avec Category
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const subcategoryModel = mongoose.model("subcategory", subCategorySchema);

export default subcategoryModel;
