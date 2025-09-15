import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../constant/constant";

const HeroDashboard = () => {
  const [hero, setHero] = useState({
    slogan: "",
    title: "",
    ctaText: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Récupération du Hero depuis le backend
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(`${API_URL}/hero`);
        if (res.data.success && res.data.payload) {
          setHero(res.data.payload);
          setPreview(res.data.payload.image);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors de la récupération du Hero");
      }
    };
    fetchHero();
  }, []);

  // Gestion de l’input file pour l’image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("slogan", hero.slogan);
    formData.append("title", hero.title);
    formData.append("ctaText", hero.ctaText);

    // si une image est uploadée
    if (imageFile) {
      formData.append("file", imageFile);
    } else if (hero.image) {
      // si pas de nouvelle image, on envoie l'URL actuelle
      formData.append("image", hero.image);
    }

    const res = await axios.post(`${API_URL}/hero`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.success) {
      toast.success("Hero mis à jour avec succès !");
      setHero(res.data.payload);
      setPreview(res.data.payload.image);
      setImageFile(null);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erreur lors de la mise à jour du Hero");
  }
};


  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Éditer le Hero</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Slogan</label>
          <input
            type="text"
            value={hero.slogan}
            onChange={(e) => setHero({ ...hero, slogan: e.target.value })}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Titre principal</label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Texte du CTA</label>
          <input
            type="text"
            value={hero.ctaText}
            onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image</label>
          <input type="file" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Prévisualisation"
              className="mt-2 w-full max-w-sm rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default HeroDashboard;
