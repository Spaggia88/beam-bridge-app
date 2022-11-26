import { call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from '@app/shared/store/actions';
import { ROUTES, CURRENCIES } from '@app/shared/constants';
import { LoadPublicKey, LoadIncoming } from '@core/api';
import { calcRelayerFee } from '@core/appUtils';

import { actions } from '.';
import store from '../../../../index';
import { BridgeTransaction, IncomingTransaction } from '@app/core/types';
import { setIsLoaded } from '@app/shared/store/actions';
import { selectIsLoaded } from '@app/shared/store/selectors';

const FETCH_INTERVAL = 5000;
const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const RESERVE_API_URL = 'https://explorer-api.beam.mw/bridges/rates';
const GAS_API_URL = 'https://explorer-api.beam.mw/bridges/gasprice';

export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadAppParams.request>,
  ): Generator {
    try {
      const pkey = yield call(LoadPublicKey, action.payload ? action.payload : null, CURRENCIES[0].cid);

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

async function loadRatesCached() {
  try {
    const response = await fetch(RESERVE_API_URL);
    if (response.status === 200) {
      const promise = await response.json();
      return promise;
    }

    return null;
  } catch (e) {
    return null;
  }
}

async function loadRatesApiCall(rate_ids) {
  try {
    const response = await fetch(`${API_URL}?ids=${rate_ids.join(',')}&vs_currencies=usd`);
    if (response.status === 200) {
      const promise = await response.json();
      return promise;
    } else {
      return await loadRatesCached();
    }
  } catch (error) {
    return await loadRatesCached();
  }
}

interface GasPrice {
  FastGasPrice: string,
  LastBlock: string,
  ProposeGasPrice: string,
  SafeGasPrice: string,
  gasUsedRatio: string,
  suggestBaseFee: string
}

async function loadGasPrice() {
  const response = await fetch(GAS_API_URL);
  const gasPrice = await response.json();
  return gasPrice;
}

async function loadRelayerFee(ethRate: number, currFee: number, gasPrice: GasPrice) {
  const res = await calcRelayerFee(ethRate, currFee, gasPrice);
  return res;
}

export function* loadRate() {
  try {
    let rate_ids = [];
    CURRENCIES.forEach((curr) => {
      rate_ids.push(curr.rate_id);
    });
    rate_ids.push('beam');
    const result = yield call(loadRatesApiCall, rate_ids);
    let feeVals = {};
    const gasPrice = yield call(loadGasPrice);

    for (let item in result) {
      if (item === 'beam') {
        continue;
      }

      const feeVal = yield call(loadRelayerFee, result['ethereum'].usd, result[item].usd, gasPrice);
      const curr = CURRENCIES.find((curr) => curr.rate_id === item)
      feeVals[item] = feeVal.toFixed(curr.fee_decimals);
    }
    yield put(actions.setFeeValues(feeVals));
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
