import { Container } from "typedi";
import { LongestDistanceService } from "@stats/domain/services/longest-distance/LongestDistanceService";
import { MostTracedService } from "@stats/domain/services/most-traced/MostTracedService";
import { Request, Response } from "express";
import { StatsService } from "@stats/application/service/stats/StatsService";

export const FetchStatsController = async (_req: Request, res: Response) => {
    try {
        const statsService = new StatsService(
            Container.get<LongestDistanceService>('LongestDistanceService'),
            Container.get<MostTracedService>('MostTracedService'),
        );

        const stats = await statsService.fetchStats();

        res.status(201).json(stats);
    } catch (error) {
        res.status(500).json({
            message: 'Unexpected error occurred, try again',
            error: error
        });
    }
};
