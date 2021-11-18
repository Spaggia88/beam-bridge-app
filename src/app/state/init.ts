import { sample, createEvent } from 'effector';
import React from 'react';
import { 
    setReady
} from './shared';
import AppCore, { AppEvent } from '@core/AppCore';
import { SendParams, currencies } from '@core/types';

export enum RPCMethod {
    GetPk = 'get_pk',
    ViewIncoming =   'view_incoming',
    Receive = 'receive',
    Send = 'send'
}
import Utils from '@core/utils.js';

export const rpcAppEvent = createEvent<AppEvent>();

export async function initApp() {
    // dapp.init(rpcAppEvent);
    // dapp.start('./pipe_app.wasm');
    // $ready.watch(value => {
    //     if (value !== null && value) {
    //         dapp.initApiCall("get_pk", "invoke_contract", {
    //             create_tx: false,
    //             args: "role=user,action=get_pk,cid=" + CONTRACT_ID
    //         });
    //         dapp.intervalCall("view_incoming", "invoke_contract", {
    //             create_tx: false,
    //             args: "role=manager,action=view_incoming,startFrom=0,cid=" + CONTRACT_ID
    //         });
    //     }
    // });

    Utils.initialize({
        "appname": "BEAM Bridge app",
        "min_api_version": "6.1",
        "headless": false,
        "apiResultHandler": (...args) => { console.log(...args) }
      }, (err) => {
        Utils.download("./pipe_app.wasm", (err, bytes) => {
            setReady(true);
            // Utils.invokeContract("role=manager,action=view_incoming,cid=" + currencies[0].cid, 
            //     (...args) => AppCore.viewIncomingLoaded(...args), bytes);
        })
      });
}

export async function receive(id: string, cid: string) {
    Utils.invokeContract("role=user,action=receive,cid=" + cid + ",msgId=" + id, 
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