export interface SendParams {
    decimals: number,
    amount: number,
    address: string,
    fee: number
}

export interface Currency {
    id: number,
    decimals: number,
    name: string
}