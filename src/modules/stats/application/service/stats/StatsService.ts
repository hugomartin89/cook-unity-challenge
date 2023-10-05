import { LongestDistanceService } from "@stats/domain/services/longest-distance/LongestDistanceService";
import { MostTracedService } from "@stats/domain/services/most-traced/MostTracedService";
import { Stats } from "@stats/domain/models/stats/Stats";

export class StatsService {
    private longestDistanceService: LongestDistanceService;
    private mostTracedService: MostTracedService;

    constructor(longestDistanceService: LongestDistanceService, mostTracedService: MostTracedService) {
        this.longestDistanceService = longestDistanceService;
        this.mostTracedService = mostTracedService;
    }

    async fetchStats(): Promise<Stats> {
        return {
            longest_distance: await this.longestDistanceService.fetch(),
            most_traced: await this.mostTracedService.fetch()
        };
    }
}

