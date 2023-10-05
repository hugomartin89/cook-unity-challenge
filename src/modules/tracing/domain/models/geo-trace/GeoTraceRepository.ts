import { GeoTrace, GeoTraceMostTraced } from "./GeoTrace";

export interface GeoTraceRepository {
    findByIp(ip: string): Promise<GeoTrace>;
    findByLongestDistanceToUsa(): Promise<GeoTrace>;
    store(trace: GeoTrace): Promise<void>;
    findMostTraced(): Promise<GeoTraceMostTraced>;
}
