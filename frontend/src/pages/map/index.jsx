import { Map, Marker } from "pigeon-maps"
import { api } from "../../services/api"

import { useEffect, useState } from "react"
import { CardPostoInfo } from "../../components/cardpostoinfo"
import { useRecoilValue, useSetRecoilState } from "recoil"
import infoPanelState from "../../atoms"

const MapPage = () => {
    const [postos, setPostos] = useState([])
    const [situacaoPainel, setSituacaoPainel] = useState(false)
    const [limitesMapa, setLimitesMapa] = useState([-20.461016, -54.6122])
    const [postoSelecionado, setPostoSelecionado] = useState({})
    const [hue, setHue] = useState(0)
    const color = `#0000ff`
    const PanelState = useRecoilValue(infoPanelState);
    const setInfoPanelState = useSetRecoilState(infoPanelState);

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
        setPainelAberto(false)
    }, [])

    return (
        <div>
            <Map height={'120vh'} defaultCenter={[-20.461016, -54.612236]} defaultZoom={11} onBoundsChanged={(e) => {
                setLimitesMapa(e.center)
                fetchPostosCombustiveis()
            }}>
                { // if postos is not empty render markers 
                    postos && postos.map(posto => (
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
                        } />
                    ))
                }
            </Map>
            <CardPostoInfo infoPostoSelecionado={postoSelecionado} />
        </div>
    )
}

export default MapPage