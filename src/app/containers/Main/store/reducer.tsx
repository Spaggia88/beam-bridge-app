import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { FaucetStateType } from '../interfaces';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

const initialState: FaucetStateType = {
  bridgeTransactions: [],
  pk: '',

  appParams: {
    backlogPeriod: 0,
    enabled: 0,
    isAdmin: 0,
    withdrawLimit: 0
  },
  popupsState: {
    withdraw: false,
    deposit: false
  },
  funds: [],
  relayerFee: null,
  rate: 0,
  isDonateInProgress: false,
  donatedBeam: 0,
  donatedBeamX: 0
};

const reducer = createReducer<FaucetStateType, Action>(initialState)
  .handleAction(actions.setBridgeTransactions, (state, action) => produce(state, (nexState) => {
    nexState.bridgeTransactions = action.payload;
  }))


  .handleAction(actions.loadAppParams.success, (state, action) => produce(state, (nexState) => {
    nexState.appParams = action.payload;
  }))
  .handleAction(actions.setPopupState, (state, action) => produce(state, (nexState) => {
    nexState.popupsState[action.payload.type] = action.payload.state;
  }))
  .handleAction(actions.loadRate.success, (state, action) => produce(state, (nexState) => {
    nexState.rate = action.payload;
  }))
  .handleAction(actions.setDonatedBeam, (state, action) => produce(state, (nexState) => {
    nexState.donatedBeam = action.payload;
  }))
  .handleAction(actions.setDonatedBeamx, (state, action) => produce(state, (nexState) => {
    nexState.donatedBeamX = action.payload;
  }))
  .handleAction(actions.setIsInProgress, (state, action) => produce(state, (nexState) => {
    nexState.isDonateInProgress = action.payload;
  }))
  .handleAction(actions.setFeeValues, (state, action) => produce(state, (nexState) => {
    nexState.relayerFee = action.payload;
  }))
  .handleAction(actions.setFaucetFunds, (state, action) => produce(state, (nexState) => {
    nexState.funds = action.payload;
  }));

export { reducer as MainReducer };
