import React from "react";
import ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { HelmetProvider } from 'react-helmet-async';


import Layout from "./layout";
import HomePage from "./pages/homepage";
import MapPage from "./pages/map";
import NotFoundPage from "./pages/notfound";


const App = () => {

  return (
    <RecoilRoot>
      <BrowserRouter>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<MapPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/posto/:cnpj" element={<MapPage />} />
            <Route exact path="/posto/" element={<NotFoundPage />} />
            <Route path="/not_found" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </HelmetProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
};

// multiple export default
export default App