import express from 'express';
import redis from 'redis';
import { ComputeMostTracedListener } from './infrastructure/listeners/ComputeMostTracedListener';
import { Container } from 'typedi';
import { EventManager } from '@core/event-bus';
import { RedisLongestDistanceService } from './infrastructure/services/redis/RedisLongestDistanceService';
import { RedisMostTracedService } from './infrastructure/services/redis/RedisMostTracedService';
import { StoreLongestDistanceListener } from '@stats/infrastructure/listeners/StoreLongestDistanceListener';
import { FetchStatsController } from './infrastructure/controllers/FetchStatsController';

const redisClient = redis.createClient();

const configureDiServices = async () => {
    await redisClient.connect();

    Container.set('EventManager', EventManager.getInstance());
    Container.set('LongestDistanceService', new RedisLongestDistanceService(redisClient));
    Container.set('MostTracedService', new RedisMostTracedService(redisClient));
}

const setupEventListeners = async () => {
    const eventManager = EventManager.getInstance();

    eventManager.subscribe(new StoreLongestDistanceListener(Container.get('LongestDistanceService')));
    eventManager.subscribe(new ComputeMostTracedListener(Container.get('MostTracedService'), Container.get('GeoTraceRepository')));
}

export const InstallStatsModule = async (root: string, app: express.Application) => {
    await configureDiServices();

    await setupEventListeners();

    // configure event listeners
    const router = express.Router();


    router.get('', FetchStatsController);

    // mount the router
    app.use(root, router);
};