import { GROTHS_IN_BEAM } from '@app/shared/constants';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const LENGTH_MAX = 8;

export const copyToClipboard = (value: string) => {
  let textField = document.createElement('textarea');
  textField.innerText = value;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
};

export function compact(value: string, stringLength: number = 5): string {
  if (value.length <= 11) {
    return value;
  }
  return `${value.substr(0, stringLength)}…${value.substr(-stringLength, stringLength)}`;
}

export function truncate(value: string): string {
  if (!value) {
    return '';
  }

  if (value.length <= LENGTH_MAX) {
    return value;
  }

  return `${value.slice(0, LENGTH_MAX)}…`;
}

export function toUSD(amount: number, rate: number): string {
  switch (true) {
    case amount === 0 || Number.isNaN(amount):
      return '0 USD';
    case amount > 0.011: {
      const value = amount * rate;
      return `${value.toFixed(2)} USD`;
    }
    default:
      return '< 1 cent';
  }
}

export function calcVotingPower(value: number, fullValue: number) {
  if (!value || value == 0) {
    return 0;
  }

  const power = Number((100 / (fullValue / value)).toFixed(2));
  if (power < 1) {
    return '< 1';
  }

  return power;
}

export function fromGroths(value: number): number {
  return value && value !== 0 ? value / GROTHS_IN_BEAM : 0;
}

export function toGroths(value: number): number {
  return value > 0 ? Math.floor(value * GROTHS_IN_BEAM) : 0;
}

export function getSign(positive: boolean): string {
  return positive ? '+ ' : '- ';
}

export function Base64DecodeUrl(str){
  if (str.length % 4 != 0)
    str += ('===').slice(0, 4 - (str.length % 4));
  return str.replace(/-/g, '+').replace(/_/g, '/');
}

export function getProposalId (id: number) {
  if (id < 10) {
      return '000' + id;
  } else if (id < 100) {
      return '00' + id;
  } else if (id < 1000) {
      return '0' + id;
  } 
}

export function Base64EncodeUrl(str){
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

export function openInNewTab (url) {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

export function numFormatter(num) {
  if (num > 999 && num < 1000000) {
      return parseFloat((num / 1000).toFixed(2)) + 'K';  
  } else if (num >= 1000000) {
      return parseFloat((num / 1000000).toFixed(2)) + 'M';
  } else if (num <= 999){
      return parseFloat(num.toFixed(2));
  }
}

async function loadRate (rate_id: string) {
  const response = await fetch(`${API_URL}?ids=${rate_id}&vs_currencies=usd`, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  });
  const promise: Promise<any> = response.json();
  return promise;
}

export async function calcRelayerFee (ethRate, currRate, gasPrice) {
  const RELAY_COSTS_IN_GAS = 120000;
  const {FastGasPrice, ProposeGasPrice} = gasPrice;
  let gasValue = null;
  if (Number(FastGasPrice) > (2 * Number(ProposeGasPrice))) {
    gasValue =  2 * Number(ProposeGasPrice); 
  } else {
    gasValue = Number(FastGasPrice);
  }
  const relayCosts = RELAY_COSTS_IN_GAS * gasValue * ethRate / Math.pow(10, 9);
  const RELAY_SAFETY_COEFF = 2;//1.1;
  return RELAY_SAFETY_COEFF * relayCosts / currRate;
}