import { atom } from 'recoil';

const infoPanelState = atom({
    key: 'infoPanelState',
    default: false,
});

const sidebarState = atom({
    key: 'sidebarState',
    default: false,
});
export { infoPanelState, sidebarState };