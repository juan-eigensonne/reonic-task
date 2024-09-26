'use client';

import { useState } from 'react';
import { TickVisualizator } from './TickVisualizator';
import { chargePoint } from 'reonic';
import { useSimulation } from '../hooks/useSimulation';

export type SimulationResultProps = {
    tickLength?: number;
    simulationDays?: number;
    numberOfChargers?: number;
    chargerSpeed?: number;
};

export function SimulationResult(props: SimulationResultProps) {
    const {
        tickLength = 600,
        simulationDays = 365,
        numberOfChargers = 20,
        chargerSpeed = 11,
    } = props;
    const [selectedDay, setSelectedDay] = useState(1);

    const chargeSpeedCP = 11;

    const chargePoints: chargePoint[] = new Array(20).fill({
        chargeSpeed: chargeSpeedCP,
    });

    const { theoreticalMaxPower, totalConsumedEnergy, yearRuns } =
        useSimulation(chargePoints, simulationDays, tickLength);

    const totalConsumedEnergyInHours = totalConsumedEnergy;
    const theoreticalTotalConsumedEnergy =
        chargerSpeed * numberOfChargers * simulationDays * 24;

    return (
        <div className={`px-2`}>
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
            <div className={`gap-1`}>
                {yearRuns[selectedDay]
                    ? yearRuns[selectedDay].map((r, index) => (
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
