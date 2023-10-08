import { createStyles, Table, SegmentedControl, Progress, Anchor, Text, Group, ScrollArea, rem, TextInput } from '@mantine/core';
import { useState } from 'react';
import ReactGA from "react-ga4";

const useStyles = createStyles((theme) => ({
    progressBar: {
        '&:not(:first-of-type)': {
            borderLeft: `${rem(3)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
                }`,
        },
    },
}));

const getProdutosUnicos = (data) => {
    // listar produtos unicos no campo data
    const produtosUnicos = ['Todos', ...new Set(data.map(item => item.Produto))]
    return produtosUnicos
}

export function TabelaColeta({ data }) {
    const [coletas, setColetas] = useState(data.coletas_posto)
    const produtosUnicos = getProdutosUnicos(data.coletas_posto)
    const { classes, theme } = useStyles();
    const todasColetas = data.coletas_posto

    let rows = coletas && coletas.map((row) => {
        return (
            <tr key={row.IdNumeric}>
                <td>{row.DataColeta}</td>
                <td>{row.Produto}</td>
                <td>{row.Ensaio}</td>
                <td>{row.UnidadeEnsaio}</td>
                <td>{row.Conforme}</td>
                <td>{row.Resultado}</td>
            </tr>
        );
    });

    // const rows = data.map((row) => {
    //     const totalReviews = row.reviews.negative + row.reviews.positive;
    //     const positiveReviews = (row.reviews.positive / totalReviews) * 100;
    //     const negativeReviews = (row.reviews.negative / totalReviews) * 100;

    //     return (
    //         <tr key={row.title}>
    //             <td>
    //                 <Anchor component="button" fz="sm">
    //                     {row.title}
    //                 </Anchor>
    //             </td>
    //             <td>{row.year}</td>
    //             <td>
    //                 <Anchor component="button" fz="sm">
    //                     {row.author}
    //                 </Anchor>
    //             </td>
    //             <td>{Intl.NumberFormat().format(totalReviews)}</td>
    //             <td>
    //                 <Group position="apart">
    //                     <Text fz="xs" c="teal" weight={700}>
    //                         {positiveReviews.toFixed(0)}%
    //                     </Text>
    //                     <Text fz="xs" c="red" weight={700}>
    //                         {negativeReviews.toFixed(0)}%
    //                     </Text>
    //                 </Group>
    //                 <Progress
    //                     classNames={{ bar: classes.progressBar }}
    //                     sections={[
    //                         {
    //                             value: positiveReviews,
    //                             color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
    //                         },
    //                         {
    //                             value: negativeReviews,
    //                             color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
    //                         },
    //                     ]}
    //                 />
    //             </td>
    //         </tr>
    //     );
    // // });

    return (
        <ScrollArea>
            <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                <SegmentedControl
                    radius="xl"
                    size="md"
                    // filtrar valores distintos de produto
                    data={produtosUnicos}

                    onClick={(value) => {
                        // filtrar por produto
                        if (value.target.value === 'Todos') {
                            setColetas(todasColetas)
                        }
                        else {
                            const produto = value.target.value
                            const coletasFiltradas = todasColetas.filter((row) => row.Produto === produto)
                            setColetas(coletasFiltradas)
                        }
                        ReactGA.event({
                            category: 'Funcionalidades',
                            action: 'Filtro de produto',
                            label: value.target.value,
                            value: 1
                        });
                    }}
                />
            </div>

            <Table sx={{ height: '100px', overflowX: 'auto' }} verticalSpacing="xs">
                <thead>
                    <tr>
                        <th>Data da coleta</th>
                        <th>Produto</th>
                        <th>Ensaio</th>
                        <th>Unidade do Ensaio</th>
                        <th>Conforme</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        </ScrollArea>
    );
}
