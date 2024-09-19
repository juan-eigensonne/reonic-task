declare module 'reonic' {
    export type arrivalProbabilityForTime = {
        start: number;
        end: number;
        probability: number;
    };

    export type chargePoint = {
        chargeSpeed: number;
        busyTimeStart?: number;
        busyTimeEnd?: number;
    };

    export type chargingDistanceProbabilities = {
        rangeStart: number;
        rangeEnd: number;
        distanceNeeded: number;
    };

    export type TickResponse = {
        updatedChargePointList: chargePoint[];
        powerDemanded: number;
        consumedEnergyInTick: number;
        time: number;
    };
}
