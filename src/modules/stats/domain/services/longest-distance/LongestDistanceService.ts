export type LongestDistance = {
    country: string;
    value: number
}

export class LongestDistanceNotFoundError extends Error { }

export interface LongestDistanceService {
    fetch(): Promise<LongestDistance>;
    store(data: LongestDistance): Promise<void>;
}
