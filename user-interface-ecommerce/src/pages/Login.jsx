import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  loginSchema,
  registrationSchema,
} from "../validations/loginInputValidation";

const Login = () => {
  const [currState, setCurrState] = useState("Connexion");
  const [errors, setErrors] = useState(false);
  const { navigate, setToken, token, serverURL } = useContext(ShopContext);

  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loginInputData = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      let schema;
      let newURL = serverURL;

      if (currState === "Inscription") {
        schema = registrationSchema;
        newURL += "/user/register";
      } else {
        schema = loginSchema;
        newURL += "/user/login";
      }
      schema.parse(loginData);

      const { data } = await axios.post(newURL, loginData);

      if (data.success) {
        setToken(localStorage.setItem("token", data.payload));
        setLoginData({
          name: "",
          email: "",
          password: "",
        });
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error("Échec de la connexion");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.format();
        const flatErrors = Object.keys(formattedErrors).reduce((acc, key) => {
          if (formattedErrors[key]._errors) {
            acc[key] = formattedErrors[key]._errors[0];
          }
          return acc;
        }, {});
        setErrors(flatErrors);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={handleLoginSubmit}
      className='flex flex-col text-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'
    >
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currState === "Inscription" && (
        <>
          <input
            onChange={loginInputData}
            value={loginData.name}
            name='name'
            type='text'
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Nom'
          />
          {errors.name && (
            <p className='text-red-600 text-start text-xs font-semibold'>
              {errors.name}
            </p>
          )}
        </>
      )}

      <input
        onChange={loginInputData}
        value={loginData.email}
        name='email'
        type='email'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
      />
      {errors.email && (
        <p className='text-red-600 text-xs text-start font-semibold'>
          {errors.email}
        </p>
      )}
      <input
        onChange={loginInputData}
        value={loginData.password}
        name='password'
        type='password'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Mot de passe'
      />
      {errors.password && (
        <p className='text-red-600 text-xs text-start font-semibold'>
          {errors.password}
        </p>
      )}

      <div className='w-full flex justify-between text-sm -mt-2'>
        <p className='cursor-pointer'>Mot de passe oublié ?</p>
        {currState === "Inscription" ? (
          <p onClick={() => setCurrState("Connexion")} className='cursor-pointer'>
            Se connecter ici
          </p>
        ) : (
          <p onClick={() => setCurrState("Inscription")} className='cursor-pointer'>
            Créer un compte
          </p>
        )}
      </div>

      <button className='w-full px-3 font-light py-2 border bg-gray-800 text-white'>
        {currState === "Inscription" ? "S'inscrire" : "Se connecter"}
      </button>
    </form>
  );
};

export default Login;