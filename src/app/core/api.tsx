import Utils from '@core/utils.js';
import React from 'react';
import { toast } from 'react-toastify';
import BigNumber from "bignumber.js";

const CID =  '';

export function LoadPublicKey<T = any>(payload, cid: string): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=get_pk,cid=" + cid, 
        (error, result, full) => {
            resolve(result.pk);
        }, payload ? payload : null);
    });
}

export function LoadIncoming<T = any>(cid): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=manager,action=view_incoming,startFrom=0,cid="+cid, 
        (error, result, full) => {
            resolve(result.incoming);
        });
    });
}

export function SendTo<T = any>(sendData, cid: string): Promise<T> {
    const { amount, address, fee, decimals, selectedCurrency } = sendData;
    const expBy = (new BigNumber(10).exponentiatedBy(decimals));
    const finalAmount = (new BigNumber(amount)).times(expBy).toNumber();
    const relayerFee = (new BigNumber(fee)).times(expBy).toNumber();
    console.log(BigNumber(2).plus(10));
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=send,cid=" + cid + 
        ",amount=" + finalAmount + 
        ",receiver=" + address + 
        ",relayerFee=" + relayerFee, 
        (error, result, full) => {
            onMakeTx(error, result, full);
            resolve(result);
        });
    });
}

export function Receive<T = any>(tr): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=receive,cid=" + tr.cid + ",msgId=" + tr.id, 
        (error, result, full) => {
            onMakeTx(error, result, full);
            resolve(result);
        });
    });
}

export function LoadViewParams<T = any>(payload): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=view_params,cid="+CID, 
        (error, result, full) => {
            resolve(result.params);
        }, payload ? payload : null);
    });
}

export function UserDeposit<T = any>(amount: number, aid: number): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=deposit,amount="+ amount +",aid=" + aid + ",cid=" + CID, 
        (error, result, full) => {
            onMakeTx(error, result, full);
            resolve(result);
        });
    });
}

export function UserWithdraw<T = any>(amount: number, aid: number): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=withdraw,amount="+ amount +",aid=" + aid + ",cid=" + CID, 
        (error, result, full) => {
            onMakeTx(error, result, full);
            resolve(result);
        });
    });
}

const onMakeTx = (err, sres, full, params: {id: number, vote: number} = null, toasted: string = null) => {
    if (err) {
        console.log(err, "Failed to generate transaction request")
    }

    Utils.callApi(
        'process_invoke_data', {data: full.result.raw_data}, 
        (error, result, full) => {
        }
    )
}