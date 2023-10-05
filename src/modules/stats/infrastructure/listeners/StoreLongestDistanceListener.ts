import { GeoTraceStoredEvent } from "@tracing/domain/models/geo-trace/GeoTraceStoredEvent";
import { Listener } from "@core/event-bus";
import { LongestDistanceNotFoundError, LongestDistanceService } from "@stats/domain/services/longest-distance/LongestDistanceService";

/**
 * Handles a GeoTraceStoredEvent and computes the most longest
 * distance from USA (New York) and stores it into cache.
 */
export class StoreLongestDistanceListener implements Listener<GeoTraceStoredEvent> {
    private longestDistanceService: LongestDistanceService;

    constructor(longestDistanceService: LongestDistanceService) {
        this.longestDistanceService = longestDistanceService;
    }

    shouldHandle(event: GeoTraceStoredEvent): boolean {
        return event instanceof GeoTraceStoredEvent;
    }

    async handle(event: GeoTraceStoredEvent): Promise<void> {
        const payload = event.getPayload();
        let shouldUpdate = false;

        try {
            const current = await this.longestDistanceService.fetch();

            shouldUpdate = payload.distance_to_usa >= current.value;
        } catch (error) {
            if (!(error instanceof LongestDistanceNotFoundError)) {
                throw error;
            }

            shouldUpdate = true;
        } finally {
            if (shouldUpdate) {
                await this.longestDistanceService.store({
                    country: payload.name,
                    value: payload.distance_to_usa
                });
            }
        }
    }
}
