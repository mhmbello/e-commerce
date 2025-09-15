import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import SectionTitle from "../components/SectionTitle";
import ProductItem from "../components/ProductItem";

const Collections = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilters, setShowFilters] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]); // toutes les catégories + subCategories
  const [category, setCategory] = useState([]); // catégories sélectionnées
  const [subCategory, setSubCategory] = useState([]); // sous-catégories sélectionnées
  const [sortType, setSortType] = useState("relavent");

  // Toggle category
  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory((prev) => prev.filter((c) => c !== value));
      // Supprime les subCategories liées à cette catégorie
      const removedCategory = categoriesData.find((cat) => cat.name === value);
      if (removedCategory) {
        setSubCategory((prev) =>
          prev.filter(
            (sub) =>
              !removedCategory.subCategories
                .map((sc) => sc.name)
                .includes(sub)
          )
        );
      }
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  // Toggle subCategory
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubCategory((prev) => prev.filter((s) => s !== value));
    } else {
      setSubCategory((prev) => [...prev, value]);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4001/api/category");
        const data = await res.json();
        setCategoriesData(data.payload || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Apply filters
  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtrer par catégorie
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category._id) // <-- utiliser l'ID
      );
    }

    // Filtrer par sous-catégorie
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory._id) // <-- utiliser l'ID
      );
    }
    setFilterProducts(productsCopy);
  };

  // Sort products
  const sortProduct = () => {
    let productsCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(productsCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(productsCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <main className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* ------------Filter options----------- */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilters(!showFilters)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS{" "}
          <img
            className={`h-3 sm:hidden ${showFilters ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt='dropdown icon'
          />
        </p>

        {/* -------Category filter ------- */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 sm:block ${
            showFilters ? "" : "hidden"
          }`}
        >
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {Array.isArray(categoriesData) &&
              categoriesData.map((cat) => (
                <p className='flex gap-2' key={cat._id}>
                  <input
                    className='w-5 cursor-pointer'
                    type='checkbox'
                    value={cat._id}
                    onChange={toggleCategory}
                  />
                  {cat.name}
                </p>
              ))}
          </div>
        </div>

        {/* -------SubCategory filter----------- */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 sm:block ${
            showFilters ? "" : "hidden"
          }`}
        >
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {Array.isArray(categoriesData) &&
              categoriesData
                .filter((cat) => category.includes(cat._id)) // seulement les catégories sélectionnées
                .flatMap((cat) => cat.subCategories)
                .map((sub) => (
                  <p className='flex gap-2' key={sub._id}>
                    <input
                      className='w-5 cursor-pointer'
                      type='checkbox'
                      value={sub._id}
                      onChange={toggleSubCategory}
                    />
                    {sub.name}
                  </p>
                ))}
          </div>
        </div>
      </div>

      {/* ------------Filter products----------- */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <SectionTitle title={"TOUTE LES"} subtitle={"COLLECTIONS"} />
          {/* -----Product sort------- */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border border-gray-300 text-sm px-2'
          >
            <option value='relavent'>Pertinent</option>
            <option value='low-high'>Moins cher au plus cher</option>
            <option value='high-low'>Plus cher au moins cher</option>
          </select>
        </div>

        {/* ---------Map products---------- */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {filterProducts.map((item, i) => (
            <ProductItem key={i} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Collections;
