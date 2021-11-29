import { sample, createEvent } from 'effector';
import React from 'react';
import { 
    setReady
} from './shared';
import AppCore, { AppEvent } from '@core/AppCore';
import { SendParams, currencies, Transaction } from '@core/types';

export enum RPCMethod {
    GetPk = 'get_pk',
    ViewIncoming =   'view_incoming',
    Receive = 'receive',
    Send = 'send'
}
import Utils from '@core/utils.js';

export const rpcAppEvent = createEvent<AppEvent>();

export async function initApp() {
    Utils.initialize({
        "appname": "BEAM Bridge app",
        "min_api_version": "6.1",
        "headless": false,
        "apiResultHandler": (...args) => {
            console.log('handler:', ...args)
        }
      }, (err) => {
        Utils.download("./pipe_app.wasm", (err, bytes) => {
            Utils.invokeContract("role=user,action=get_pk,cid="+currencies[0].cid, 
            (...args) => {
                setReady(true);
                AppCore.pkLoaded(...args);
            }, bytes);

            AppCore.loadViewIncome();
            setInterval(() => {
                AppCore.loadViewIncome();
            }, 3000);
        })
      });
}

export async function receive(tr: Transaction) {
    Utils.invokeContract("role=user,action=receive,cid=" + tr.cid + ",msgId=" + tr.id, 
    (...args) => {
        AppCore.onMakeTx(...args);
    });
}

export async function send(params: SendParams, cid: string) {
    const { amount, address, fee, decimals } = params;
    const finalAmount = amount * Math.pow(10, decimals)
    const relayerFee = fee * Math.pow(10, decimals);

    Utils.invokeContract("role=user,action=send,cid=" + cid + 
    ",amount=" + finalAmount + 
    ",receiver=" + address + 
    ",relayerFee=" + relayerFee, 
    (...args) => {
        AppCore.onMakeTx(...args);
    });
}

// TODO: implement depending on the type of token
// in case the data is not hardcoded
// function getTokenDecimals(id) {
//
// }