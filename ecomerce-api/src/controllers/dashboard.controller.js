import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import userModel from "../models/user.model.js";
import orderModel from "../models/order.model.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    // Nombre total
    const productsCount = await productModel.countDocuments();
    const categoriesCount = await categoryModel.find({ parent: null }).countDocuments();
    const usersCount = await userModel.countDocuments();
    const ordersCount = await orderModel.countDocuments();

    // Produits sous le seuil
    const lowStockProducts = await productModel.find({ $expr: { $lte: ["$stock", "$minStock"] } });

    // Produits périmés
    const today = new Date();
    const expiredProducts = await productModel.find({ expiryDate: { $lte: today } });

    // Commandes par statut
    const orderStatuses = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      productsCount,
      categoriesCount,
      usersCount,
      ordersCount,
      lowStockProducts,
      expiredProducts,
      orderStatuses,
    });
  } catch (error) {
    next(error);
  }
};
