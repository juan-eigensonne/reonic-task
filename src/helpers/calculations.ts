import {
    arrivalProbabilityForTime,
    chargePoint,
    chargingDistanceProbabilities,
    TickResponse,
} from 'reonic';

const probabilities: arrivalProbabilityForTime[] = [
    { start: 0, end: 3599, probability: 0.0094 },
    { start: 3600, end: 7199, probability: 0.0094 },
    { start: 7200, end: 10799, probability: 0.0094 },
    { start: 10800, end: 14399, probability: 0.0094 },
    { start: 14400, end: 17999, probability: 0.0094 },
    { start: 18000, end: 21599, probability: 0.0094 },
    { start: 21600, end: 25199, probability: 0.0094 },
    { start: 25200, end: 28799, probability: 0.0094 },
    { start: 28800, end: 32399, probability: 0.0283 },
    { start: 32400, end: 35999, probability: 0.0283 },
    { start: 36000, end: 39599, probability: 0.0566 },
    { start: 39600, end: 43199, probability: 0.0566 },
    { start: 43200, end: 46799, probability: 0.0566 },
    { start: 46800, end: 50399, probability: 0.0755 },
    { start: 50400, end: 53999, probability: 0.0755 },
    { start: 54000, end: 57599, probability: 0.0755 },
    { start: 57600, end: 61199, probability: 0.1038 },
    { start: 61200, end: 64799, probability: 0.1038 },
    { start: 64800, end: 68399, probability: 0.1038 },
    { start: 68400, end: 71999, probability: 0.0472 },
    { start: 72000, end: 75599, probability: 0.0472 },
    { start: 75600, end: 79199, probability: 0.0472 },
    { start: 79200, end: 82799, probability: 0.0094 },
    { start: 82800, end: 86399, probability: 0.0094 },
];

const chargeNeededProbabilities: chargingDistanceProbabilities[] = [
    { rangeStart: 0, rangeEnd: 0.3431, distanceNeeded: 0 },
    { rangeStart: 0.3431, rangeEnd: 0.4607, distanceNeeded: 20 },
    { rangeStart: 0.4607, rangeEnd: 0.5783, distanceNeeded: 50 },
    { rangeStart: 0.5783, rangeEnd: 0.6861, distanceNeeded: 100 },
    { rangeStart: 0.6861, rangeEnd: 0.7841, distanceNeeded: 10 },
    { rangeStart: 0.7841, rangeEnd: 0.8723, distanceNeeded: 30 },
    { rangeStart: 0.8723, rangeEnd: 0.9213, distanceNeeded: 5 },
    { rangeStart: 0.9213, rangeEnd: 0.9703, distanceNeeded: 200 },
    { rangeStart: 0.9703, rangeEnd: 0.9997, distanceNeeded: 300 },
];

const secondsInHour = 3600;

// Standard EV, 18kWh per 100km, 0.18kWh/km
// const kwhPerKm = 0.18;

export function runTick(
    chargePoints: chargePoint[],
    time: number,
    tickInterval: number,
    carConsumptionPerKm: number,
) {
    let consumedEnergyInTick = 0;
    let powerDemanded = 0;

    const updatedChargePointList = [...chargePoints];

    for (let i = 0; i < updatedChargePointList.length; i++) {
        const chargePoint = { ...updatedChargePointList[i] };
        if (!chargePoint || !chargePoint.chargeSpeed) {
            continue;
        }
        const { busyTimeStart, busyTimeEnd, chargeSpeed } = chargePoint;

        const isBusy: boolean =
            !!busyTimeStart &&
            !!busyTimeEnd &&
            busyTimeStart >= 0 &&
            busyTimeEnd >= 0;

        if (!isBusy) {
            // calculate busy probability
            const probabilityOfArrival = getArrivalProbabilityForTime(time);
            const randomValue = Math.random();

            // Make busy if the odds are correct
            if (randomValue <= probabilityOfArrival) {
                const distanceNeeded = getChargeDistanceProbabilityForCar();
                if (distanceNeeded > 0) {
                    chargePoint.busyTimeStart = time;
                    chargePoint.busyTimeEnd = getEndChargingTime(
                        time,
                        getTimeRequiredForFullCharge(
                            distanceNeeded,
                            chargeSpeed,
                            carConsumptionPerKm,
                        ),
                    );
                    consumedEnergyInTick +=
                        (chargeSpeed * tickInterval) / secondsInHour;
                    powerDemanded += chargeSpeed;
                }
            }

            // TODO: Recalculate, first to kWsec, then to kWh
        } else if (isBusy && !!busyTimeEnd && busyTimeEnd < time) {
            // free the chargepoint && accumulate
            const consumeTime = time - busyTimeEnd;
            consumedEnergyInTick += (chargeSpeed * consumeTime) / secondsInHour;

            powerDemanded += chargeSpeed;
            chargePoint.busyTimeEnd = 0;
            chargePoint.busyTimeStart = 0;
        } else {
            // accumulate
            consumedEnergyInTick +=
                (chargeSpeed * tickInterval) / secondsInHour;
            powerDemanded += chargeSpeed;
        }

        updatedChargePointList[i] = chargePoint;
    }

    return {
        updatedChargePointList,
        powerDemanded,
        consumedEnergyInTick,
        time,
    };
}

function getArrivalProbabilityForTime(time: number) {
    const probability = probabilities.find(
        (p) => time >= p.start && time < p.end,
    );
    return probability ? probability.probability : 0;
}

function getChargeDistanceProbabilityForCar() {
    const randomProbability = Math.random();
    const distanceValue = chargeNeededProbabilities.find(
        (p) =>
            randomProbability >= p.rangeStart && randomProbability < p.rangeEnd,
    );

    return distanceValue ? distanceValue.distanceNeeded : 0;
}

function getTimeRequiredForFullCharge(
    distanceNeeded: number,
    chargeSpeed: number,
    carConsumptionPerKm: number,
) {
    const timePerKm = carConsumptionPerKm / chargeSpeed;
    const timePerKmInSeconds = timePerKm * secondsInHour;

    return distanceNeeded * timePerKmInSeconds;
}

// Calculation is made by seconds in day. If the ending time is bigger than current day,
// remove the current day seconds, so the ending time will be calculated by next tick.
function getEndChargingTime(startTime: number, timeNeeded: number) {
    if (startTime + timeNeeded > 24 * secondsInHour) {
        return startTime + timeNeeded - 24 * secondsInHour;
    }
    return startTime + timeNeeded;
}

export function dayRun(
    tickLength: number,
    chargePoints: chargePoint[],
    carConsumption: number,
) {
    let usableChargePointsData = chargePoints;
    let timeStart = tickLength;
    let carConsumptionPerKm = carConsumption / 100;

    const runs: TickResponse[] = [
        {
            updatedChargePointList: usableChargePointsData!,
            powerDemanded: 0,
            consumedEnergyInTick: 0,
            time: 0,
        },
    ];

    const numberOfRuns = (secondsInHour * 24) / tickLength;

    for (let i = 1; i <= numberOfRuns; i++) {
        if (runs[i - 1]) {
            runs.push(
                runTick(
                    runs[i - 1]!.updatedChargePointList,
                    timeStart,
                    tickLength,
                    carConsumptionPerKm,
                ),
            );
            timeStart += tickLength;
        }
    }

    return runs;
}

export function getDayMaxPower(data: TickResponse[]) {
    return data.reduce((t1, t2) =>
        t1.powerDemanded > t2.powerDemanded ? t1 : t2,
    );
}

export function getTheoreticalTotalConsumedEnergy(
    chargePoints: chargePoint[],
    simulationDays: number,
) {
    const chargePointsConsumption = chargePoints.reduce((val, cp) => {
        return val + cp.chargeSpeed;
    }, 0);

    return chargePointsConsumption * simulationDays * 24;
}

export function runSimulation(
    chargePoints: chargePoint[],
    simulationDays: number,
    tickLength: number,
    carConsumption: number,
) {
    const firstDayRun = dayRun(tickLength, chargePoints, carConsumption);

    const totalRuns = [firstDayRun];

    if (simulationDays > 1) {
        for (let i = 1; i < simulationDays; i++) {
            const lastDayRun = totalRuns[i - 1];
            if (lastDayRun) {
                const lastRunChargepointsData = lastDayRun.at(-1);
                if (
                    lastRunChargepointsData &&
                    lastRunChargepointsData.updatedChargePointList
                ) {
                    totalRuns.push(
                        dayRun(
                            tickLength,
                            lastRunChargepointsData.updatedChargePointList,
                            carConsumption,
                        ),
                    );
                }
            }
        }
    }

    const dayWithMaxPower = totalRuns.reduce((day1, day2) => {
        return getDayMaxPower(day1) > getDayMaxPower(day2) ? day1 : day2;
    });
    const theoreticalMaxPower = getDayMaxPower(dayWithMaxPower).powerDemanded;

    const totalConsumedEnergy = totalRuns
        .map((v) =>
            v.map((t) => t.consumedEnergyInTick).reduce((t1, t2) => t1 + t2),
        )
        .reduce((d1, d2) => d1 + d2);

    return { theoreticalMaxPower, totalConsumedEnergy, totalRuns };
}
