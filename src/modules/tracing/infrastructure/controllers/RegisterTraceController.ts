import { Container } from "typedi";
import { EventManager } from "@core/event-bus";
import { GeolocationService } from '@tracing/domain/services/geolocation/GeolocationService';
import { Request, Response } from "express";
import { GeoTraceRepository } from "@tracing/domain/models/geo-trace/GeoTraceRepository";
import { TraceService } from "@tracing/application/service/trace/TraceService";
import { CurrencyService } from "@tracing/domain/services/currency/CurrencyService";

export const RegisterTraceController = async (req: Request, res: Response) => {
    try {
        const traceService = new TraceService(
            Container.get<EventManager>('EventManager'),
            Container.get<GeoTraceRepository>('GeoTraceRepository'),
            Container.get<GeolocationService>('GeolocationService'),
            Container.get<CurrencyService>('CurrencyService')
        );

        const trace = await traceService.getByIp(req.body.ip);

        res.status(201).json(trace);
    } catch (error) {
        res.status(500).json({
            message: 'Unexpected error occurred, try again',
            error: error
        });
    }
};
