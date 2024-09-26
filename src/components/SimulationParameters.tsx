'use client';

import { useState } from 'react';
import { chargePoint } from 'reonic';
import { ChargePointVisualization } from './ChargePointVisualization';

type SimulationParametersProps = {
    onSimulationStartRequestedCallback: (
        chargePoints: chargePoint[],
        carConsumption: number,
        simulationDays: number,
    ) => void;
};

export function SimulationParameters(props: SimulationParametersProps) {
    const { onSimulationStartRequestedCallback } = props;

    const [simulationDays, setSimulationDays] = useState(365);
    const [chargePoints, setChargePoints] = useState<chargePoint[]>([]);
    const [chargePointAdderPoints, setChargePointAdderPoints] = useState(5);
    const [chargePointAdderPower, setChargePointAdderPower] = useState(11);
    const [carConsumption, setCarConsumption] = useState(18);

    function addChargePoints() {
        let newChargePoints = [...chargePoints];
        for (let i = 0; i < chargePointAdderPoints; i++) {
            newChargePoints.push({ chargeSpeed: chargePointAdderPower });
        }
        setChargePoints(newChargePoints);
    }

    function clearChargePoints() {
        setChargePoints([]);
    }

    function onSimulationStartRequested() {
        if (simulationDays > 0) {
            if (carConsumption > 0) {
                if (chargePoints.length > 0) {
                    onSimulationStartRequestedCallback(
                        chargePoints,
                        carConsumption,
                        simulationDays,
                    );
                } else {
                    alert('You must add Charge Points');
                }
            } else {
                alert('Car consumption must be greater than 0');
            }
        } else {
            alert('Simulation days must be greater than 0');
        }
    }

    return (
        <div className="flex gap-2 flex-col">
            <h1 className={'font-bold text-lg'}>New Simulation Parameters:</h1>
            <div className="flex gap-2 flex-col">
                <h4 className="font-bold">Charge Points:</h4>
                <div className="flex gap-1 flex-1 justify-between flex-col md:flex-row">
                    <div className={`flex gap-1 flex-1`}>
                        <div>
                            <label>
                                Points:
                                <input
                                    type="number"
                                    className={`border-solid border-2 border-[#4a568588] rounded-sm ml-2 w-[50px] pl-1`}
                                    value={chargePointAdderPoints}
                                    onChange={(e) =>
                                        setChargePointAdderPoints(
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                            </label>
                        </div>
                        <div className="ml-2">
                            <label>
                                Power:
                                <input
                                    type="number"
                                    className={`border-solid border-2 border-[#4a568588] rounded-sm ml-2  w-[50px]  pl-1`}
                                    value={chargePointAdderPower}
                                    onChange={(e) =>
                                        setChargePointAdderPower(
                                            parseInt(e.target.value),
                                        )
                                    }
                                />{' '}
                                kW
                            </label>
                        </div>
                    </div>
                    <div className={`flex gap-1`}>
                        <button
                            className="bg-[#4a5685aa] px-2 rounded-sm text-white"
                            onClick={addChargePoints}
                        >
                            Add Charge Points
                        </button>
                        <button
                            className="bg-[#ef5446aa] px-2 rounded-sm text-white"
                            onClick={clearChargePoints}
                        >
                            Clear Charge Points
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap justify-start gap-4 align-middle">
                    <div className="flex align-middle">
                        <p className={'font-bold'}>
                            Total: {chargePoints.length}
                        </p>
                    </div>

                    <div
                        className={`flex flex-wrap justify-start gap-2 flex-1`}
                    >
                        {chargePoints.length > 0
                            ? chargePoints.map((cp, index) => (
                                  <ChargePointVisualization
                                      key={'cpv' + index}
                                      charge={cp.chargeSpeed}
                                      isBusy
                                  />
                              ))
                            : null}
                    </div>
                </div>
            </div>
            <div>
                <label>
                    <span className={'font-bold'}>Car Consumption:</span>
                    <input
                        type="number"
                        className={`border-solid border-2 border-[#4a568588] rounded-sm ml-2  w-[50px]  pl-1`}
                        value={carConsumption}
                        onChange={(e) =>
                            setCarConsumption(parseInt(e.target.value))
                        }
                    />{' '}
                    kWh
                </label>
            </div>
            <div>
                <label>
                    <span className={'font-bold'}>Simulation Days:</span>
                    <input
                        type="number"
                        className={`border-solid border-2 border-[#4a568588] rounded-sm ml-2  w-[70px]  pl-1`}
                        value={simulationDays}
                        onChange={(e) =>
                            setSimulationDays(parseInt(e.target.value))
                        }
                    />{' '}
                    days
                </label>
            </div>

            <div className={'flex flex-1 justify-center'}>
                <button
                    className="bg-[#f2d473] px-4  py-2 rounded-md text-white font-bold max-w-[500px]"
                    onClick={onSimulationStartRequested}
                >
                    Start Simulation
                </button>
            </div>
        </div>
    );
}

export const getConfig = async () => {
    return {
        render: 'static',
    };
};
