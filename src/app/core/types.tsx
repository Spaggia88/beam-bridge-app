export type Pallete = 'green' | 'ghost' | 'purple' | 'blue' | 'red' | 'white' | 'disconnect';

export type ButtonVariant = 'regular' | 'ghost' | 'block' | 'link' | 'icon' | 'validate' | 'darkest_blue' | 'revoke';

export interface SendParams {
    decimals: number,
    amount: number,
    address: string,
    fee: number
}

export interface Currency {
    id: number,
    rate_id: string,
    decimals: number,
    name: string,
    cid: string,
    fee_decimals: number
}

export interface Transaction {
    pid: number,
    status: string,
    id: string,
    amount: string,
    cid: string
}

export interface GasPrice {
    FastGasPrice: string,
    LastBlock: string,
    ProposeGasPrice: string,
    SafeGasPrice: string,
    gasUsedRatio: string,
    suggestBaseFee: string
}

export const currencies : Currency[] = [
    {
        name: 'bUSDT',
        rate_id: 'tether',
        id: 1,
        decimals: 8,
        fee_decimals: 6,
        cid: '4f8892c4df5b14c988225d4c207e37f813c14e7c72790c40bcc679f5e11260dc'
    },
    {
        name:'bETH', 
        rate_id: 'ethereum',
        id: 2,
        decimals: 8,
        fee_decimals: 8,
        cid: '51793f69da15ffbe06fbc401a1936692e5a30a413bfe59c69db87f9f029c5b9f'
    },
    {
        name:'bDAI',
        rate_id: 'dai',
        id: 3,
        decimals: 8,
        fee_decimals: 8,
        cid: '0ac114de582cc964205e84293e280b490a7339310f2eeacb4f6dd29a1e27b730'
    },
    {
        name:'bWBTC',
        rate_id: 'wrapped-bitcoin',
        id: 4,
        decimals: 8,
        fee_decimals: 8,
        cid: 'd783a8185610a1de5e654cb1ad3a0d76dd870b06a0b872b802c8e61a103d3574'
    },
];;