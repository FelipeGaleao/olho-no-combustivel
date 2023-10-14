import { Card, Image, Text, Group, Badge, createStyles, Progress, Center, Button, rem, ScrollArea } from '@mantine/core';
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers } from '@tabler/icons-react';
import { TabelaColeta } from './tabelaColeta';
import { api } from "../../services/api";
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { infoPanelState } from '../../atoms';


const useStyles = createStyles((theme) => ({
    card: {
        // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },
    cardPrimary: {
        backgroundColor: '#228be6',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.white,
        padding: '15px',
        borderRadius: '16px',
        marginLeft: '24px',
        minWidth: '100px',
    },
    imageSection: {
        padding: theme.spacing.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
    },

    label: {
        fontWeight: 700,
        fontSize: theme.fontSizes.xs,
        letterSpacing: rem(-0.25),
        textTransform: 'uppercase',
    },

    section: {
        padding: theme.spacing.md,
        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,

    },

    icon: {
        marginRight: rem(5),
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
    },
}));

export function CardPostoInfo({ infoPostoSelecionado }) {
    const [coletas, setColetas] = useState([])
    const [precos, setPrecos] = useState([])
    const [situacaoPainel, setSituacaoPainel] = useState(true)
    const [resultadoConsulta, setResultadoConsulta] = useState(false)
    const [PanelState, setInfoPanelState] = useRecoilState(infoPanelState);
    const { classes } = useStyles();
    const mockdata = [
        { label: infoPostoSelecionado.Endereço, icon: IconGasStation, title: 'Endereço' },
        { label: infoPostoSelecionado.CnpjPosto, icon: IconUsers, title: 'CNPJ' },
        { label: infoPostoSelecionado.Bairro, icon: IconGauge, title: 'Bairro' },
        { label: infoPostoSelecionado.Município, icon: IconGauge, title: 'Municipio' },
        { label: infoPostoSelecionado.Uf, icon: IconGauge, title: 'Estado' },
    ];

    const fetchColetas = async () => {
        // buscar coletas e ordenar por data
        setResultadoConsulta(false)
        let coletas = []
        let precos = []

        if (infoPostoSelecionado && infoPostoSelecionado.CnpjPosto) {
            await api.get(`/coletas/getByCnpj/${infoPostoSelecionado.CnpjPosto}`).then(response => {
                coletas = response.data
            })
            await api.get(`/postos/getByCnpj/${infoPostoSelecionado.CnpjPosto}`).then(response => {
                precos = response.data.precos_posto
            }
            )
        }
        if (coletas.coletas_posto) {
            // sort coletas by date
            coletas.coletas_posto = coletas.coletas_posto.sort((a, b) => {
                return new Date(b.DataColeta) - new Date(a.DataColeta);
            }
            )
            setColetas(coletas)
            setPrecos(precos)
            setResultadoConsulta(true)
        }
    }

    const getPrecos = (data, produto) => {
        // listar produtos unicos no campo data
        const precos = data.filter(item => item.produto === produto)
        if (precos.length > 0) {
            return precos[0].preco
        }
        else {
            return ' - '
        }
    }

    // on render
    useEffect(() => {
        fetchColetas()
    }, [infoPostoSelecionado])


    const features = mockdata.map((feature) => (
        <div style={{ marginTop: '8px' }} >
            <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
            <span style={{ color: 'gray', fontWeight: 500 }}>{feature.title}:</span>
            <span fz="sm">
                {' ' + feature.label}
            </span>
        </div>
    ));

    return (
        <Card style={{ display: PanelState ? 'grid' : 'none', zIndex: 10 }} className={'card-info-posto'} withBorder radius="lg">
            <div className='info-title'>
                <h2 style={{ height: '24px', }} fw={700}>{infoPostoSelecionado && infoPostoSelecionado.RazaoSocialPosto}</h2>
                <Badge style={{ width: '300px' }} color={'green'} variant="filled">{infoPostoSelecionado && infoPostoSelecionado.Distribuidora}</Badge>
                <div className="divider"> </div>
            </div>
            <div className='info-img-posto' >
                <img className="img-posto" src="https://i0.wp.com/www.jmpostos.com.br/wp-content/uploads/2021/02/shell.jpg?fit=700%2C450"></img>
            </div>
            <div className="info-detalhes-postos">
                <div>
                    SOBRE O POSTO
                </div>
                <div class="info-detalhes-postos-content">
                    {features}
                </div>
            </div>
            <div className="info-precos-postos">
                <div style={{ position: 'absolute', top: '510px', height: '15px' }}>
                    PREÇOS
                </div>
                <div className="gasolina">
                    <div className="text-wrapper">
                        R$ {getPrecos(precos, 'GASOLINA COMUM')}

                    </div>
                    <div className="div">GASOLINA</div>
                </div>
                <div className="gasolina">
                    <div className="text-wrapper">R$
                        {getPrecos(precos, 'ETANOL')}
                    </div>
                    <div className="div">ETANOL</div>
                </div>
                <div className="gasolina">
                    <div className="text-wrapper">R$
                        {getPrecos(precos, 'DIESEL S500')}
                    </div>
                    <div className="div">DIESEL S500</div>
                </div>
            </div>
            <div className="info-tabela-qualidade">
                <div>
                    Programa de Monitoramento da Qualidade dos Combustíveis

                </div>
                {resultadoConsulta ?
                    <TabelaColeta data={coletas} />
                    :
                    <Text style={{ textAlign: 'center' }} fz="sm" c="dimmed" className={classes.label}>
                        Carregando ...
                    </Text>
                }            </div>
            <div className='icon-close' onClick={() => {
                setInfoPanelState(!PanelState)
            }}>
                <img width="24" height="24" src="https://img.icons8.com/ios-glyphs/30/delete-sign.png" alt="delete-sign" />
            </div>
        </Card >
    );

}

export default CardPostoInfo;