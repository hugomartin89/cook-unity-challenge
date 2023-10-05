export class DistanceCalculator {
    private originLat: number;
    private originLon: number;

    public constructor(originLat: number, originLon: number) {
        this.originLat = originLat;
        this.originLon = originLon;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    public getDistanceFromLatLonInKm(lat: number, lon: number): number {
        const lat1 = this.originLat;
        const lon1 = this.originLon;
        const lat2 = lat;
        const lon2 = lon;

        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d;
    }

    public static fromNewYork(): DistanceCalculator {
        return new DistanceCalculator(40.730610, -73.935242);
    }
}
