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
            return 'Não encontrado'
        }
    }

    // on render
    useEffect(() => {
        fetchColetas()
    }, [infoPostoSelecionado])


    const features = mockdata.map((feature) => (
        <div style={{
            marginTop: '20px',
            margin: '10px 0px'

        }}>
            <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
            <span>{feature.title}:</span>
            <span fz="sm">
                {' ' + feature.label}
            </span>
        </div>
    ));

    return (
        <Card style={{ display: PanelState ? 'block' : 'none' }} className={'card-info-posto'} withBorder radius="lg">
            {// Botão para fechar o card
                <Button
                    variant="outline"
                    color="blue"
                    style={{ position: 'absolute', right: '0px', margin: '10px', zIndex: 9999 }}
                    onClick={() => {
                        setInfoPanelState(!PanelState)
                    }
                    }
                >Fechar</Button>
            }
            <Group position="apart" mt="md">
                <div>
                    <h2 fw={900}>{infoPostoSelecionado && infoPostoSelecionado.RazaoSocialPosto}</h2>
                    <Badge color={'green'} variant="filled">{infoPostoSelecionado && infoPostoSelecionado.Distribuidora}</Badge>
                </div>
            </Group>
            <hr></hr>


            <Group>
                <Image src="https://www.zuldigital.com.br/blog/wp-content/uploads/2020/09/shutterstock_339529217_Easy-Resize.com_.jpg" height={"200px"} />
            </Group>
            <Card.Section className={classes.section} mt="md">
                <Text fz="sm" c="dimmed" className={classes.label}>
                    Sobre o posto
                </Text>

                <Group>
                    <div style={{ display: 'grid', width: '688px', gridGap: '1px', gridAutoFlow: 'column', gridTemplateRows: '30px 30px 30px' }}>
                        {features}
                    </div>
                </Group>
            </Card.Section>

            <Card.Section mt="md">
                <Text p="xl" fz="sm" c="dimmed" className={classes.label}>
                    Preços
                </Text>
                <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', overflow: 'auto', maxWidth: '100%' }} >
                    <div withBorder className={classes.cardPrimary} radius="lg" m="xl" p="xl" >
                        <Text fz="xs" tt="uppercase" fw={700}>
                            Gasolina
                        </Text>
                        <Text fz="sm" fw={500}>
                            R$ {getPrecos(precos, 'GASOLINA COMUM')}
                            {
                                precos && precos.map((preco) => (
                                    <div>
                                        {preco.produto === 'GASOLINA COMUM' ? <Text fz="xs" tt="uppercase" fw={700}>
                                            <span style={{ fontSize: '10px', fontWeight: '300' }}>
                                                {
                                                    new Date(preco.data_coleta).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })
                                                } - R$ {preco.preco} </span>
                                        </Text> : <></>}
                                    </div>
                                ))

                            }
                        </Text>
                    </div>
                    <div withBorder className={classes.cardPrimary} radius="lg" m="xl" p="xl" >
                        <Text fz="xs" tt="uppercase" fw={700}>
                            Álcool
                        </Text>
                        <Text fz="lg" fw={500}>
                            R$ {getPrecos(precos, 'ETANOL')}
                            {
                                precos && precos.map((preco) => (
                                    <div>
                                        {preco.produto === 'ETANOL' ? <Text fz="xs" tt="uppercase" fw={700}>
                                            <span style={{ fontSize: '10px', fontWeight: '300' }}>
                                                {
                                                    new Date(preco.data_coleta).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })
                                                } - R$ {preco.preco} </span>
                                        </Text> : <></>}
                                    </div>
                                ))

                            }
                        </Text>
                    </div>
                    <div withBorder className={classes.cardPrimary} radius="lg" m="xl" p="xl" >
                        <Text fz="xs" tt="uppercase" fw={700}>
                            Diesel
                        </Text>
                        <Text fz="lg" fw={500}>
                            R$ {getPrecos(precos, 'DIESEL S500')}
                            {
                                precos && precos.map((preco) => (
                                    <div>
                                        {preco.produto === 'DIESEL S500' ? <Text fz="xs" tt="uppercase" fw={700}>
                                            <span style={{ fontSize: '10px', fontWeight: '300' }}>
                                                {
                                                    new Date(preco.data_coleta).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })
                                                } - R$ {preco.preco} </span>
                                        </Text> : <></>}
                                    </div>
                                ))

                            }
                        </Text>
                    </div>
                </Card>
            </Card.Section>
            <Card.Section className={classes.section} mt="md">
                <Text fz="sm" c="dimmed" className={classes.label}>
                    Programa de Monitoramento da Qualidade dos Combustíveis
                </Text>
            </Card.Section>
            <Card.Section>
                {resultadoConsulta ?
                    <TabelaColeta data={coletas} />
                    :
                    <Text style={{ textAlign: 'center' }} fz="sm" c="dimmed" className={classes.label}>
                        Carregando ...
                    </Text>
                }
            </Card.Section>
        </Card >
    );

}

export default CardPostoInfo;