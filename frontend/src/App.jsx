import React from "react";
import ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout";
import HomePage from "./pages/homepage";
import MapPage from "./pages/map";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;