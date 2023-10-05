export type CurrencyRateData = {
    readonly iso: string;
    readonly symbol: string;
    readonly conversion_rate: number;
}

export interface CurrencyService {
    fetchRateFor(iso: string[]): Promise<CurrencyRateData[]>;
}
