import { Map, Marker, Overlay } from "pigeon-maps"
import { api } from "../../services/api"

import { useEffect, useState } from "react"
import { CardPostoInfo } from "../../components/cardpostoinfo"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { infoPanelState } from "../../atoms"

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

    return (
        <div style={{ height: '100%', width: '100vw' }}>
            <Map defaultCenter={[-20.461016, -54.6122]
            } defaultZoom={11} onBoundsChanged={(e) => {
                setLimitesMapa(e.center)
                fetchPostosCombustiveis()
            }}>

                <Marker key={'posicaoAtual'} width={120} anchor={posicaoAtual} color={'#228be6'} />
                { // if postos is not empty render markers 
                    postos && postos.map(posto => (
                        <Overlay key={posto.CnpjPosto + 'overlay'} anchor={[posto.Latitude, posto.Longitude]} offset={[0, -30]}>
                            <div style={{
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
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
                            <Marker key={posto.CnpjPosto} width={70} anchor={[posto.Latitude, posto.Longitude]} color={
                                // set color based on posto situacao
                                posto.Distribuidora === 'BANDEIRA BRANCA' ? 'purple' : 'green'
                            } onClick={
                                // show posto name on click and set situacaoPainel 
                                () => {
                                    posto.situacaoPainel = true
                                    PanelState ? setInfoPanelState(true) : setInfoPanelState(true)
                                    setPostoSelecionado(posto)
                                }
                            }>

                            </Marker>
                        </Overlay>

                    ))
                }
            </Map>
            <CardPostoInfo infoPostoSelecionado={postoSelecionado} />
        </div>
    )
}

export default MapPage