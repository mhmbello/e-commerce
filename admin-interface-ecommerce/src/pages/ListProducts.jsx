// forever-admin/src/pages/ListProducts.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../constant/constant";
import * as XLSX from "xlsx";

const ListProducts = () => {
  const [listProduct, setListProduct] = useState([]);
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
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      const res = await axios.delete(`${API_URL}/product/${id}`);
      if (res.data.success) {
        toast.success("Produit supprimé !");
        setListProduct(listProduct.filter((p) => p._id !== id));
      } else {
        toast.error(res.data.message || "Échec de la suppression");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression du produit");
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

      {/* Header du tableau */}
      <div className="grid grid-cols-8 col-span-1 items-center py-1 px-2 border border-gray-100 text-sm font-medium">
        <span>Images</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Seuil minimal</span>
        <span>Expiration date</span>
        <span className="text-center">Action</span>
      </div>

      {/* Liste des produits */}
      <div>
        {listProduct.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-8 col-span-1 items-center py-1 px-2 border border-gray-100 text-sm"
          >
            <img className="w-12" src={product.image[0]} alt={product.name} />
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>{product.price} €</p>

            <p>{product.stock} </p>

            <p>{product.minStock || 0}</p>
            <p>{product.expiryDate || "before-date"}</p>

            {/* Actions */}
            <p
              onClick={() => deleteProduct(product._id)}
              className="text-center cursor-pointer text-lg text-red-500"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ListProducts;