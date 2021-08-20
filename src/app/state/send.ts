import { createEvent, restore } from 'effector';

export const currencies = [
    {name: "USDT", id: 1},
    {name:'WBTC', id: 2},
    {name:'DAI', id: 3}
];

export const setCurrency = createEvent<{name: string, id: number}>();
export const $selectedCurrency = restore(setCurrency, currencies[0]);