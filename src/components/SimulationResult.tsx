'use client';

import { useEffect, useState } from 'react';
import { TickVisualizator } from './TickVisualizator';
import { chargePoint, TickResponse } from 'reonic';
import {
    getTheoreticalTotalConsumedEnergy,
    runSimulation,
} from '../helpers/calculations';

export type SimulationResultProps = {
    tickLength?: number;
    simulationDays?: number;
    chargePoints: chargePoint[];
    carConsumption: number;
};

export function SimulationResult(props: SimulationResultProps) {
    const {
        tickLength = 600,
        simulationDays = 365,
        chargePoints = [],
        carConsumption,
    } = props;
    const [selectedDay, setSelectedDay] = useState(0);

    const [theoreticalMaxPower, setTheoreticalMaxPower] = useState(0);
    const [totalConsumedEnergy, setTotalConsumedEnergy] = useState(0);
    const [totalRuns, setTotalRuns] = useState<TickResponse[][]>();

    useEffect(() => {
        const { theoreticalMaxPower, totalConsumedEnergy, totalRuns } =
            runSimulation(
                chargePoints,
                simulationDays,
                tickLength,
                carConsumption,
            );

        setTheoreticalMaxPower(theoreticalMaxPower);
        setTotalConsumedEnergy(totalConsumedEnergy);
        setTotalRuns(totalRuns);
    }, [chargePoints, simulationDays, tickLength, carConsumption]);

    const totalConsumedEnergyInHours = totalConsumedEnergy;

    const theoreticalTotalConsumedEnergy = getTheoreticalTotalConsumedEnergy(
        chargePoints,
        simulationDays,
    );

    return (
        <div className={`px-2 flex flex-col gap-1`}>
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
                Select a day to display:
                <select
                    value={selectedDay}
                    onChange={(e) => {
                        setSelectedDay(parseInt(e.target.value));
                    }}
                >
                    {[...Array(simulationDays)].map((e, i) => (
                        <option key={i} value={i}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>
            <div className={`gap-1`}>
                {totalRuns?.length && totalRuns[selectedDay]
                    ? totalRuns[selectedDay].map((r, index) => (
                          <TickVisualizator
                              data={r}
                              key={selectedDay + index}
                          />
                      ))
                    : null}
            </div>
        </div>
    );
}

export const getConfig = async () => {
    return {
        render: 'static',
    };
};
