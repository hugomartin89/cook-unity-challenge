import express from 'express';
import { Container } from 'typedi';
import { EventManager } from '@core/event-bus';
import { FixerCurrencyService } from './infrastructure/services/fixer/FixerCurrencyService';
import { IpApiGeolocationService } from './infrastructure/services/ip-api/IpApiGeolocationService';
import { MockCurrencyService } from './infrastructure/services/mock/MockCurrencyService';
import { MockGeolocationService } from './infrastructure/services/mock/MockGeolocationService';
import { PrismaClient } from '@prisma/client';
import { PrismaGeoTraceRepository } from './infrastructure/models/trace/PrismaGeoTraceRepository';
import { RegisterTraceController } from './infrastructure/controllers/RegisterTraceController';

const configureDiServices = () => {
    const prismaClient = new PrismaClient();

    Container.set('EventManager', EventManager.getInstance());

    Container.set('GeoTraceRepository', new PrismaGeoTraceRepository(prismaClient));

    Container.set('GeolocationService',
        process.env.GEOLOCATION_SERVICE_DRIVER == 'ip-api'
            ? new IpApiGeolocationService()
            : new MockGeolocationService()
    );

    Container.set('CurrencyService',
        process.env.CURRENCY_SERVICE_DRIVER == 'fixer.io'
            ? new FixerCurrencyService(
                process.env.FIXER_API_URL,
                process.env.FIXER_API_KEY,
                process.env.FIXER_PLAN,
                process.env.FIXER_BASE
            )
            : new MockCurrencyService()
    );
}

export const InstallTracesModule = async (root: string, app: express.Application) => {
    configureDiServices();

    const router = express.Router();

    router.post('', RegisterTraceController);

    // mount the router
    app.use(root, router);
};
