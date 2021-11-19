import React, { useState } from 'react';
import { 
  View, setView, setReady, addTransactions, setPkey

} from './../state/shared';
import Utils from '@core/utils.js';
import { Transaction } from './types';

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
        console.info(event);
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
      setReady(true);
  });
  }

  static viewIncomingLoaded(cid, err, res) {
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

      addTransactions(trs);
    }

    console.log('view params res:', res);
    setReady(true);
  }

  static onMakeTx (err, res, full) {
    // if (err) {
    //     return this.setError(err, "Failed to generate transaction request")
    // }

    Utils.callApi(
        'process_invoke_data', {data: full.result.raw_data}, 
        (...args) => {}
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
}