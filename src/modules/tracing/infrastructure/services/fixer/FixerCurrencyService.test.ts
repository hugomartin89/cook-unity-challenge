import { FixerCurrencyService } from './FixerCurrencyService';
import { describe, expect, it } from 'vitest';

describe('FixerCurrencyService integration suite', () => {
    const fixerCurrencyService = new FixerCurrencyService(
        process.env.FIXER_API_URL,
        process.env.FIXER_API_KEY,
        process.env.FIXER_PLAN,
        process.env.FIXER_BASE
    );

    it('Should validate correct response from service', async () => {
        const isoCurrencies = ['ARS', 'CAD', 'USD', 'EUR', 'GBP'];
        const currencyRateData = await fixerCurrencyService.fetchRateFor(isoCurrencies);

        expect(currencyRateData).not.toBeNull();
        expect(currencyRateData).toHaveLength(isoCurrencies.length);
    });
});
