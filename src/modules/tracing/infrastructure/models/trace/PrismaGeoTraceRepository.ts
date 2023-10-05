import { GeoTrace } from "@tracing/domain/models/geo-trace/GeoTrace";
import { GeoTraceNotFoundError } from "@tracing/domain/models/geo-trace/GeoTraceNotFoundError";
import { GeoTraceRepository } from "@tracing/domain/models/geo-trace/GeoTraceRepository";
import { PrismaClient } from "@prisma/client";

export class PrismaGeoTraceRepository implements GeoTraceRepository {
    private prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    async findByIp(ip: string): Promise<GeoTrace> {
        const geoTrace = await this.prismaClient.geoTraces.findUnique({
            where: { ip: ip }
        });

        if (!geoTrace) {
            throw new GeoTraceNotFoundError();
        }

        return geoTrace;
    }

    async findByLongestDistanceToUsa(): Promise<GeoTrace> {
        const geoTrace = await this.prismaClient.geoTraces.findFirst({
            orderBy: { distance_to_usa: 'desc' }
        });

        if (!geoTrace) {
            throw new GeoTraceNotFoundError();
        }

        return geoTrace;
    }

    async store(geoTrace: GeoTrace): Promise<void> {
        await this.prismaClient.geoTraces.upsert({
            where: { ip: geoTrace.ip },
            create: geoTrace,
            update: geoTrace,
        });
    }
}
