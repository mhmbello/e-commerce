import productModel from "../../models/product.model.js";
import { sendEmail } from "../../utils/sendEmail.js";

export const checkProductAlerts = async () => {
  const today = new Date();

  // Produits périmés
  const expiredProducts = await productModel.find({
    expiryDate: { $lte: today },
  });

  // Produits avec stock faible
  const lowStockProducts = await productModel.find({
    $expr: { $lte: ["$stock", "$minStock"] },
  });

  if (expiredProducts.length === 0 && lowStockProducts.length === 0) return;

  // Préparer le contenu de l’email
  let text = "";
  let html = "";

  if (expiredProducts.length > 0) {
    text += "Produits périmés :\n" + expiredProducts.map(p => `- ${p.name} (Exp: ${p.expiryDate.toDateString()})`).join("\n") + "\n\n";
    html += "<p>Produits périmés :</p><ul>" + expiredProducts.map(p => `<li>${p.name} (Exp: ${p.expiryDate.toDateString()})</li>`).join("") + "</ul>";
  }

  if (lowStockProducts.length > 0) {
    text += "Produits avec stock faible :\n" + lowStockProducts.map(p => `- ${p.name} (Stock: ${p.stock})`).join("\n");
    html += "<p>Produits avec stock faible :</p><ul>" + lowStockProducts.map(p => `<li>${p.name} (Stock: ${p.stock})</li>`).join("") + "</ul>";
  }

  // Envoyer l’email
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "Alertes produits : stock faible / périmé",
    text,
    html,
  });

  console.log("Alertes envoyées pour les produits périmés ou en stock faible");
};
