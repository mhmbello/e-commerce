import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const OurPolicy = () => {
  return (
    <section className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      {/* Politique d’échange */}
      <div>
        <img
          className='w-12 m-auto mb-5'
          src={assets.exchange_icon}
          alt='Échange facile'
        />
        <p className='font-semibold'>Échange Simple et Rapide</p>
        <p className='text-gray-400'>
          Changez vos articles sans complications.
        </p>
      </div>

      {/* Politique de retour */}
      <div>
        <img
          className='w-12 m-auto mb-5'
          src={assets.quality_icon}
          alt='Retour 7 jours'
        />
        <p className='font-semibold'>Retour sous 7 jours</p>
        <p className='text-gray-400'>
          Profitez d’un retour gratuit dans les 7 jours suivant l’achat.
        </p>
      </div>

      {/* Support client */}
      <div>
        <img
          className='w-12 m-auto mb-5'
          src={assets.support_img}
          alt='Support client'
        />
        <p className='font-semibold'>Support Client Réactif</p>
        <p className='text-gray-400'>
          Notre équipe est disponible 24h/7j pour vous accompagner.
        </p>
      </div>
    </section>
  );
};

export default OurPolicy;