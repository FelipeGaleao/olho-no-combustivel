import { Card, Image, Text, Group, Badge, createStyles, Progress, Center, Button, rem } from '@mantine/core';
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers } from '@tabler/icons-react';
import { TabelaColeta } from './tabelaColeta';
import { api } from "../../services/api";
import { useEffect, useState } from 'react';
const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },
    cardPrimary: {
        backgroundColor: '#228be6',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.white,
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
        marginBottom: theme.spacing.xs,
        lineHeight: 1,
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
    const [situacaoPainel, setSituacaoPainel] = useState(true)
    const [resultadoConsulta, setResultadoConsulta] = useState(false)
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
        if (infoPostoSelecionado && infoPostoSelecionado.CnpjPosto) {
            await api.get(`/coletas/getByCnpj/${infoPostoSelecionado.CnpjPosto}`).then(response => {
                coletas = response.data
            })
        }
        if (coletas.coletas_posto) {
            // sort coletas by date
            coletas.coletas_posto = coletas.coletas_posto.sort((a, b) => {
                return new Date(b.DataColeta) - new Date(a.DataColeta);
            }
            )
            setColetas(coletas)
            setResultadoConsulta(true)
        }
    }

    // on render
    useEffect(() => {
        fetchColetas()
    }, [infoPostoSelecionado])


    const features = mockdata.map((feature) => (
        <Center key={feature.title}>
            <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} /> <br />
            <Text size="xs"><strong>{feature.title}</strong> {feature.label}</Text>
        </Center>
    ));

    return (
        <Card style={{ display: infoPostoSelecionado.situacaoPainel ? 'block' : 'none' }} withBorder radius="md">
            {// Botão para fechar o card
                <Button
                    variant="outline"
                    color="blue"
                    style={{ position: 'absolute', right: '0px', margin: '10px', zIndex: 9999 }}
                    onClick={() => {
                        infoPostoSelecionado.situacaoPainel = false
                    }
                    }
                >Fechar</Button>
            }
            <Card.Section className={classes.imageSection} style={{ marginTop: '40px' }}>
                <Image src="https://www.zuldigital.com.br/blog/wp-content/uploads/2020/09/shutterstock_339529217_Easy-Resize.com_.jpg" height={"200px"} />
            </Card.Section>

            <Group position="apart" mt="md">
                <div>
                    <h2 fw={900}>{infoPostoSelecionado && infoPostoSelecionado.RazaoSocialPosto}</h2>
                    <small>{infoPostoSelecionado && infoPostoSelecionado.CnpjPosto}</small>
                    <Text fz="xs" c="dimmed">
                    </Text>
                </div>
                <Badge color={'green'} variant="filled">{infoPostoSelecionado && infoPostoSelecionado.Distribuidora}</Badge>
            </Group>

            <Card.Section className={classes.section} mt="md">
                <Text fz="sm" c="dimmed" className={classes.label}>
                    Sobre o posto
                </Text>

                <Group spacing={8} mb={-8}>
                    {features}
                </Group>
            </Card.Section>

            <Card.Section mt="lg">
                <Card withBorder className={classes.cardPrimary} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} radius="md" m="xl" p="xl" >
                    <div>
                        <Text fz="xs" tt="uppercase" fw={700}>
                            Gasolina
                        </Text>
                        <Text fz="lg" fw={500}>
                            R$5.431
                        </Text>
                    </div>
                    <div>
                        <Text fz="xs" tt="uppercase" fw={700}>
                            Álcool
                        </Text>
                        <Text fz="lg" fw={500}>
                            R$5.431
                        </Text>
                    </div>
                    <div>
                        <Text fz="xs" tt="uppercase" fw={700}>
                            Diesel
                        </Text>
                        <Text fz="lg" fw={500}>
                            R$5.431
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
        </Card>
    );
}

export default CardPostoInfo;