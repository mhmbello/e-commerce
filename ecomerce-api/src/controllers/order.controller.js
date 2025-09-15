import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import createError from "http-errors";
import { successResponse } from "./response.controller.js";
import { sendEmail } from "../utils/sendEmail.js";

const currency = "GNF";
const delivery_chage = 10;

const placeOrder = async (req, res, next) => {
  try {
    const { userId, address, amount, items } = req.body;

    // 🔥 On prépare les items pour l'ordre
    const orderItems = items.map((item) => ({
      productId: item._id,     // on prend l’_id du produit
      name: item.name,         // optionnel si tu veux garder le nom dans la commande
      size: item.size,
      quantity: item.quantity,
      price: item.price,       // optionnel, pour figer le prix au moment de l’achat
    }));
    console.log("ORDER ITEMS ::::::::::::", orderItems);

    const lowStockProducts = [];
    // 🔥 Mise à jour du stock pour chaque produit
    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (!product) continue;

      if (product.stock < item.quantity) {
        console.log(`Stock insuffisant pour ${product.name}`);
        console.log("STOCK ACTUEL ::::::::::::", product.stock);
        console.log("QUANTITÉ DEMANDÉE ::::::::::::", item.quantity);
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.name}`,
        });
      }
      product.stock -= item.quantity;
      await product.save();
      // Vérifier le seuil minimal
      // Vérifier le seuil minimal
      if (product.stock <= product.minStock) {
        lowStockProducts.push({
          name: product.name,
          stock: product.stock,
        });
      }
    }

    // Si certains produits ont un stock faible, envoyer un e-mail
    if (lowStockProducts.length > 0) {
      const productList = lowStockProducts
        .map(p => `- ${p.name}: Stock actuel ${p.stock}`)
        .join("\n");

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Alerte stock faible`,
        text: `Les produits suivants ont atteint le seuil minimal de stock :\n\n${productList}`,
        html: `<p>Les produits suivants ont atteint le seuil minimal de stock :</p><ul>${lowStockProducts.map(p => `<li>${p.name}: Stock actuel ${p.stock}</li>`).join("")}</ul>`,
      });
    }

    // 🔥 Création de la commande
    const orderData = {
      items: orderItems,
      address,
      amount,
      userId,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    await orderModel.create(orderData);

    // 🔥 Vider le panier utilisateur
    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });

    return successResponse(res, {
      statusCode: 200,
      message: "Commande passée avec succès",
    });
  } catch (error) {
    console.error("Erreur placeOrder :::", error);
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find();

    return successResponse(res, {
      statusCode: 200,
      message: "All orders return successfully",
      payload: orders,
    });
  } catch (error) {
    next(error);
  }
};

const userOrders = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });

    return successResponse(res, {
      statusCode: 200,
      message: "All orders return successfully",
      payload: orders,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    return successResponse(res, {
      statusCode: 200,
      message: "status updated",
    });
  } catch (error) {
    next(error);
  }
};


export {
  placeOrder,
  getAllOrders,
  userOrders,
  updateOrderStatus,
};
