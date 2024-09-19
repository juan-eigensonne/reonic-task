import { TickResponse } from 'reonic';

export type TickVisualizatorProps = {
    data: TickResponse;
};

export function TickVisualizator(props: TickVisualizatorProps) {
    const {
        updatedChargePointList,
        powerDemanded,
        consumedEnergyInTick,
        time,
    } = props.data;
    return (
        <div className="mt-8">
            <h1 className="text-4xl font-bold tracking-tight">
                One Tick Run: {time}
            </h1>
            <div className="flex flex-wrap justify-around">
                {updatedChargePointList.map(
                    ({ busyTimeStart, busyTimeEnd }) => {
                        const isBusy: boolean =
                            !!busyTimeStart &&
                            !!busyTimeEnd &&
                            busyTimeStart >= 0 &&
                            busyTimeEnd >= 0;
                        return (
                            <div
                                className={`border-solid border-2 ${isBusy ? 'bg-red-300' : ''} w-1/5`}
                            >
                                <p>
                                    busyTimeStart:{' '}
                                    {busyTimeStart ? busyTimeStart : 0}
                                </p>
                                <p>
                                    busyTimeEnd: {busyTimeEnd ? busyTimeEnd : 0}
                                </p>
                            </div>
                        );
                    },
                )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
                pwerDemanded: {powerDemanded}
            </h1>
            <h1 className="text-4xl font-bold tracking-tight">
                consumedEnergyInTick: {consumedEnergyInTick}
            </h1>
        </div>
    );
}
