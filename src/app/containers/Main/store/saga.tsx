import { call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from '@app/shared/store/actions';
import { ROUTES, CURRENCIES } from '@app/shared/constants';
import { LoadViewParams, LoadViewFunds, LoadPublicKey, LoadIncoming } from '@core/api';
import { selectTransactions } from '@app/shared/store/selectors';

import { actions } from '.';
import store from '../../../../index';
import { BridgeTransaction, FaucetAppParams, FaucetFund, IncomingTransaction, Transaction } from '@app/core/types';

import { setIsLoaded } from '@app/shared/store/actions';
import { selectIsLoaded } from '@app/shared/store/selectors';
import { RateResponse } from '../interfaces';

const FETCH_INTERVAL = 310000;
const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const RATE_PARAMS = 'ids=beam&vs_currencies=usd';

export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadAppParams.request>,
  ): Generator {
    try {
      const pkey = yield call(LoadPublicKey, action.payload ? action.payload : null, CURRENCIES[0].cid);
      console.log(pkey);

      let bridgeTransactions: BridgeTransaction[] = [];
      for (let curr of CURRENCIES) {
        const trs = (yield call(LoadIncoming, curr.cid)) as IncomingTransaction[];
       
        trs.forEach((item, i) => {
          bridgeTransactions.push({
            amount: item.amount,
            cid: curr.cid,
            pid: i,
            id: item.MsgId,
            status: ''
          })
        });
      }

      yield put(actions.setBridgeTransactions(bridgeTransactions));
    
      const isLoaded = yield select(selectIsLoaded());
      if (!isLoaded) {
        store.dispatch(setIsLoaded(true));
        yield put(navigate(ROUTES.MAIN.MAIN_PAGE));
      }
    } catch (e) {
      yield put(actions.loadAppParams.failure(e));
    }
}

async function loadRatesApiCall() {
  const response = await fetch(`${API_URL}?${RATE_PARAMS}`);
  const promise: RateResponse = await response.json();
  return promise.beam.usd;
}

export function* loadRate() {
  try {
    const result: number = yield call(loadRatesApiCall);

    yield put(actions.loadRate.success(result));
    setTimeout(() => store.dispatch(actions.loadRate.request()), FETCH_INTERVAL);
  } catch (e) {
    yield put(actions.loadRate.failure(e));
  }
}

function* mainSaga() {
    yield takeLatest(actions.loadAppParams.request, loadParamsSaga);
    yield takeLatest(actions.loadRate.request, loadRate);
}

export default mainSaga;
