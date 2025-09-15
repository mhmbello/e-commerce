import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

const Sidebar = () => {
  return (
    <aside className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col items-start gap-4 pt-6 pl-[20%] w-full text-sm'>
        <NavLink
          to='/add-product'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.add_icon} alt='add icon' />
          <p className='hidden sm:block'>Ajouter produit</p>
        </NavLink>
        <NavLink
          to='/list-products'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.add_icon} alt='add icon' />
          <p className='hidden sm:block'>Listes de Produits</p>
        </NavLink>
        <NavLink
          to='/list-categories'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.add_icon} alt='add icon' />
          <p className='hidden sm:block'>Categories</p>
        </NavLink>
        <NavLink
          to='/orders'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.add_icon} alt='add icon' />
          <p className='hidden sm:block'>Commandes</p>
        </NavLink>
        <NavLink
          to='/list-users'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.add_icon} alt='add icon' />
          <p className='hidden sm:block'>Utilisateurs</p>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
