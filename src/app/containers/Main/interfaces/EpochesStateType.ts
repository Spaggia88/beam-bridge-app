import { BridgeTransaction, FaucetAppParams, FaucetFund } from '@core/types';

export interface FaucetStateType {
  bridgeTransactions: BridgeTransaction[];
  pk: string;
  
  appParams: FaucetAppParams;
  popupsState: {
    deposit: boolean;
    withdraw: boolean;
  };
  rate: number;
  funds: FaucetFund[];
  isDonateInProgress: boolean;
  donatedBeam: number;
  donatedBeamX: number;
}
