export type GeolocationData = {
    readonly ip: string;
    readonly name: string;
    readonly code: string;
    readonly lat: number;
    readonly lon: number;
    readonly currency: string;
}

export interface GeolocationService {
    fetchDataForIp(ip: string): Promise<GeolocationData>;
}
