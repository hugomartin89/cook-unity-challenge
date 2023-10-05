export type GeolocationData = {
    readonly ip: string;
    readonly name: string;
    readonly code: string;
    readonly lat: number;
    readonly lon: number;
    readonly currency: string;
    readonly distance_to_usa: number;
}

export interface GeolocationService {
    fetchDataForIp(ip: string): Promise<GeolocationData>;
}
