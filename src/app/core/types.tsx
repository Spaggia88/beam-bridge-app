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
    {name: "bUSDT", id: 1, decimals: 6, cid: '2acc70ebd1bdda9d58c543e83560a35f5f9b06a1861ebde83500790c790d92fe'},
    {name:'bETH', id: 2, decimals: 8, cid: '40306461ecccb777b308643bd6499f9e22c7c6373edb11aae1d32f112c4a79ac'},
    {name:'bDAI', id: 3, decimals: 8, cid: '8d16dab3c94df2edc7e946daadb7df406f920ee0447bedc8744c57a89c1f1fbd'}
];