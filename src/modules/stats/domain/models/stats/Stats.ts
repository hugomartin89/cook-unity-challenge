import { LongestDistance } from "@stats/domain/services/longest-distance/LongestDistanceService"
import { MostTraced } from "@stats/domain/services/most-traced/MostTracedService";

export type Stats = {
    readonly longest_distance: LongestDistance;
    readonly most_traced: MostTraced;
}
