import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { NavLink } from 'react-router-dom';

import NavBar from "./NavBar";
import Home from "./Home";
import About from "./About";
import Desserts from "./Desserts";
import Pastas from "./Pastas";
import Beef from "./Beef";
import NotFound from "./NotFound";
import ProductDetails from "./ProductDetails";
import Users from "./Users";
import ShoppingCart from "./ShoppingCart"
import UserContext from '../context/user-context';
import '../css/App.css';

function App() {
  //global state that is stored in context 
  const [loginUser, setLoginUser] = useState("");
  const [currentToken, setCurrentToken] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loggedInSucceed, setLoggedInSucceed] = useState(false);

  const changeLoginUser = (newUsername) => {
    setLoginUser(newUsername);
  };

  const changeCartItems = (newCartItem) => {
    setCartItems(newCartItem);
  };

  const changeToken = (newToken) => {
    setCurrentToken(newToken);
  };

  const changeLoginState = (newState) => {
    setLoggedInSucceed(newState);
  };

  const userContextValue = {
    loginUser,
    currentToken,
    cartItems,
    loggedInSucceed,
    changeLoginUser,
    changeToken,
    changeCartItems,
    changeLoginState
  };

  return (
    <UserContext.Provider value={userContextValue}>
      <BrowserRouter>
        <div className="App">
          <div className='header'><NavLink to="/" style={{ textDecoration: 'none', color: 'rgb(255, 113, 47)' }}><p>3380 Prairie Sky Cafe  </p></NavLink></div>
          <div className='users'>
            <Users />
          </div>
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/Desserts" element={<Desserts />} />
              <Route path="/Pastas" element={<Pastas />} />
              <Route path="/Beef" element={<Beef />} />
              <Route path="/ProductDetails/:id" element={<ProductDetails />} />
              <Route path="/shoppingcart" element={<ShoppingCart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
