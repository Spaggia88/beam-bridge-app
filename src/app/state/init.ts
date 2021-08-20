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

const CONTRACT_ID = "5ed7f2d7821ae50e775d4d6951cc446b3cd56b9d50626d9f37b8ad02a9e95c4e";
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
            setIncome([{pid: 1, status: '', id: '1', amount: '50000000' },
                {pid: 2, id: '2', status: '', amount: '600000000' },
                {pid: 3, status: '', id: '3', amount: '9000000000' }])
            break;
        case RPCMethod.Send || RPCMethod.Receive:
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