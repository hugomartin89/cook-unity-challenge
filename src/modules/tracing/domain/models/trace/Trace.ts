import { CurrencyRateData } from "@tracing/domain/services/currency/CurrencyService";

export type Trace = {
    readonly ip: string;
    readonly name: string;
    readonly code: string;
    readonly lat: number;
    readonly lon: number;
    readonly currencies: CurrencyRateData[],
    readonly distance_to_usa: number;
}
