import React from "react";
import SectionTitle from "../components/SectionTitle";
import { assets } from "../assets/frontend_assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <main className=''>
      {/* Section Contact */}
      <div className='text-2xl text-center pt-10 border-t'>
        <SectionTitle title={"CONTACT"} subtitle={"NOTRE BOUTIQUE"} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img
          className='w-full md:max-w-[480px]'
          src={assets.contact_img}
          alt='image contact'
        />

        <div className='flex flex-col justify-between items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Notre Boutique</p>
          <p className='text-gray-500'>
            casablanca <br /> settat
          </p>
          <p className='text-gray-600'>
            Téléphone : (00212) 771256092 <br /> Email : rahmatoulayedia99@gmail.com
          </p>

          <p className='font-semibold text-xl text-gray-600'>Rejoignez notre équipe</p>
          <p className='text-gray-500'>
            Découvrez nos opportunités de stage ou d’emploi pour rejoindre notre boutique.
          </p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300'>
            Voir les offres
          </button>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterBox />
    </main>
  );
};

export default Contact;