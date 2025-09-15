// forever-admin/src/pages/ListProducts.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../constant/constant";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");

const ListProducts = () => {
  const [listProduct, setListProduct] = useState([]);
  const navigate = useNavigate();
  console.log("LIST PRODUCTS :::::::::::::", listProduct)

  // Récupération des produits depuis ton backend
  const fetchListProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/all`);
      if (res.data.success) {
        setListProduct(res.data.payload);
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching products. Check console.");
    }
  };

  // Mise à jour du stock
  const updateStock = async (id, newStock) => {
    try {
      const res = await axios.put(`${API_URL}/product/${id}`, { stock: newStock });
      if (res.data.success) {
        toast.success("Stock mis à jour !");
        fetchListProducts(); // rafraîchir la liste
      } else {
        toast.error(res.data.message || "Erreur de mise à jour");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du stock");
    }
  };

  // Suppression d’un produit
  const deleteProduct = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        const res = await axios.delete(`${API_URL}/product/${id}`, {
          headers: { token },
        });
        if (res.data.success) {
          toast.success("Produit supprimé !");
          setListProduct(listProduct.filter((product) => product._id !== id));
        } else {
          toast.error("Erreur lors de la suppression");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Export CSV
  const exportCSV = () => {
    const rows = listProduct.map((p) => ({
      Nom: p.name,
      Catégorie: p.category,
      Prix: p.price,
      Stock: p.stock,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nom,Catégorie,Prix,Stock", ...rows.map((r) => `${r.Nom},${r.Catégorie},${r.Prix},${r.Stock}`)].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "produits.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      listProduct.map((p) => ({
        Nom: p.name,
        Catégorie: p.category,
        Prix: p.price,
        Stock: p.stock,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produits");
    XLSX.writeFile(workbook, "produits.xlsx");
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  return (
    <main className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">All Products List</p>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-blue-500 text-white px-3 py-1 rounded">
            Export CSV
          </button>
          <button onClick={exportExcel} className="bg-green-500 text-white px-3 py-1 rounded">
            Export Excel
          </button>
        </div>
      </div>

      <table className="table-auto w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-2 py-1">Images</th>
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Category</th>
            <th className="px-2 py-1">Price</th>
            <th className="px-2 py-1">Stock</th>
            <th className="px-2 py-1">Seuil minimal</th>
            <th className="px-2 py-1">Expiration date</th>
            <th className="px-2 py-1 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {listProduct.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                Aucun produit
              </td>
            </tr>
          ) : (
            listProduct.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-2 py-1">
                  <img
                    className="w-12"
                    src={product.image?.[0] || "/default-product.png"}
                    alt={`Image de ${product.name}`}
                  />
                </td>
                <td className="px-2 py-1">{product.name}</td>
                <td className="px-2 py-1">{product.category}</td>
                <td className="px-2 py-1">{product.price} €</td>
                <td className="px-2 py-1">{product.stock}</td>
                <td className="px-2 py-1">{product.minStock || 0}</td>
                <td className="px-2 py-1">{product.expiryDate || "before-date"}</td>
                <td className="px-2 py-1 text-center">
                  <button className="text-blue-500 mr-4" onClick={() => navigate(`/update-product/${product._id}`)}>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default ListProducts;