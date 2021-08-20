import { sample, createEvent } from 'effector';
import React from 'react';
import { 
    View, setView,
    $ready, setPkey,
    setIncome
} from './shared';
import AppCore, { AppEvent } from '@core/AppCore';

export enum RPCMethod {
    GetPk = 'get_pk',
    ViewIncoming =   'view_incoming',
    Receive = 'receive',
    Send = 'send'
}

const CONTRACT_ID = "e47369d042c450e45a2e1526eb23b07dab7522418fc07dd32296e4466cc8bc6b";
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
                args: "role=manager,action=view_incoming,iStartFrom=0,cid=" + CONTRACT_ID
            });
          break;
        case RPCMethod.ViewIncoming:
            shaderOut = JSON.parse(result.output)
            console.log(shaderOut);
            const income = shaderOut.incoming;

            if (income !== undefined && income.length > 0) {
                setIncome(income);
                console.log('added')
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
    dapp.start('./bridges.wasm');
    $ready.watch(value => {
        if (value !== null && value) {
            dapp.initApiCall("get_pk", "invoke_contract", {
                create_tx: false,
                args: "role=user,action=get_pk,cid=" + CONTRACT_ID
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

export async function send(amount: number, address: string) {
    dapp.apiCall("send", "invoke_contract", {
        create_tx: false,
        args: "role=user,action=send,cid=" + CONTRACT_ID + 
            ",amount=" + amount + 
            ",receiver=" + address
    });
}