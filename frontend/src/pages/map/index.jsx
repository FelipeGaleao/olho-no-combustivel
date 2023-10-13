import { api } from "../../services/api"

import { useEffect, useState } from "react"
import { CardPostoInfo } from "../../components/cardpostoinfo"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { infoPanelState } from "../../atoms"
import "../../../public/leaflet.css"
import ReactGA from "react-ga4";
import { MapContainer, TileLayer, useMap, Tooltip, Marker, Popup, useMapEvent } from 'react-leaflet'


const MapPage = () => {
    const [postos, setPostos] = useState([])
    const [situacaoPainel, setSituacaoPainel] = useState(false)
    const [limitesMapa, setLimitesMapa] = useState([-20.461016, -54.6122])
    const [postoSelecionado, setPostoSelecionado] = useState({})
    const [hue, setHue] = useState(0)
    const color = `#0000ff`
    const PanelState = useRecoilValue(infoPanelState);
    const setInfoPanelState = useSetRecoilState(infoPanelState);
    const [posicaoAtual, setPosicaoAtual] = useState([-20.461016, -54.6122])
    const [bounds, setBounds] = useState(null);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLimitesMapa([position.coords.latitude, position.coords.longitude])
                setPosicaoAtual([position.coords.latitude, position.coords.longitude])
            })
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }

    const setPainelAberto = (value) => {
        // set to local Storage
        localStorage.setItem('situacaoPainel', value)
    }

    const fetchPostosCombustiveis = async () => {
        let postos = []
        // check if map view is above 16
        await api.get('/postos/', {
            params: {
                Latitude: limitesMapa[0],
                Longitude: limitesMapa[1],
            }
        }
        ).then(response => {
            postos = response.data
        })
        // filter postos with latitude and longitude is not empty
        postos = postos.filter(posto => posto.Latitude !== null && posto.Longitude !== null)
        setPostos(postos)
    }

    useEffect(() => {
        fetchPostosCombustiveis()
        getCurrentLocation()
        setPainelAberto(false)
    }, [])

    // useMapEvent('moveend', () => {
    //     const map = mapRef.current;
    //     if (map) {
    //         const bounds = map.getBounds();
    //         setBounds(bounds);
    //         console.log(bounds)
    //     }
    // });

    const MapController = () => {
        const map = useMap()
        useMapEvent('moveend', () => {
            // show the coordinates
            setLimitesMapa([map.getCenter().lat, map.getCenter().lng])
            fetchPostosCombustiveis()
        })
    }
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <MapContainer style={{ height: '100vh', width: '100vw', zIndex: 1 }} center={posicaoAtual ? posicaoAtual : [-20.461016, -54.6122]} zoom={18} scrollWheelZoom={true}>
                <MapController />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker key={'posicaoAtual'} position={posicaoAtual} />
                { // if postos is not empty render markers 
                    postos && postos.map(posto => (

                        <Marker key={posto.CnpjPosto} position={[posto.Latitude, posto.Longitude]}
                            icon={
                                L.divIcon({
                                    html: `<img src="https://www.olhonocombustivel.com/images/marker-icon.png">`,
                                })
                            }
                            eventHandlers={{
                                // show posto name on click and set situacaoPainel 
                                click: () => {
                                    posto.situacaoPainel = true
                                    PanelState ? setInfoPanelState(true) : setInfoPanelState(true)
                                    setPostoSelecionado(posto)
                                    ReactGA.event({
                                        category: 'Postos (CNPJ)',
                                        action: 'Visualização de posto',
                                        label: posto.CnpjPosto,
                                        value: 1
                                    });
                                    ReactGA.event({
                                        category: 'Postos (Razão Social)',
                                        action: 'Visualização de posto',
                                        label: posto.RazaoSocialPosto,
                                        value: 1
                                    });
                                    ReactGA.event({
                                        category: 'Postos',
                                        action: 'Visualização de posto',
                                        label: 'Cidade',
                                        value: 1
                                    });
                                    ReactGA.event({
                                        category: 'Postos',
                                        action: 'Visualização de posto',
                                        label: posto.Bairro + ', ' + posto.Município + ' - ' + posto.Uf,
                                        value: 1
                                    });
                                }
                            }}>
                            <Tooltip minZoom={12} maxZoom={16} offset={[30, 20]} style={{ color: 'white', backgroundColor: 'transparent' }} permanent>
                                <div style={{
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', color: 'white',
                                    alignItems: 'center', padding: '10px', borderRadius: '16px', backgroundColor: '#228be6', fontSize: '10px',
                                }}>
                                    <span><b>{posto.RazaoSocialPosto}</b></span>
                                    <span>{posto.Distribuidora}</span>
                                    <div>
                                        {posto.preco_gasolina ? `G: R$ ${posto.preco_gasolina} ` : ''}
                                        {posto.preco_etanol ? `E: R$ ${posto.preco_etanol} ` : ''}
                                        {posto.preco_diesel ? `D: R$ ${posto.preco_diesel}` : ''}
                                    </div>
                                    {posto.data_coleta ? `Atualizado em: ${posto.data_coleta}` : ''}
                                </div>
                            </Tooltip>
                        </Marker>

                    ))
                }

                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
            <CardPostoInfo style={{ zIndex: 10 }} infoPostoSelecionado={postoSelecionado} />
        </div >
    )
}

export default MapPage