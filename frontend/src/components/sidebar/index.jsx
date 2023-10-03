import { useState } from 'react';
import { createStyles, Divider, Button, Navbar, Group, Code, getStylesRef, rem } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import "../../../public/style.css";
import "../../../public/styleguide.css";

import {
    IconMap2,
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
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        border: '1px solid #FFF',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.white,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            color: '#FFF',
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                0.1
            ),
        },
    },

    linkIcon: {

        '&, &:hover': {
            color: '#FFF',
            opacity: 1,
        },
        display: 'flex',
        alignItems: 'center',
        opacity: 0.75,
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        color: '#228BE6',
        '&, &:hover': {
            backgroundColor: '#FFF',
            color: '#228BE6',
            [`& .${getStylesRef('icon')}`]: {
                opacity: 0.9,
            },
        },
    },
}));

const data = [
    { link: '', label: 'Inicio', icon: IconHome },
    { link: 'map', label: 'Mapa', icon: IconMap2 },
];

export function Sidebar({ props }) {
    const { classes, cx } = useStyles();
    const [visible, setVisible] = useState(true)
    const [active, setActive] = useState('Billing');
    const navigate = useNavigate();
    const links = data.map((item) => (
        <a style={{ display: visible ? 'block' : 'none', justifyContent: 'center', alignItems: 'center' }}
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
                navigate(item.link);
            }}
        >
            <item.icon className={cx({ [classes.linkActive]: item.label === active })} stroke={1.5} />
            <span>{item.label}</span>
        </a >
    ));

    return (
        <Navbar style={{ width: '96px' }} height={visible ? '100vh' : '70px'} p="15px" className={classes.navbar}>
            <Navbar.Section grow className="sidebar">
                <Group className={classes.header} position="apart">
                    {/* <MantineLogo size={28} inverted /> */}
                    <div className="header">
                        <div className="version">
                            <div className="text-wrapper-2">v0.0.1</div>
                        </div>
                    </div>
                </Group>
                {links}
            </Navbar.Section>
        </Navbar>

    );
}
