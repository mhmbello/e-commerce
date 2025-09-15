import cron from "node-cron";
import { checkProductAlerts } from "./controllers/alert.controller.js";

// Cron job : tous les jours à 8h du matin
// Format : 'minute hour day month dayOfWeek'
// test rapidement : '*/30 * * * *' => chaque 30 secondes
cron.schedule("*/30 * * * *", async () => {
  console.log("Vérification des produits...");
  await checkProductAlerts();
});
