import { createEvent, restore } from 'effector';

export const currencies = [
    {name: "bUSDT", id: 1},
    {name:'bWBTC', id: 2},
    {name:'bDAI', id: 3}
];

export const setCurrency = createEvent<{name: string, id: number}>();
export const $selectedCurrency = restore(setCurrency, currencies[0]);