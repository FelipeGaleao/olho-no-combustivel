import { useState } from 'react';
import { createStyles, Navbar, Group, Code, getStylesRef, rem } from '@mantine/core';
import { useNavigate } from "react-router-dom";

import {
    IconReceipt2,
    IconHome,
} from '@tabler/icons-react';
// import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
    navbar: {
        padding: 0,
        borderColor: theme.colors.gray[2],
        borderRightWidth: 1,
        backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    },

    version: {
        backgroundColor: theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
            0.1
        ),
        color: theme.white,
        fontWeight: 700,
    },

    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
            0.1
        )}`,
    },

    footer: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `${rem(1)} solid ${theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
            0.1
        )}`,
    },

    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.white,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                0.1
            ),
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.white,
        opacity: 0.75,
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                0.15
            ),
            [`& .${getStylesRef('icon')}`]: {
                opacity: 0.9,
            },
        },
    },
}));

const data = [
    { link: '', label: 'Inicio', icon: IconHome },
    { link: 'map', label: 'Mapas', icon: IconReceipt2 },
];

export function Sidebar() {
    const { classes, cx } = useStyles();
    const [active, setActive] = useState('Billing');
    const navigate = useNavigate();
    const links = data.map((item) => (
        <a
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
                navigate(item.link);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <Navbar height={'100vh'} width={{ sm: 300 }} p="md" className={classes.navbar}>
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    {/* <MantineLogo size={28} inverted /> */}
                    <Code className={classes.version}>v0.0.1</Code>
                </Group>
                {links}
            </Navbar.Section>
        </Navbar>
    );
}