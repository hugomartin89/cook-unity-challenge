import { MockGeolocationService } from './MockGeolocationService';
import { describe, expect, it } from 'vitest';

describe('MockGeolocationService unit test suite', () => {
    const geolocationService = new MockGeolocationService();

    it('Should test basic response from mock service', async () => {
        const ArgentinaIp = '190.191.237.90';
        const IndiaIp = '115.240.90.163';
        const MexicoIp = '8.14.232.132';

        const argentinaResponse = await geolocationService.fetchDataForIp(ArgentinaIp);

        expect(argentinaResponse).not.toBeNull();
        expect(argentinaResponse.name).toBe('Argentina');
        expect(argentinaResponse.code).toBe('AR');
        expect(argentinaResponse.lat).not.toBeNull();
        expect(argentinaResponse.lon).not.toBeNull();
        expect(argentinaResponse.currency).not.toBeNull();

        const indiaResponse = await geolocationService.fetchDataForIp(IndiaIp);

        expect(indiaResponse).not.toBeNull();
        expect(indiaResponse.name).toBe('India');
        expect(indiaResponse.code).toBe('IN');
        expect(indiaResponse.lat).not.toBeNull();
        expect(indiaResponse.lon).not.toBeNull();
        expect(indiaResponse.currency).not.toBeNull();

        const mexicoResponse = await geolocationService.fetchDataForIp(MexicoIp);

        expect(mexicoResponse).not.toBeNull();
        expect(mexicoResponse.name).toBe('Mexico');
        expect(mexicoResponse.code).toBe('MX');
        expect(mexicoResponse.lat).not.toBeNull();
        expect(mexicoResponse.lon).not.toBeNull();
        expect(mexicoResponse.currency).not.toBeNull();
    });
});
