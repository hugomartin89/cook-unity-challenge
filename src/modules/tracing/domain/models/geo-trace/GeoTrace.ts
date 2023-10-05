export type GeoTrace = {
    readonly ip: string;
    readonly name: string;
    readonly code: string;
    readonly lat: number;
    readonly lon: number;
    readonly currency: string;
    readonly distance_to_usa: number;
}

export type GeoTraceMostTraced = {
    readonly name: string;
    readonly count: number;
}
