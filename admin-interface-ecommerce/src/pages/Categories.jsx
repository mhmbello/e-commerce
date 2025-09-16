import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constant/constant";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState({ name: "", description: "", subCategories: [""] });

  // Charger les catégories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/category/test/with-product-count`);
      setCategories(res.data.payload || res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
    }
  };

  const openModal = (category = { name: "", description: "", subCategories: [""] }) => {
    setModalCategory({
      name: category.name || "",
      description: category.description || "",
      subCategories: category.subCategories || [""],
      _id: category._id || null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalCategory({ name: "", description: "", subCategories: [""] });
    setModalOpen(false);
  };

  // Ajouter ou modifier une sous-catégorie
  const handleSubCategoryChange = (index, value) => {
    const newSubs = [...modalCategory.subCategories];
    newSubs[index] = value;
    setModalCategory({ ...modalCategory, subCategories: newSubs });
  };

  const addSubCategoryField = () => {
    setModalCategory({ ...modalCategory, subCategories: [...modalCategory.subCategories, ""] });
  };

  const removeSubCategoryField = (index) => {
    const newSubs = modalCategory.subCategories.filter((_, i) => i !== index);
    setModalCategory({ ...modalCategory, subCategories: newSubs });
  };

  const saveCategory = async () => {
  try {
    if (modalCategory._id) {
      // Update existante (nom + description seulement)
      await axios.put(`${API_URL}/category/${modalCategory._id}`, {
        name: modalCategory.name,
        description: modalCategory.description,
      });

      setCategories(
        categories.map((c) =>
          c._id === modalCategory._id ? { ...c, ...modalCategory } : c
        )
      );
    } else {
      // Nouvelle catégorie principale
      const resMain = await axios.post(`${API_URL}/category`, {
        name: modalCategory.name,
        description: modalCategory.description,
        parent: null, // catégorie principale
      });

      const mainCategory = resMain.data.payload;
      let newCategories = [mainCategory];

      // Boucle pour créer les sous-catégories
      const subCategories = modalCategory.subCategories.filter((s) => s.trim() !== "");
      for (let subName of subCategories) {
        if (subName.trim() === "") continue;
        const resSub = await axios.post(`${API_URL}/category`, {
          name: subName,
          description: "",
          parent: mainCategory._id, // parent = catégorie principale
        });
        console.log(resSub.data.payload._id);
        //newCategories.push(resSub.data.payload);
      }
      setCategories([...categories, mainCategory]);
      window.location.reload();
    }

    closeModal();
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
  }
};



  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/category/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-bold">Gestion des Catégories</h2>

      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-sm text-white px-3 py-1 rounded mb-2"
      >
        Ajouter une catégorie
      </button>

      <table className="table-auto w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Nom</th>
            <th className="px-2 py-1">Description</th>
            <th className="px-2 py-1">Sous-Catégories</th>
            <th className="px-2 py-1">Nbre produits</th>
            <th className="px-2 py-1 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <tr key={cat._id} className="border-t">
                <td className="px-2 py-1">{index + 1}</td>
                <td className="px-2 py-1">{cat.name}</td>
                <td className="px-2 py-1">{cat.description || "-"}</td>
                <td className="px-2 py-1">
                  {cat.subCategories?.map((sub) => (
                    <span key={sub._id} className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full mr-1 text-xs">
                      {sub.name}
                    </span>
                  ))}
                </td>
                <td className="px-2 py-1">{cat.productCount || 0}</td>
                <td className="px-2 py-1 text-center flex justify-center gap-2">
                  <button
                    onClick={() => openModal(cat)}
                    className="text-blue-500 hover:text-blue-700 font-bold"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Aucune catégorie
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {modalCategory._id ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </h3>

            <input
              type="text"
              placeholder="Nom"
              value={modalCategory.name}
              onChange={(e) => setModalCategory({ ...modalCategory, name: e.target.value })}
              className="w-full border px-2 py-1 mb-3"
            />
            <textarea
              placeholder="Description"
              value={modalCategory.description}
              onChange={(e) => setModalCategory({ ...modalCategory, description: e.target.value })}
              className="w-full border px-2 py-1 mb-3"
            />

            {/* Sous-catégories */}
            <div className="mb-3">
              <label className="font-semibold">Sous-catégories :</label>
              {modalCategory.subCategories.map((sub, index) => (
                <div key={index} className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder={`Sous-catégorie #${index + 1}`}
                    value={sub}
                    onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                    className="flex-1 border px-2 py-1"
                  />
                  {modalCategory.subCategories.length > 1 && (
                    <button
                      onClick={() => removeSubCategoryField(index)}
                      className="px-2 bg-red-500 text-white rounded"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSubCategoryField}
                className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
              >
                Ajouter une sous-catégorie
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={saveCategory}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Categories;
