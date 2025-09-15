import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddProduct from "./pages/AddProduct";
import ListProducts from "./pages/ListProducts";
import UpdateProduct from "./pages/UpdateProduct";
import OrdersProduct from "./pages/OrdersProduct";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
export const serverURL = "http://localhost:4001";
const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className='min-h-screen w-full'>
      {token ? (
        <>
          {" "}
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='p-10 w-full'>
              <Routes>
                <Route path='/add-product' element={<AddProduct token={token} />} />
                <Route path='/list-products' element={<ListProducts />} />
                <Route path='/orders' element={<OrdersProduct token={token} />} />
                <Route path='/update-product/:id' element={<UpdateProduct token={token} />} />
                <Route path='/list-users' element={<Users token={token} />} />
                <Route path='/list-categories' element={<Categories />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <>
          <Login setToken={setToken} />
        </>
      )}
    </div>
  );
};

export default App;
