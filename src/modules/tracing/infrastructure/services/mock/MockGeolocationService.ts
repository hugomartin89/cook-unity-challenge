import { DistanceCalculator } from "@tracing/domain/utils/DistanceCalculator";
import { GeolocationData, GeolocationService } from "@tracing/domain/services/geolocation/GeolocationService";

const GEOLOCATIONS = [
    {
        ip: '1.1.1.1',
        name: 'Australia',
        code: 'AU',
        lat: -33.494,
        lon: 143.2104,
        currency: 'AUD',
    },
    {
        ip: '8.8.8.8',
        name: 'United States',
        code: 'US',
        lat: 37.751,
        lon: -97.822,
        currency: 'USD',
    },
    {
        ip: '190.191.237.90',
        name: 'Argentina',
        code: 'AR',
        lat: -36,
        lon: -59.9964,
        currency: 'ARS',
    },
    {
        ip: '115.240.90.163',
        name: 'India',
        code: 'IN',
        lat: 23.3426,
        lon: 85.3099,
        currency: 'INR',
    },
    {
        ip: '8.14.232.132',
        name: 'Mexico',
        code: 'MX',
        lat: 19.3574,
        lon: -99.2752,
        currency: 'MXN',
    }
];

export class MockGeolocationService implements GeolocationService {
    async fetchDataForIp(ip: string): Promise<GeolocationData> {
        const distanceCalculator = DistanceCalculator.fromNewYork();
        const index = GEOLOCATIONS.findIndex((geolocation) => geolocation.ip === ip);
        const geolocationData = GEOLOCATIONS[index];

        return {
            ...geolocationData,
            distance_to_usa: distanceCalculator.getDistanceFromLatLonInKm(
                geolocationData.lat,
                geolocationData.lon
            )
        };
    }
}
