import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from './pages/Rentals';
import Rooms from "./pages/Rooms"
import './App.css';
//import Homestayes from './pages/homestayes';

const App = () => {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/rooms" element={<Rooms />} />
      {/* <Route path="/homestayes" element={<Homestayes />} /> */}
    </Routes>
  )
};

export default App;
