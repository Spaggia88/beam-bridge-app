import React, { useState } from 'react';
import { 
  setIsInProgress, setTransactions, setPkey

} from '@state/shared';
import Utils from '@core/utils.js';
import { Transaction, currencies } from '@core/types';

const IN_PROGRESS_ID = 5;
const RECEIVE_COMMENT = 'Receive funds';

export enum RPCMethod {
  GetPk = 'get_pk',
  ViewIncoming =   'view_incoming',
  Receive = 'receive',
  Send = 'send'
}

export interface AppEvent {
  id: RPCMethod;
  result: any;
}

type AppEventHandler = {
  (event: AppEvent): void;
};

const utils = new Utils();
let transactions: Transaction[] = [];
let updateCounter = 0;

export default class AppCore {
  private static instance: AppCore;

  private eventHandler: AppEventHandler;
  private shaderBytes: any;

  static getInstance() {
    if (this.instance != null) {
      return this.instance;
    }
    this.instance = new AppCore();
    return this.instance;
  }

  constructor() {}

  public init(handler: AppEventHandler) {
    this.eventHandler = handler;
  }

  public start(shaderPath: string) {
    utils.onLoad(async (beamAPI) => {
      const responseHandler = response => {
        const event = JSON.parse(response);
        this.eventHandler(event);
      };
      
      beamAPI.api.callWalletApiResult.connect(responseHandler);
      this.loadShader(shaderPath);
    });
  }

  private loadShader(path: string) {
    utils.download(path, (err, bytes) => {
      if (err) {
          let errTemplate = "Failed to load shader,";
          let errMsg = [errTemplate, err].join(" ");
          console.log(errMsg);
          //return this.setError(errMsg);
      }
      this.shaderBytes = bytes;
      console.log('wasm loaded', bytes);
  });
  }

  static viewIncomingLoaded(cid: string, err, res, full) {
    console.log(updateCounter, 'view incoming result:', res);
    if (updateCounter === 0) {
      transactions = [];
    }
    updateCounter++;

    if (res.incoming !== undefined && res.incoming.length > 0) {
      let trs: Transaction[] = [];
      res.incoming.forEach((item, i) => {
        trs.push({
          amount: item.amount,
          cid: cid,
          pid: i,
          id: item['MsgId'],
          status: ''
        })
      });

      transactions = transactions.concat(trs);      
    }

    if (updateCounter === 4) {
      setTransactions([...transactions]);
      updateCounter = 0;
      transactions = [];
    }
  }

  static appTransactionsLoaded(err, res) {
    const trInProgress = res.find((item) => {
      return item.status === IN_PROGRESS_ID && item.comment === RECEIVE_COMMENT
    })
    
    setIsInProgress(trInProgress !== undefined);
  }

  static onMakeTx (err, res, full) {
    // if (err) {
    //     return this.setError(err, "Failed to generate transaction request")
    // }

    Utils.callApi(
        'process_invoke_data', {data: full.result.raw_data}, 
        (...args) => {
          console.log(...args)
        }
    )
  }

  static pkLoaded(err, res) {
    setPkey(res.pk);
  } 

  static loadPKey(cid: string) {
    Utils.invokeContract("role=user,action=get_pk,cid="+cid, 
    (...args) => {
        AppCore.pkLoaded(...args);
    });
  }

  static loadViewIncome () {
    currencies.forEach((item) => {
        Utils.invokeContract("role=manager,action=view_incoming,startFrom=0,cid="+item.cid, 
        (...args) => {
            AppCore.viewIncomingLoaded(item.cid, ...args);
        });
    });
    //setTransactions(transactions);
    //transactions = [];
    AppCore.loadAppTransactions();
    console.log(AppCore.loadGasPrice());
  };

  static loadAppTransactions () {
    Utils.callApi(
      'tx_list', {}, 
      (...args) => {
        AppCore.appTransactionsLoaded(...args);
    });
  }

  static async loadGasPrice () {
    const response = await fetch(`https://masternet-explorer.beam.mw/bridges/gasprice`);
    return response.json();
  }
}