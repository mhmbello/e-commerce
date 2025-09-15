import React from "react";

const NewsletterBox = () => {
  const handleNewsletter = (e) => {
    e.preventDefault();
    // Ici tu pourras ajouter l’intégration backend pour enregistrer l'email
    alert("Merci pour votre inscription à la newsletter !");
  };

  return (
    <div className='text-center my-12'>
      {/* Titre principal */}
      <p className='text-2xl font-semibold'>
        Inscrivez-vous et profitez de -20% !
      </p>

      {/* Texte descriptif */}
      <p className='text-gray-500 mt-3 max-w-lg mx-auto'>
        Rejoignez la communauté <span className='font-medium'>YummaStore</span> et recevez nos offres exclusives, 
        nos nouveautés et nos promotions directement dans votre boîte mail.
      </p>

      {/* Formulaire */}
      <form
        onSubmit={handleNewsletter}
        className='w-full sm:w-1/2 flex items-center gap-3 my-6 border rounded-md pl-3 m-auto'
      >
        <input
          required
          className='w-full sm:flex-1 outline-none py-3 px-2 text-sm'
          type='email'
          placeholder='Entrez votre adresse e-mail'
        />
        <button
          className='bg-orange-900 hover:bg-orange-800 transition text-white text-xs px-6 py-3 rounded-r-md'
          type='submit'
        >
          S’INSCRIRE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;