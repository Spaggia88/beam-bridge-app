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
    {name: "bUSDT", id: 1, decimals: 8, cid: '3167ec1c51270cd9c7be5685d3b825ee20235982375bf4e1392e4a5bb0f66cec'},
    {name:'bETH', id: 2, decimals: 8, cid: 'b8220407dea1d7f764df40ade9bb01a3e89ad6299c23dc8675e495ff018c80e3'},
    {name:'bDAI', id: 3, decimals: 8, cid: 'af3e4f34edc2f785fe70520cae7d4b6254d1cbb9809b2702964e7233f8c23f3c'},
    {name:'bWBTC', id: 4, decimals: 8, cid: '210701a3cbc6bd4204d4aef2be397163fc50638d3f1be722d3ceebe0e3cfe428'},
];;