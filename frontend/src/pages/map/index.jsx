import { api } from "../../services/api";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardPostoInfo } from "../../components/cardpostoinfo";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { infoPanelState } from "../../atoms";
import { Helmet } from "react-helmet-async";

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
const MapPage = () => {
  const [postos, setPostos] = useState([]);
  const [situacaoPainel, setSituacaoPainel] = useState(false);
  const [limitesMapa, setLimitesMapa] = useState([-20.461016, -54.6122]);
  const [minhaPosicaoAtual, setMinhaPosicaoAtual] = useState([
    -20.461016, -54.6122,
  ]);
  const [postoSelecionado, setPostoSelecionado] = useState({});
  const [hue, setHue] = useState(0);
  const color = `#0000ff`;
  const PanelState = useRecoilValue(infoPanelState);
  const setInfoPanelState = useSetRecoilState(infoPanelState);
  const [posicaoAtual, setPosicaoAtual] = useState([-20.461016, -54.6122]);
  const [bounds, setBounds] = useState(null);
  const [moved, setMoved] = useState(false);
  const params_url = useParams();
  const [meta, setMeta] = useState({
    type: "website",
    title: "👀 Olho no Combustível",
    description:
      "Plataforma para encontrar o melhor preço de combustível na sua região.",
  });

  const [titlePage, setTitlePage] = useState("👀 Olho no Combustível");

  const getCurrentLocation = (moveMap) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (moveMap) {
          setLimitesMapa([position.coords.latitude, position.coords.longitude]);
          setPosicaoAtual([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setMinhaPosicaoAtual([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        } else {
          setMinhaPosicaoAtual([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const setPainelAberto = (value) => {
    // set to local Storage
    localStorage.setItem("situacaoPainel", value);
  };

  const fetchPostosCombustiveis = async () => {
    let postos = [];
    // check if map view is above 16
    await api
      .get("/postos/", {
        params: {
          Latitude: limitesMapa[0],
          Longitude: limitesMapa[1],
        },
      })
      .then((response) => {
        postos = response.data;
      });
    // filter postos with latitude and longitude is not empty
    postos = postos.filter(
      (posto) => posto.Latitude !== null && posto.Longitude !== null
    );
    setPostos(postos);
  };

  useEffect(() => {
    fetchPostosCombustiveis();
    if (params_url && params_url.cnpj) {
      getCurrentLocation(false);
      try {
        api.get("/postos/getByCnpj/" + params_url.cnpj).then((response) => {
          if (response.data.detalhe_posto.length === 0) {
            window.location.href = "/not_found";
          }

          setTitlePage(
            response.data.detalhe_posto[0].RazaoSocialPosto +
              " - 👀 Olho no Combustível"
          );
          setMeta({
            type: "website",
            title: response.data.detalhe_posto[0].RazaoSocialPosto + " - 👀 Olho no Combustível",
            description:
              "Confira os últimos preços divulgados para o " + response.data.detalhe_posto[0].RazaoSocialPosto + " em " + response.data.detalhe_posto[0].Bairro + ", " + response.data.detalhe_posto[0].Município + " - " + response.data.detalhe_posto[0].Uf + ".",
            });

          setPosicaoAtual([
            response.data.detalhe_posto[0].Latitude,
            response.data.detalhe_posto[0].Longitude,
          ]);
          setPostoSelecionado(response.data.detalhe_posto[0]);
          setInfoPanelState(true);
        });
      } catch (err) {
        // redirect to not found page
        window.location.href = "/not_found";
      }
    } else {
      getCurrentLocation(true);
    }
    setPainelAberto(false);
  }, []);

  // useMapEvent('moveend', () => {
  //     const map = mapRef.current;
  //     if (map) {
  //         const bounds = map.getBounds();
  //         setBounds(bounds);
  //         console.log(bounds)
  //     }
  // });

  const MapController = () => {
    const map = useMap();
    useMapEvent("moveend", () => {
      // show the coordinates
      setLimitesMapa([map.getCenter().lat, map.getCenter().lng]);
      fetchPostosCombustiveis();
    });
    useMapEvent("created", () => {
      // show the coordinates
      map.setView(posicaoAtual[0], posicaoAtual[1]);
    });
  };

  const mapKey = posicaoAtual.join(",");

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div>
        <Helmet>
          <title>{titlePage} </title>
          <meta
            name="description"
            content={meta.description}
          />
          <meta property="og:type" content={meta.type} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          {/* End Facebook tags */}
          {/* Twitter tags */}
          <meta name="twitter:creator" content={name} />
          <meta name="twitter:card" content={meta.type} />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
        </Helmet>
      </div>

      <MapContainer
        key={mapKey}
        style={{ height: "100vh", width: "100vw", zIndex: 1 }}
        center={posicaoAtual}
        zoom={18}
        scrollWheelZoom={true}
      >
        <MapController />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          key={"minhaPosicaoAtual"}
          icon={L.divIcon({
            className: "custom-div-icon-marker",
            html: `<img width="40" height="40" src="https://img.icons8.com/ultraviolet/40/car.png" alt="car"/>`,
          })}
          position={minhaPosicaoAtual}
        >
          <Tooltip
            offset={[15, 5]}
            className="tooltip-content-success"
            permanent
          >
            Você está aqui!
          </Tooltip>
        </Marker>
        {
          // if postos is not empty render markers
          postos &&
            postos.map((posto) => (
              <Marker
                key={posto.CnpjPosto}
                position={[posto.Latitude, posto.Longitude]}
                icon={L.divIcon({
                  className: "custom-div-icon-marker",
                  html: `<img src="https://www.olhonocombustivel.com/images/marker-icon.png">`,
                })}
                eventHandlers={{
                  // show posto name on click and set situacaoPainel
                  click: () => {
                    posto.situacaoPainel = true;
                    // change url to /posto/:cnpj
                    window.history.pushState(
                      "",
                      "",
                      "/posto/" + posto.CnpjPosto
                    );
                    setTitlePage(
                      posto.RazaoSocialPosto + " - 👀 Olho no Combustível"
                    );
                    PanelState
                      ? setInfoPanelState(true)
                      : setInfoPanelState(true);
                    setPostoSelecionado(posto);
                    ReactGA.event({
                      category: "Postos (CNPJ)",
                      action: "Visualização de posto (CNPJ)",
                      label: posto.CnpjPosto,
                      value: 1,
                    });
                    ReactGA.event({
                      category: "Postos (Razão Social)",
                      action: "Visualização de posto (Razão Social)",
                      label: posto.RazaoSocialPosto,
                      value: 1,
                    });
                    ReactGA.event({
                      category: "Postos",
                      action: "Visualização de posto (Cidade)",
                      label: "Cidade",
                      value: 1,
                    });
                    ReactGA.event({
                      category: "Postos",
                      action: "Visualização de posto (Endereço)",
                      label:
                        posto.Bairro +
                        ", " +
                        posto.Município +
                        " - " +
                        posto.Uf,
                      value: 1,
                    });
                  },
                }}
              >
                <Tooltip
                  offset={[30, 20]}
                  className="tooltip-content"
                  permanent
                >
                  <span>
                    <b>{posto.RazaoSocialPosto}</b>
                  </span>
                  <span>{posto.Distribuidora}</span>
                  <div>
                    {posto.preco_gasolina
                      ? `G: R$ ${posto.preco_gasolina} `
                      : ""}
                    {posto.preco_etanol ? `E: R$ ${posto.preco_etanol} ` : ""}
                    {posto.preco_diesel ? `D: R$ ${posto.preco_diesel}` : ""}
                  </div>
                  {posto.data_coleta
                    ? `Atualizado em: ${posto.data_coleta}`
                    : ""}
                </Tooltip>
              </Marker>
            ))
        }
      </MapContainer>
      <CardPostoInfo
        style={{ zIndex: 10 }}
        infoPostoSelecionado={postoSelecionado}
      />
    </div>
  );
};

export default MapPage;
