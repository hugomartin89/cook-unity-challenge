import getSymbolFromCurrency from 'currency-symbol-map'
import superagent from 'superagent';
import { CurrencyRateData, CurrencyService } from "@tracing/domain/services/currency/CurrencyService";

type Rates = object;

type FixerResponse = {
    readonly success: boolean;
    readonly timestamp: number;
    readonly base: string;
    readonly date: string;
    readonly rates: Rates;
}

interface FixerPlanStrategy {
    buildQuery(isos: string[]): object;
}

class FixerFreePlanStrategy implements FixerPlanStrategy {
    private apiKey: string;

    public constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public buildQuery(isos: string[]): object {
        return {
            access_key: this.apiKey,
            symbols: isos.join(',')
        };
    }
}

class FixerPaidPlanStrategy implements FixerPlanStrategy {
    private apiKey: string;
    private base: string;

    public constructor(apiKey: string, base: string) {
        this.apiKey = apiKey;
        this.base = base;
    }

    public buildQuery(isos: string[]): object {
        return {
            access_key: this.apiKey,
            base: this.base,
            symbols: isos.join(',')
        };
    }
}

export class FixerCurrencyService implements CurrencyService {
    private apiUrl: string;
    private strategy: FixerPlanStrategy;

    public constructor(apiUrl: string, apiKey: string, apiPlan: string = 'free', base: string = 'USD') {
        this.apiUrl = apiUrl;

        switch (apiPlan) {
            case 'paid':
                this.strategy = new FixerPaidPlanStrategy(apiKey, base);
                break;
            default: // free plan by default
                this.strategy = new FixerFreePlanStrategy(apiKey);
                break;
        }
    }

    public async fetchData(isos: string[]): Promise<FixerResponse> {
        const response = await superagent.get(`${this.apiUrl}`)
            .query(this.strategy.buildQuery(isos));

        return JSON.parse(response.text) as FixerResponse;
    }

    public transformToDomain(fixerData: FixerResponse): CurrencyRateData[] {
        const currencyRateData: CurrencyRateData[] = [];

        for (const [key, value] of Object.entries(fixerData.rates)) {
            currencyRateData.push({
                iso: key,
                symbol: getSymbolFromCurrency(key) as string,
                conversion_rate: value as number
            });
        };

        return currencyRateData;
    }

    public async fetchRateFor(isos: string[]): Promise<CurrencyRateData[]> {
        const fixerResponse = await this.fetchData(isos);

        return this.transformToDomain(fixerResponse);
    }
}
