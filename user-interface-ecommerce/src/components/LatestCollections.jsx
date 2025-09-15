import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import SectionTitle from "./SectionTitle";
import ProductItem from "./ProductItem";

const LatestCollections = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // On prend les 10 derniers produits ajoutés
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <SectionTitle title={"DERNIÈRES"} subtitle={"COLLECTIONS"} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Découvrez nos dernières collections tendances et de haute qualité.
          Restez élégant(e) et à la mode pour toutes les occasions avec nos nouveautés.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((product, i) => (
          <ProductItem key={i} {...product} />
        ))}
      </div>
    </section>
  );
};

export default LatestCollections;