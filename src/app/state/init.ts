import { sample, createEvent } from 'effector';
import React from 'react';
import { 
    View, setView,
    $ready, setPkey,
    setIncome
} from './shared';
import AppCore, { AppEvent } from '@core/AppCore';
import { SendParams } from '@core/types';

export enum RPCMethod {
    GetPk = 'get_pk',
    ViewIncoming =   'view_incoming',
    Receive = 'receive',
    Send = 'send'
}

const CONTRACT_ID = "7617af66e36084a763019544094bf1586096b2befef348c14d369c69aa9c99f7";
export const rpcAppEvent = createEvent<AppEvent>();

const dapp = AppCore.getInstance();

sample({
    source: $ready,
    clock: rpcAppEvent,
    fn: (ready, { id, result }) => {
      let shaderOut = null;
      switch (id) {
        case RPCMethod.GetPk:
            shaderOut = JSON.parse(result.output)
            setPkey(shaderOut.pk);
            dapp.apiCall("view_incoming", "invoke_contract", {
                create_tx: false,
                args: "role=manager,action=view_incoming,startFrom=0,cid=" + CONTRACT_ID
            });
          break;
        case RPCMethod.ViewIncoming:
            try {
                shaderOut = JSON.parse(result.output);
            } catch(e) {
                console.log(e);
                return
            }
            console.log(shaderOut);
            const income = shaderOut.incoming;

            if (income !== undefined && income.length > 0) {
                setIncome(income);
                console.log('added')
            } else {
                setIncome([]);
            }

            break;
        case RPCMethod.Receive:
        case RPCMethod.Send:
            dapp.apiCall("process_invoke_data", "process_invoke_data", {
                data: result.raw_data,
                confirm_comment: ""
            })
        default:
          break;
      }
    },
  });

export async function initApp() {
    dapp.init(rpcAppEvent);
    dapp.start('./pipe_app.wasm');
    $ready.watch(value => {
        if (value !== null && value) {
            dapp.initApiCall("get_pk", "invoke_contract", {
                create_tx: false,
                args: "role=user,action=get_pk,cid=" + CONTRACT_ID
            });
            dapp.intervalCall("view_incoming", "invoke_contract", {
                create_tx: false,
                args: "role=manager,action=view_incoming,startFrom=0,cid=" + CONTRACT_ID
            });
        }
    });
}

export async function receive(id: string) {
    dapp.apiCall("receive", "invoke_contract", {
        create_tx: false,
        args: "role=user,action=receive,cid=" + CONTRACT_ID + ",msgId=" + id
    });
}

export async function send(params: SendParams) {
    const { amount, address, fee, decimals } = params;
    const finalAmount = amount * Math.pow(10, decimals)
    const relayerFee = fee * Math.pow(10, decimals);
    dapp.apiCall("send", "invoke_contract", {
        create_tx: false,
        args: "role=user,action=send,cid=" + CONTRACT_ID + 
            ",amount=" + finalAmount + 
            ",receiver=" + address + 
            ",relayerFee=" + relayerFee
    });
}

// TODO: implement depending on the type of token
// in case the data is not hardcoded
// function getTokenDecimals(id) {
//
// }