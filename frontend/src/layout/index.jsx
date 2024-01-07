import { useState } from 'react';
import {
    AppShell,
    Aside,
    Navbar,
    Header,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
} from '@mantine/core';
import { Sidebar } from '../components/sidebar';
import { Outlet } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { sidebarState } from '../atoms';
import ReactGA from "react-ga4";

export default function AppShellDemo() {
    const theme = useMantineTheme();
    const [sidebarOpened, setSidebarState] = useRecoilState(sidebarState);
    return (
        <AppShell
            styles={{
                paddingLeft: 0,
                main: {
                    padding: 0,
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            aside={
                <MediaQuery smallerThan="sm" >
                    <Sidebar style={{ display: sidebarOpened ? 'block' : 'none', transition: '2s' }} />
                </MediaQuery>
            }
            header={
                <Header height={{ base: 50, md: 50 }} p="md"
                    style={{ backgroundColor: '#228be6', borderBottom: 'none' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery styles={{ display: 'block' }}>
                            <Burger
                                opened={
                                    sidebarOpened
                                }
                                onClick={
                                    () => {
                                        setSidebarState(!sidebarOpened)
                                        ReactGA.event({
                                            category: 'Funcionalidades',
                                            action: 'Sidebar',
                                            label: sidebarOpened ? 'Fechada' : 'Aberta',
                                            value: 1
                                        });
                                    }

                                }
                                size="sm"
                                color={'white'}

                            />
                        </MediaQuery>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: '100%', height: '100%' }}>
                            <Text><strong>👀 Olho no Combustível</strong></Text>
                        </div>
                    </div>
                </Header>
            }
        >
            <Outlet />
        </AppShell>
    );
}