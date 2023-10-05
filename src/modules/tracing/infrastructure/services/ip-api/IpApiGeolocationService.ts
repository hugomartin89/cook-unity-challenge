import superagent from "superagent";
import { GeolocationData, GeolocationService } from "@tracing/domain/services/geolocation/GeolocationService";

type IpApiResponse = {
    readonly query: string;
    readonly country: string;
    readonly countryCode: string;
    readonly lat: number;
    readonly lon: number;
    readonly currency: string;
}

export class IpApiGeolocationService implements GeolocationService {
    private API_ENDPOINT = 'http://ip-api.com/json';

    private async fetchData(query: string): Promise<IpApiResponse> {
        const response = await superagent.get(`${this.API_ENDPOINT}/${query}`)
            .query({
                fields: 'query,country,countryCode,lat,lon,currency'
            });

        return JSON.parse(response.text) as IpApiResponse;
    }

    private transformToDomain(data: IpApiResponse): GeolocationData {
        return {
            ip: data.query,
            name: data.country,
            code: data.countryCode,
            lat: data.lat,
            lon: data.lon,
            currency: data.currency
        }
    }

    async fetchDataForIp(ip: string): Promise<GeolocationData> {
        const data = await this.fetchData(ip);

        return this.transformToDomain(data);
    }
}
