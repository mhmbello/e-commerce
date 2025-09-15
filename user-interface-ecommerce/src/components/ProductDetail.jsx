import React, { useState } from "react";

const ProductTabs = ({ description, reviews }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-20">
      {/* Onglets */}
      <div className="flex">
        <button
          className={`border px-5 py-3 text-sm ${
            activeTab === "description" ? "bg-orange-100 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={`border px-5 py-3 text-sm ${
            activeTab === "reviews" ? "bg-orange-100 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Avis
        </button>
      </div>

      {/* Contenu */}
      <div className="flex flex-col gap-4 border p-6 text-sm text-gray-600">
        {activeTab === "description" && (
          <div>
            {description ? (
              <p>{description}</p>
            ) : (
              <p className="italic text-gray-400">
                Aucune description disponible.
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="flex flex-col gap-3">
            {reviews && reviews.length > 0 ? (
              reviews.map((rev, i) => (
                <div key={i} className="border-b pb-2">
                  <p className="font-semibold">{rev.user}</p>
                  <p className="text-gray-500">{rev.comment}</p>
                  <p className="text-yellow-500">⭐ {rev.rating}/5</p>
                </div>
              ))
            ) : (
              <p className="italic text-gray-400">
                Aucun avis pour ce produit.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
