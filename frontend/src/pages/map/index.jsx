import { Map, Marker } from "pigeon-maps"
import { api } from "../../services/api"

import { useEffect, useState } from "react"
import { CardPostoInfo } from "../../components/cardpostoinfo"

const MapPage = () => {
    const [postos, setPostos] = useState([])
    const [situacaoPainel, setSituacaoPainel] = useState(false)
    const [limitesMapa, setLimitesMapa] = useState([-20.461016, -54.6122])
    const [postoSelecionado, setPostoSelecionado] = useState({})
    const [hue, setHue] = useState(0)
    const color = `#0000ff`

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
        <div style={{ display: 'flex' }}>
            <Map height={'120vh'} defaultCenter={[-20.461016, -54.612236]} defaultZoom={11} onBoundsChanged={(e) => {
                setLimitesMapa(e.center)
                fetchPostosCombustiveis()
            }}>
                { // if postos is not empty render markers 
                    postos && postos.map(posto => (
                        <Marker key={posto.CnpjPosto} width={70} anchor={[posto.Latitude, posto.Longitude]} color={color} onClick={
                            // show posto name on click and set situacaoPainel 
                            () => {
                                posto.situacaoPainel = true
                                setPostoSelecionado(posto)
                            }
                        } />
                    ))
                }
            </Map>
            <div style={{ paddingTop: '5vh', paddingRight: '1.25vw', backgroundColor: 'white', wdith: "80vw" }}>
                <CardPostoInfo infoPostoSelecionado={postoSelecionado} />
            </div>
        </div>
    )
}

export default MapPage