import { MockCurrencyService } from './MockCurrencyService';
import { describe, expect, it } from 'vitest';

describe('MockCurrencyService unit test suite', () => {
    const currencyService = new MockCurrencyService();

    it('Should test basic mock response', async () => {
        const isoCurrencies = ['ARS', 'CAD', 'USD', 'EUR', 'GBP'];
        const currencyRateData = await currencyService.fetchRateFor(isoCurrencies);

        expect(currencyRateData).not.toBeNull();
        expect(currencyRateData).toHaveLength(isoCurrencies.length);
    });
});
