import { api } from "../../services/api";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CardPostoInfo } from "../../components/cardpostoinfo";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { infoPanelState } from "../../atoms";
import "../../../public/leaflet.css";
import ReactGA from "react-ga4";
import {
  MapContainer,
  TileLayer,
  useMap,
  Tooltip,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "./styles.css";

const NotFoundPage = () => {
  return (
    <div className="content">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <Link to="/">
        <p>Que tal voltar ao mapa? Clique aqui!</p>
      </Link>
    </div>
  );
};
export default NotFoundPage;
