import React from "react";
import SectionTitle from "../components/SectionTitle";
import { assets } from "../assets/frontend_assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <main>
      {/* Section À propos */}
      <div className='text-2xl text-center mt-8 border-t'>
        <SectionTitle title={"À PROPOS"} subtitle={"DE NOTRE BOUTIQUE"} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img
          className='w-full md:max-w-[450px]'
          src={assets.about_img}
          alt='image à propos'
        />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Bienvenue sur notre boutique en ligne ! Nous proposons une sélection
            de produits de qualité pour répondre à tous vos besoins.
          </p>
          <p>
            Chaque produit est soigneusement choisi pour garantir votre satisfaction
            et une expérience d’achat agréable et sécurisée.
          </p>
          <b className='text-gray-800'>Notre Mission</b>
          <p>
            Offrir des produits fiables et accessibles tout en assurant un service
            client de qualité, pour que chaque achat soit une expérience réussie.
          </p>
        </div>
      </div>
      
      {/* Section Pourquoi nous choisir */}
      <div className='text-4xl py-4'>
        <SectionTitle title={"POURQUOI"} subtitle={"NOUS CHOISIR"} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Produits de Qualité :</b>
          <p>
            Tous nos articles sont soigneusement sélectionnés pour leur qualité et leur durabilité.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Achat Facile :</b>
          <p>
            Notre boutique en ligne est simple à utiliser, avec un processus de commande rapide et sécurisé.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Service Client Dédié :</b>
          <p>
            Notre équipe est disponible pour répondre à vos questions et vous accompagner à chaque étape.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterBox/>
    </main>
  );
};

export default About;