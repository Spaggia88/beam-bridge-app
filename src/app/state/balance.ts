import { createEvent, restore } from 'effector';

export enum BalancePhase {
  EMPTY,
  FILLED
}

export const setBalancePhase = createEvent<BalancePhase>();

export const $phase = restore(setBalancePhase, BalancePhase.FILLED);
