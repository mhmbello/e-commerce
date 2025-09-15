// forever-admin/src/pages/Update.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../constant/constant";

const Update = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer le produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/product/${id}`, {
          headers: { token },
        });
        if (res.data.success) {
          setProductData(res.data.payload);
        } else {
          toast.error(res.data.message || "Produit introuvable");
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setProductData({ ...productData, [name]: files[0] });
    } else if (type === "checkbox") {
      setProductData({ ...productData, [name]: checked });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const toggleSize = (size) => {
    setProductData((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token not found. Please login again.");
      return;
    }

    if (productData.price < 0) {
      toast.error("Le prix ne peut pas être négatif");
      return;
    }
    if (productData.stock < 0 || productData.minStock < 0) {
      toast.error("Le stock et le seuil minimal ne peuvent pas être négatifs");
      return;
    }

    try {
      const formData = new FormData();
      ["image1", "image2", "image3", "image4"].forEach((img) => {
        if (productData[img] instanceof File) {
          formData.append(img, productData[img]);
        }
      });
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("bestseller", productData.bestseller);
      formData.append("sizes", JSON.stringify(productData.sizes));
      formData.append("stock", productData.stock);
      formData.append("minStock", productData.minStock);
      if (productData.expiryDate) formData.append("expiryDate", productData.expiryDate);

      const res = await axios.put(`${API_URL}/product/${id}`, formData, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success("Produit mis à jour !");
        navigate("/list-products");
      } else {
        toast.error(res.data.message || "Échec de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Erreur lors de la mise à jour du produit";
      toast.error(message);
    }
  };
  if (loading) return <p>Chargement...</p>;
  if (!productData) return <p>Produit non trouvé</p>;

  return (
    <main>
      <form
        onSubmit={handleUpdate}
        className="flex flex-col w-full items-start gap-3"
      >
        {/* Upload Images */}
        <div>
          <p className="mb-2 font-medium text-sm">Upload Images</p>
          <div className="flex gap-2">
            {["image1", "image2", "image3", "image4"].map((image, index) => (
              <label key={index} htmlFor={image}>
                <img
                  className="w-20 h-20 object-cover"
                  src={
                    productData[image] instanceof File
                      ? URL.createObjectURL(productData[image])
                      : productData[image] // si déjà en URL depuis la DB
                  }
                  alt="upload area"
                />
                <input
                  name={image}
                  type="file"
                  id={image}
                  hidden
                  onChange={handleChange}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Product Name</p>
          <input
            name="name"
            type="text"
            placeholder="Type here"
            value={productData.name}
            onChange={handleChange}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Product Description</p>
          <textarea
            name="description"
            placeholder="Write product description"
            value={productData.description}
            onChange={handleChange}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
          <div>
            <p className="mb-2 font-medium text-sm">Product Category</p>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Product SubCategory</p>
            <select
              name="subCategory"
              value={productData.subCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Product Price</p>
            <input
              name="price"
              type="number"
              placeholder="25SR"
              value={productData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Stock & Péremption */}
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
          <div>
            <p className="mb-2 font-medium text-sm">Stock</p>
            <input
              name="stock"
              type="number"
              placeholder="Ex: 50"
              value={productData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Seuil minimal</p>
            <input
              name="minStock"
              type="number"
              placeholder="Ex: 5"
              value={productData.minStock}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Date de péremption</p>
            <input
              name="expiryDate"
              type="date"
              value={productData.expiryDate || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2 font-medium text-sm">Product Sizes</p>
          <div className="flex gap-2.5">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <p
                key={size}
                className={`cursor-pointer font-semibold py-1 px-3 border rounded ${
                  productData.sizes?.includes(size)
                    ? "bg-orange-300 text-white"
                    : "bg-slate-200"
                }`}
                onClick={() => toggleSize(size)}
              >
                {size}
              </p>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            name="bestseller"
            id="bestseller"
            checked={productData.bestseller}
            onChange={handleChange}
          />
          <label htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button
          type="submit"
          className="uppercase bg-black text-white px-3 py-3 rounded mt-3"
        >
          Update Product
        </button>
      </form>
    </main>
  );
};

export default Update;
