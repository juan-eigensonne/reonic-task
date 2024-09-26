import { chargePoint } from 'reonic';
import { dayRun, getDayMaxPower } from '../helpers/calculations';

export function useSimulation(
    chargePoints: chargePoint[],
    simulationDays: number,
    tickLength: number,
) {
    const firstDayRun = dayRun(tickLength, chargePoints);

    const yearRuns = [firstDayRun];

    for (let i = 1; i < simulationDays; i++) {
        const lastDayRun = yearRuns[i - 1];
        if (lastDayRun) {
            const lastRunChargepointsData = lastDayRun.at(-1);
            if (
                lastRunChargepointsData &&
                lastRunChargepointsData.updatedChargePointList
            ) {
                yearRuns.push(
                    dayRun(
                        tickLength,
                        lastRunChargepointsData.updatedChargePointList,
                    ),
                );
            }
        }
    }

    const dayWithMaxPower = yearRuns.reduce((day1, day2) => {
        return getDayMaxPower(day1) > getDayMaxPower(day2) ? day1 : day2;
    });
    const theoreticalMaxPower = getDayMaxPower(dayWithMaxPower).powerDemanded;

    const totalConsumedEnergy = yearRuns
        .map((v) =>
            v.map((t) => t.consumedEnergyInTick).reduce((t1, t2) => t1 + t2),
        )
        .reduce((d1, d2) => d1 + d2);

    return { theoreticalMaxPower, totalConsumedEnergy, yearRuns };
}
