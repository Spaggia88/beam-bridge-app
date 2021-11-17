import { createEvent, restore } from 'effector';
import { Currency } from '@core/types';

export const currencies : Currency[] = [
    {name: "bUSDT", id: 1, decimals: 8},
    {name:'bWBTC', id: 2, decimals: 8},
    {name:'bDAI', id: 3, decimals: 8}
];

export const setCurrency = createEvent<Currency>();
export const $selectedCurrency = restore(setCurrency, currencies[0]);