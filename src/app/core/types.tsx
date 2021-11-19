export interface SendParams {
    decimals: number,
    amount: number,
    address: string,
    fee: number
}

export interface Currency {
    id: number,
    decimals: number,
    name: string,
    cid: string
}

export interface Transaction {
    pid: number,
    status: string,
    id: string,
    amount: string,
    cid: string
}

export const currencies : Currency[] = [
    {name: "bUSDT", id: 1, decimals: 8, cid: '7617af66e36084a763019544094bf1586096b2befef348c14d369c69aa9c99f7'},
    {name:'bWBTC', id: 2, decimals: 8, cid: '7617af66e36084a763019544094bf1586096b2befef348c14d369c69aa9c99f7'},
    {name:'bDAI', id: 3, decimals: 8, cid: '7617af66e36084a763019544094bf1586096b2befef348c14d369c69aa9c99f7'}
];