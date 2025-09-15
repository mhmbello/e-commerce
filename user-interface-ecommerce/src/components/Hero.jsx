import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constant/constant";
import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {
  const [hero, setHero] = useState({});

  useEffect(() => {
    const fetchHero = async () => {
      const res = await axios.get(`${API_URL}/hero`);
      if (res.data.success) setHero(res.data.payload);
    };
    fetchHero();
  }, []);

  return (
    <section className='flex flex-col sm:flex-row border border-gray-400'>
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-orange-900'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-orange-900'></p>
            <p className='font-medium text-sm md:text-base uppercase'>
              {hero.slogan || "Nos Meilleures Ventes"}
            </p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
            {hero.title || "Nouveautés & Tendances"}
          </h1>
          <div className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition'>
            <p className='font-semibold text-sm md:text-base uppercase'>
              {hero.ctaText || "Découvrir Maintenant"}
            </p>
            <p className='w-8 md:w-11 h-[2px] bg-orange-900'></p>
          </div>
        </div>
      </div>

      <img
        className='w-full sm:w-1/2'
        src={hero.image || assets.hero_img}
        alt='Bannière YummaStore'
      />
    </section>
  );
};

export default Hero;
