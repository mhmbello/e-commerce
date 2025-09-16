//  admin/src/pages/Users.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../constant/constant";
import * as XLSX from "xlsx";

const Users = () => {
  const [listUsers, setListUsers] = useState([]);
  console.log("LIST USERS :::::::::::::", listUsers);

  // Récupération des utilisateurs depuis ton backend
  const fetchListUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/users-with-orders`);
      if (res.data.success) {
        setListUsers(res.data.payload);
      } else {
        toast.error(res.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users. Check console.");
    }
  };

  // Suppression d’un utilisateur
  const deleteUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const res = await axios.delete(`${API_URL}/user/${id}`);
      if (res.data.success) {
        toast.success("Utilisateur supprimé !");
        setListUsers(listUsers.filter((u) => u._id !== id));
      } else {
        toast.error(res.data.message || "Échec de la suppression");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  // Export CSV
  const exportCSV = () => {
    const rows = listUsers.map((u) => ({
      Nom: u.name,
      Email: u.email,
      Commandes: u.orders?.length || 0,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nom,Email,Role,Commandes", ...rows.map((r) => `${r.Nom},${r.Email},${r.Role},${r.Commandes}`)].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "utilisateurs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      listUsers.map((u) => ({
        Nom: u.name,
        Email: u.email,
        Commandes: u.orders?.length || 0,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Utilisateurs");
    XLSX.writeFile(workbook, "utilisateurs.xlsx");
  };

  useEffect(() => {
    fetchListUsers();
  }, []);

  return (
    <main className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Tous les utilisateurs</p>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-blue-500 text-white px-3 py-1 rounded">
            Export CSV
          </button>
          <button onClick={exportExcel} className="bg-green-500 text-white px-3 py-1 rounded">
            Export Excel
          </button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <table className="table-auto w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Email</th>
            <th className="px-2 py-1">Nbre de commande</th>
            <th className="px-2 py-1">Créé le</th>
            <th className="px-2 py-1 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {listUsers.map((user, index) => (
            
            <tr key={user._id} className="border-t">
              <td className="px-2 py-1">{index + 1}</td>
              <td className="px-2 py-1">{user.name}</td>
              <td className="px-2 py-1">{user.email}</td>
              <td className="px-2 py-1">{user.orderCount || 0}</td>
              <td className="px-2 py-1">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-2 py-1 text-center">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Users;
