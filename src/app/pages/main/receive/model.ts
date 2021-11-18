import { createEvent, restore } from 'effector';
import { Currency, currencies } from '@core/types';

export const setCurrency = createEvent<Currency>();
export const $selectedCurrency = restore(setCurrency, currencies[0]);