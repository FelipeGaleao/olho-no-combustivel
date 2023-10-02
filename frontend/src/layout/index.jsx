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

export default function AppShellDemo() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <AppShell
            styles={{
                main: {
                    padding: 0,
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            aside={
                <MediaQuery smallerThan="sm" >
                    <Aside width={{ sm: '100%', lg: 0 }}>
                        <Sidebar />
                    </Aside>
                </MediaQuery>
            }
            header={
                <Header height={{ base: 50, md: 50 }} p="md"
                    style={{ backgroundColor: '#228be6', borderBottom: 'none' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <Text><strong>Olho no Combustível</strong></Text>
                    </div>
                </Header>
            }
        >
            <Outlet />
        </AppShell>
    );
}