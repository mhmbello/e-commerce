import React from "react";
import { assets } from "../assets/frontend_assets/assets";
import logo1 from "../assets/frontend_assets/logo1.png";

const Footer = () => {
  return (
    <footer>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* Logo + Description */}
        <div>
          <img className='mb-5 w-32' src={logo1} alt='YummaStore logo' />
          <p className='w-full md:w-2/3 text-gray-600'>
            Bienvenue sur <strong>YummaStore</strong>, votre boutique en ligne 
            de confiance. Découvrez nos produits de qualité, profitez de nos 
            offres exclusives et restez informés de nos nouveautés.  
            Suivez-nous sur les réseaux sociaux et inscrivez-vous à notre 
            newsletter pour ne rien manquer !
          </p>
        </div>

        {/* Liens de navigation */}
        <div>
          <p className='font-medium text-xl mb-5'>BOUTIQUE</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Accueil</li>
            <li>À propos</li>
            <li>Livraison</li>
            <li>Politique de confidentialité</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='font-medium text-xl mb-5'>CONTACT</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+224 620 00 00 00</li>
            <li>contact@yummastore.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright © {new Date().getFullYear()} YummaStore - Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;