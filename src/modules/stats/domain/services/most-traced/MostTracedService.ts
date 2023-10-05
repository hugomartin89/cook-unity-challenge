export type MostTraced = {
    country: string;
    value: number;
}

export class MostTracedNotFoundError extends Error { }

export interface MostTracedService {
    fetch(): Promise<MostTraced>;
    store(data: MostTraced): Promise<void>;
}
