import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => (
  <div className='NavBar'>
    <ul>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
      <li><NavLink to="/Desserts">Desserts</NavLink></li>
      <li><NavLink to="/Pastas">Pastas</NavLink></li>
      <li><NavLink to="/Beef">Beef</NavLink></li>
    </ul>
  </div>
);

export default NavBar;