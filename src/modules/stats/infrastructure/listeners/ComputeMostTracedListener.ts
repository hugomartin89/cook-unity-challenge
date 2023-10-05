import { GeoTraceRepository } from "@tracing/domain/models/geo-trace/GeoTraceRepository";
import { GeoTraceStoredEvent } from "@tracing/domain/models/geo-trace/GeoTraceStoredEvent";
import { Listener } from "@core/event-bus";
import { MostTracedService } from "@stats/domain/services/most-traced/MostTracedService";

/**
 * Handles an GeoTraceStoredEvent and computes the most
 * traced country.
 */
export class ComputeMostTracedListener implements Listener<GeoTraceStoredEvent> {
    private mostTracedService: MostTracedService;
    private geoTraceRepository: GeoTraceRepository;

    constructor(mostTracedService: MostTracedService, geoTraceRepository: GeoTraceRepository) {
        this.mostTracedService = mostTracedService;
        this.geoTraceRepository = geoTraceRepository;
    }

    shouldHandle(event: GeoTraceStoredEvent): boolean {
        return event instanceof GeoTraceStoredEvent;
    }

    async handle(_event: GeoTraceStoredEvent): Promise<void> {
        const mostTraced = await this.geoTraceRepository.findMostTraced();

        this.mostTracedService.store({
            country: mostTraced.name,
            value: mostTraced.count
        });
    }
}
