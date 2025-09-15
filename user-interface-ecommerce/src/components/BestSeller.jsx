import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import SectionTitle from "./SectionTitle";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    // On récupère les 5 produits les plus vendus
    setBestSeller(products.filter((item) => item.bestseller).slice(0, 5));
  }, [products]);

  return (
    <section className='my-10'>
      <div className='text-center text-3xl py-8'>
        <SectionTitle title={"MEILLEURES"} subtitle={"VENTES"} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Découvrez nos articles les plus vendus, des pièces incontournables
          appréciées par nos clients pour leur style et leur qualité.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item, i) => (
          <ProductItem key={i} {...item} />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;