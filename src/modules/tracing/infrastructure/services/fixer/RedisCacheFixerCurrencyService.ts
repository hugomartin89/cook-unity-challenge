import { CurrencyRateData, CurrencyService } from "@tracing/domain/services/currency/CurrencyService";
import { FixerCurrencyService } from './FixerCurrencyService';
import { createClient } from 'redis';
import getSymbolFromCurrency from "currency-symbol-map";

type RedisClient = ReturnType<typeof createClient>;

export class RedisCacheFixerCurrencyService implements CurrencyService {
    private redisClient: RedisClient;
    private fixerCurrencyService: FixerCurrencyService;

    public constructor(redisClient: RedisClient, apiUrl: string, apiKey: string, apiPlan: string = 'free', base: string = 'USD') {
        this.redisClient = redisClient;
        this.fixerCurrencyService = new FixerCurrencyService(apiUrl, apiKey, apiPlan, base);
    }

    public async fetchRateFor(isos: string[]): Promise<CurrencyRateData[]> {
        const missing: string[] = [];
        const currencyRates: CurrencyRateData[] = [];

        const promises = isos.map(async (iso) => {
            const rate = await this.redisClient.get(`currency_rate:${iso}`);

            if (rate) {
                currencyRates.push({
                    iso: iso,
                    symbol: getSymbolFromCurrency(iso) as string,
                    conversion_rate: JSON.parse(rate)
                });
            } else {
                missing.push(iso);
            }
        });

        await Promise.all(promises)

        if (missing.length) {
            const missingCurrencyRates = await this.fixerCurrencyService.fetchRateFor(missing);
            currencyRates.push(...missingCurrencyRates);

            missingCurrencyRates.forEach(async (rate) => {
                await this.redisClient.set(`currency_rate:${rate.iso}`, rate.conversion_rate);
                await this.redisClient.expireAt(`currency_rage:${rate.iso}`, 60 * 60);
            });
        }

        return currencyRates;
    }
}
