import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {
  return (
    <section className='flex flex-col sm:flex-row border border-gray-400'>
      {/* -------hero left side ---------- */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-orange-900'>
          {/* Slogan */}
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-orange-900'></p>
            <p className='font-medium text-sm md:text-base uppercase'>
              Nos Meilleures Ventes
            </p>
          </div>

          {/* Titre principal */}
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
            Nouveautés & Tendances
          </h1>

          {/* Call to action */}
          <div className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition'>
            <p className='font-semibold text-sm md:text-base uppercase'>
              Découvrir Maintenant
            </p>
            <p className='w-8 md:w-11 h-[2px] bg-orange-900'></p>
          </div>
        </div>
      </div>

      {/* -------hero right side ---------- */}
      <img
        className='w-full sm:w-1/2'
        src={assets.hero_img}
        alt='Bannière YummaStore'
      />
    </section>
  );
};

export default Hero;