import { chargePoint, TickResponse } from 'reonic';
import { runTick } from '../helpers/calculations';
import { TickVisualizator } from '../components/TickVisualizator';

export default async function HomePage() {
    const { theoreticalMaxPower, totalConsumedEnergy, yearRuns } =
        getYearRuns();

    const randomDay = 255;

    const totalConsumedEnergyInHours = totalConsumedEnergy;
    const theoreticalTotalConsumedEnergy = 1927200;

    return (
        <div>
            <h1 className="text-4xl font-bold tracking-tight">
                Simulation Result
            </h1>

            <h1 className="text-3xl font-bold tracking-tight">
                Max Power used: {theoreticalMaxPower} kW
            </h1>
            <h1 className="text-3xl font-bold tracking-tight">
                Theoretical Total Consumed Energy:{' '}
                {theoreticalTotalConsumedEnergy} kWh
            </h1>
            <h1 className="text-3xl font-bold tracking-tight">
                Total consumed energy: {totalConsumedEnergyInHours.toFixed(2)}{' '}
                kWh
            </h1>
            <h1 className="text-3xl font-bold tracking-tight">
                Concurrency Factor:{' '}
                {(
                    (totalConsumedEnergyInHours * 100) /
                    theoreticalTotalConsumedEnergy
                ).toFixed(0)}{' '}
                %
            </h1>
            <div>
                {yearRuns[randomDay]
                    ? yearRuns[randomDay].map((r) => (
                          <TickVisualizator data={r} />
                      ))
                    : null}
            </div>
        </div>
    );
}

const dayRun = (chargePoints?: chargePoint[]) => {
    let usableChargePointsData = chargePoints;
    if (!chargePoints) {
        const chargeSpeedCP = 11;

        usableChargePointsData = new Array(20).fill({
            chargeSpeed: chargeSpeedCP,
        });
    }

    let timeStart = 0;
    const runs: TickResponse[] = [
        {
            updatedChargePointList: usableChargePointsData!,
            powerDemanded: 0,
            consumedEnergyInTick: 0,
            time: 0,
        },
    ];

    // fixing number of runs to 145 (runs in 600s intervals)
    for (let i = 1; i < 146; i++) {
        if (runs[i - 1]) {
            runs.push(runTick(runs[i - 1]!.updatedChargePointList, timeStart));
            timeStart += 600;
        }
    }

    return runs;
};

const getYearRuns = () => {
    const chargeSpeedCP = 11;

    const chargePoints: chargePoint[] = new Array(20).fill({
        chargeSpeed: chargeSpeedCP,
    });

    const firstDayRun = dayRun(chargePoints);

    const yearRuns = [firstDayRun];

    for (let i = 1; i < 365; i++) {
        const lastDayRun = yearRuns[i - 1];
        if (lastDayRun) {
            const lastRunChargepointsData = lastDayRun.at(-1);
            if (
                lastRunChargepointsData &&
                lastRunChargepointsData.updatedChargePointList
            ) {
                yearRuns.push(
                    dayRun(lastRunChargepointsData.updatedChargePointList),
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
};

function getDayMaxPower(data: TickResponse[]) {
    return data.reduce((t1, t2) =>
        t1.powerDemanded > t2.powerDemanded ? t1 : t2,
    );
}

export const getConfig = async () => {
    return {
        render: 'static',
    };
};
