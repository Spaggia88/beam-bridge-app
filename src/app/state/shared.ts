import { createEvent, restore, createStore } from 'effector';
import { Transaction } from '@core/types';

export enum View {
  CONNECT,
  BALANCE,
  SEND,
  RECEIVE
}

export const setView = createEvent<View>();
export const $view = restore(setView, View.BALANCE);

export const setReady = createEvent<boolean>();
export const $ready = restore(setReady, false);

export const setPkey = createEvent<string>();
export const $userPkey = restore(setPkey, '');

export const setEthBalance = createEvent<number>();
export const $ethBalance = restore(setEthBalance, null);

export const setUsdtBalance = createEvent<number>();
export const $usdtBalance = restore(setUsdtBalance, null);

export const setTransactions = createEvent<Transaction[]>();
export const $transactions = restore(setTransactions, []);

export const setIsInProgress = createEvent<boolean>();
export const $isInProgress = restore(setIsInProgress, false);