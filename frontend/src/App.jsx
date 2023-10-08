import React from "react";
import ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';


import Layout from "./layout";
import HomePage from "./pages/homepage";
import MapPage from "./pages/map";


const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<MapPage />} />
            <Route path="/map" element={<MapPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

// multiple export default
export default App