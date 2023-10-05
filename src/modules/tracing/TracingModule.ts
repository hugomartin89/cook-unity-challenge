import express from 'express';
import redis from 'redis';
import { Container } from 'typedi';
import { EventManager } from '@core/event-bus';
import { IpApiGeolocationService } from './infrastructure/services/ip-api/IpApiGeolocationService';
import { MockCurrencyService } from './infrastructure/services/mock/MockCurrencyService';
import { MockGeolocationService } from './infrastructure/services/mock/MockGeolocationService';
import { PrismaClient } from '@prisma/client';
import { PrismaGeoTraceRepository } from './infrastructure/models/trace/PrismaGeoTraceRepository';
import { RedisCacheFixerCurrencyService } from './infrastructure/services/fixer/RedisCacheFixerCurrencyService';
import { RegisterTraceController } from './infrastructure/controllers/RegisterTraceController';

const prismaClient = new PrismaClient();
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

const configureDiServices = async () => {
    await redisClient.connect();

    Container.set('EventManager', EventManager.getInstance());

    Container.set('GeoTraceRepository', new PrismaGeoTraceRepository(prismaClient));

    Container.set('GeolocationService',
        process.env.GEOLOCATION_SERVICE_DRIVER == 'ip-api'
            ? new IpApiGeolocationService()
            : new MockGeolocationService()
    );

    Container.set('CurrencyService',
        process.env.CURRENCY_SERVICE_DRIVER == 'fixer.io'
            ? new RedisCacheFixerCurrencyService(
                redisClient,
                process.env.FIXER_API_URL,
                process.env.FIXER_API_KEY,
                process.env.FIXER_PLAN,
                process.env.FIXER_BASE
            )
            : new MockCurrencyService()
    );
}

export const InstallTracesModule = async (root: string, app: express.Application) => {
    await configureDiServices();

    const router = express.Router();

    router.post('/', RegisterTraceController);

    // mount the router
    app.use(root, router);
};
