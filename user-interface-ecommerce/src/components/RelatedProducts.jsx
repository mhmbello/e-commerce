import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import SectionTitle from "./SectionTitle";

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [relProduct, setRelProduct] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category?._id) {
      let copyProducts = products.filter(
        (item) =>
          item.category?._id === category._id &&
          item._id !== currentProductId
      );

      setRelProduct(copyProducts);
    }
  }, [products, category, subCategory, currentProductId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <SectionTitle title={"ARTICLES"} subtitle={"SIMILAIRES"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {relProduct.map((product) => (
          <ProductItem key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
