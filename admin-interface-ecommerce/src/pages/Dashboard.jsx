import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    usersCount: 0,
    ordersCount: 0,
    lowStockProducts: [],
    expiredProducts: [],
    orderStatuses: [],
  });

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:4001/api/admin/dashboard"); // Crée un endpoint dans ton backend
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  // Préparer les données pour les graphiques
  const orderStatusData = stats.orderStatuses.map((status) => ({
    name: status._id, // statut
    value: status.count,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Produits</h2>
          <p className="text-2xl font-bold">{stats.productsCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Catégories</h2>
          <p className="text-2xl font-bold">{stats.categoriesCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Utilisateurs</h2>
          <p className="text-2xl font-bold">{stats.usersCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Commandes</h2>
          <p className="text-2xl font-bold">{stats.ordersCount}</p>
        </div>
      </div>

      {/* Graphique des commandes par statut */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Commandes par statut</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderStatusData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value">
              {orderStatusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Produits sous le seuil et périmés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Produits sous le seuil */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Produits sous le seuil</h2>
          <ul className="list-disc pl-5 max-h-64 overflow-auto">
            {stats.lowStockProducts.map((p) => (
              <li
                key={p._id}
                className="cursor-pointer text-red-600 hover:underline"
                onClick={() => navigate("/list-products?filter=lowStock")}
              >
                {p.name} - Stock: {p.stock}
              </li>
            ))}
          </ul>
        </div>

        {/* Produits périmés */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Produits périmés</h2>
          <ul className="list-disc pl-5 max-h-64 overflow-auto">
            {stats.expiredProducts.map((p) => (
              <li
                key={p._id}
                className="cursor-pointer text-red-600 hover:underline"
                onClick={() => navigate("/list-products?filter=expired")}
              >
                {p.name} - Date de péremption:{" "}
                {new Date(p.expiryDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Graphique camembert pour les commandes par statut */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Commandes par statut (Pie)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
