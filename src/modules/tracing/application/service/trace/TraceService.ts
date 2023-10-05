import { CurrencyService } from "@tracing/domain/services/currency/CurrencyService";
import { DistanceCalculator } from "@tracing/domain/utils/DistanceCalculator";
import { EventManager } from "@core/event-bus";
import { GeoTrace } from "@tracing/domain/models/geo-trace/GeoTrace";
import { GeoTraceNotFoundError } from "@tracing/domain/models/geo-trace/GeoTraceNotFoundError";
import { GeoTraceRepository } from "@tracing/domain/models/geo-trace/GeoTraceRepository";
import { GeoTraceStoredEvent } from "@tracing/domain/models/geo-trace/GeoTraceStoredEvent";
import { GeolocationData, GeolocationService } from "@tracing/domain/services/geolocation/GeolocationService";
import { Trace } from "@tracing/domain/models/trace/Trace";

export class TraceService {
    private eventManager: EventManager;
    private geoTraceRepository: GeoTraceRepository;
    private geolocationService: GeolocationService;
    private currencyService: CurrencyService;

    constructor(
        eventManager: EventManager,
        geoTraceRepository: GeoTraceRepository,
        geolocationService: GeolocationService,
        currencyService: CurrencyService
    ) {
        this.eventManager = eventManager;
        this.geoTraceRepository = geoTraceRepository;
        this.geolocationService = geolocationService;
        this.currencyService = currencyService;
    }

    private fromGeolocationData(data: GeolocationData): GeoTrace {
        const distanceCalculator = DistanceCalculator.fromNewYork();

        return {
            ...data,
            distance_to_usa: distanceCalculator.getDistanceFromLatLonInKm(
                data.lat,
                data.lon
            )
        };
    }

    private async fromGeoTraceData(data: GeoTrace): Promise<Trace> {
        return {
            ...data,
            currencies: await this.currencyService.fetchRateFor(['USD', data.currency])
        }
    }

    public async getByIp(ip: string): Promise<Trace> {
        let geoTrace = null;
        let trace = null;

        try {
            // let's try to find all data
            geoTrace = await this.geoTraceRepository.findByIp(ip);
            trace = this.fromGeoTraceData(geoTrace);
        } catch (error) {
            if (!(error instanceof GeoTraceNotFoundError)) {
                throw error;
            }

            // if fails, then we need to try to get from
            // external service
            const geolocationData = await this.geolocationService.fetchDataForIp(ip);

            if (!geolocationData.code) {
                throw new GeoTraceNotFoundError();
            }

            geoTrace = this.fromGeolocationData(geolocationData);
            this.geoTraceRepository.store(geoTrace);

            trace = this.fromGeoTraceData(geoTrace);
        }

        // let's notify a new GeoTraceStoredEvent was raised!
        this.eventManager.dispatch(new GeoTraceStoredEvent(geoTrace));

        return trace;
    }
}
