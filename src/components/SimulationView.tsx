'use client';

import { SimulationParameters } from './SimulationParameters';
import { SimulationResult } from './SimulationResult';
import { useState } from 'react';
import { chargePoint } from 'reonic';

export function SimulationView() {
    const [chargePoints, setChargePoints] = useState<chargePoint[]>([]);
    const [simulationDays, setSimulationDays] = useState(0);
    const [carConsumption, setCarConsumption] = useState(18);
    const [shouldShowSimulation, setShouldShowSimulation] = useState(false);

    function startSimulation(
        chargePoints: chargePoint[],
        carConsumption: number,
        simulationDays: number,
    ) {
        setChargePoints(chargePoints);
        setCarConsumption(carConsumption);
        setSimulationDays(simulationDays);

        setShouldShowSimulation(true);
    }

    return (
        <div>
            <SimulationParameters
                onSimulationStartRequestedCallback={startSimulation}
            />

            <div className="mt-10 max-w-">
                {shouldShowSimulation ? (
                    <SimulationResult
                        simulationDays={simulationDays}
                        chargePoints={chargePoints}
                        carConsumption={carConsumption}
                    />
                ) : null}
            </div>
        </div>
    );
}
