import { CurrencyRateData, CurrencyService } from "@tracing/domain/services/currency/CurrencyService";

const RATES: CurrencyRateData[] = [
    { iso: "ARS", symbol: "$", conversion_rate: 366.56184 },
    { iso: "CAD", symbol: "$", conversion_rate: 1.444327 },
    { iso: "USD", symbol: "$", conversion_rate: 1.04725 },
    { iso: 'AUD', symbol: '$', conversion_rate: 1.660296 },
    { iso: 'EUR', symbol: '€', conversion_rate: 1 },
    { iso: 'GBP', symbol: '£', conversion_rate: 0.865194 },
];

export class MockCurrencyService implements CurrencyService {
    async fetchRateFor(isos: string[]): Promise<CurrencyRateData[]> {
        return RATES.filter((rate) => isos.includes(rate.iso));
    }
}
