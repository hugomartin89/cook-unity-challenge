import { MostTraced, MostTracedNotFoundError, MostTracedService } from "@stats/domain/services/most-traced/MostTracedService";
import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

export class RedisMostTracedService implements MostTracedService {
    private redisClient: RedisClient;
    private key: string;

    constructor(redisClient: RedisClient, key: string = 'most_traced') {
        this.redisClient = redisClient;
        this.key = key;
    }

    async fetch(): Promise<MostTraced> {
        const data = await this.redisClient.get(this.key);

        if (!data) {
            throw new MostTracedNotFoundError();
        }

        return JSON.parse(data) as MostTraced;
    }

    async store(data: MostTraced): Promise<void> {
        await this.redisClient.set(this.key, JSON.stringify(data));
    }
}
