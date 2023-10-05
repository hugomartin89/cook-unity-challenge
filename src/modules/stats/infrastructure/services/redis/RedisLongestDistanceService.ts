import { LongestDistance, LongestDistanceNotFoundError, LongestDistanceService } from "@stats/domain/services/longest-distance/LongestDistanceService";
import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

export class RedisLongestDistanceService implements LongestDistanceService {
    private redisClient: RedisClient;
    private key: string;

    constructor(redisClient: RedisClient, key: string = 'longest_distance') {
        this.redisClient = redisClient;
        this.key = key;
    }

    async fetch(): Promise<LongestDistance> {
        const data = await this.redisClient.get(this.key);

        if (!data) {
            throw new LongestDistanceNotFoundError();
        }

        return JSON.parse(data) as LongestDistance;
    }

    async store(data: LongestDistance): Promise<void> {
        await this.redisClient.set(this.key, JSON.stringify(data));
    }
}
