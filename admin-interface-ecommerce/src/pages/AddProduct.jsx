//  admin/src/pages/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../constant/constant";

const AddProduct = ({ token }) => {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/category`);
        const mainCategories = res.data.payload.filter(c => !c.parent); // uniquement principales
        setCategories(mainCategories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false,
    stock: 0,
    minStock: 5,
    expiryDate: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const setProductValue = (e) => {
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
    setProductData((prevData) => {
      const sizes = prevData.sizes.includes(size)
        ? prevData.sizes.filter((s) => s !== size)
        : [...prevData.sizes, size];
      return { ...prevData, sizes };
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token not found. Please login again.");
      return;
    }

    try {
      const appendData = new FormData();
      ["image1", "image2", "image3", "image4"].forEach((img) => {
        productData[img] && appendData.append(img, productData[img]);
      });

      // ✅ Ajout des nouveaux champs
      appendData.append("name", productData.name);
      appendData.append("description", productData.description);
      appendData.append("price", productData.price);
      appendData.append("category", productData.category);
      appendData.append("subCategory", productData.subCategory);
      appendData.append("bestseller", productData.bestseller);
      appendData.append("sizes", JSON.stringify(productData.sizes));
      appendData.append("stock", productData.stock);
      appendData.append("minStock", productData.minStock);
      if (productData.expiryDate) {
        appendData.append("expiryDate", productData.expiryDate);
      }

      const res = await axios.post(`${API_URL}/product/add`, appendData, {
        headers: { token },
      });

      if (res.data.success) {
        setProductData({
          name: "",
          description: "",
          price: 0,
          category: "",
          subCategory: "",
          sizes: [],
          bestseller: false,
          stock: 0,
          minStock: 5,
          expiryDate: "",
          image1: null,
          image2: null,
          image3: null,
          image4: null,
        });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding product. Check console.");
    }
  };

  return (
    <main>
      <form
        onSubmit={handleAddProduct}
        className="flex flex-col w-full items-start gap-3"
      >
        {/* Upload Images */}
        <div>
          <p className="mb-2 font-medium text-sm">Upload Images</p>
          <div className="flex gap-2">
            {["image1", "image2", "image3", "image4"].map((image, index) => (
              <label key={index} htmlFor={image}>
                <img
                  className="w-20 cursor-pointer"
                  src={
                    productData[image]
                      ? URL.createObjectURL(productData[image])
                      : assets.upload_area
                  }
                  alt="upload area"
                />
                <input
                  name={image}
                  type="file"
                  id={image}
                  hidden
                  onChange={setProductValue}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Nom du produit</p>
          <input
            name="name"
            type="text"
            placeholder="Type here"
            value={productData.name}
            onChange={setProductValue}
            className="w-full max-w-[500px] px-3 py-2"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Description</p>
          <textarea
            name="description"
            placeholder="Write product description"
            value={productData.description}
            onChange={setProductValue}
            className="w-full max-w-[500px] px-3 py-2"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
          <div>
            <p className="mb-2 font-medium text-sm">Catégorie</p>
            <select
              name="category"
              value={productData.category}
              onChange={setProductValue}
              className="w-full px-3 py-2"
              required
            >
              <option value="">-- catégorie --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Sous-catégorie</p>
            <select
              name="subCategory"
              value={productData.subCategory}
              onChange={setProductValue}
              className="w-full px-3 py-2"
              required
            >
              <option value="">-- sous-catégorie --</option>
              {categories
                .find(cat => cat._id === productData.category)
                ?.subCategories?.map(sub => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Prix</p>
            <input
              name="price"
              type="number"
              placeholder="25SR"
              value={productData.price}
              onChange={setProductValue}
              className="w-full max-w-[500px] px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Stock & Péremption */}
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
          <div>
            <p className="mb-2 font-medium text-sm">Quantite en Stock</p>
            <input
              name="stock"
              type="number"
              placeholder="Ex: 50"
              value={productData.stock}
              onChange={setProductValue}
              className="w-full max-w-[500px] px-3 py-2"
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
              onChange={setProductValue}
              className="w-full max-w-[500px] px-3 py-2"
              required
            />
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Date de péremption</p>
            <input
              name="expiryDate"
              type="date"
              value={productData.expiryDate}
              onChange={setProductValue}
              className="w-full max-w-[500px] px-3 py-2"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2 font-medium text-sm">Tailles/Poids</p>
          <div className="flex gap-2.5">
            {["S", "M", "L", "XL", "XXL", "1Kg", "500g", "250g", "125g"].map((size) => (
              <p
                key={size}
                className={`cursor-pointer font-semibold py-1 px-3 bg-slate-200 ${
                  productData.sizes.includes(size)
                    ? "bg-orange-300 text-white"
                    : ""
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
            onChange={setProductValue}
          />
          <label htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button
          type="submit"
          className="uppercase bg-black text-white px-3 py-3 rounded mt-3"
        >
          Add Product
        </button>
      </form>
    </main>
  );
};

export default AddProduct;