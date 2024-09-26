'use client';
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
            <h1 className="text-xl font-bold tracking-tight">Run: {time}</h1>
            <div className="flex flex-wrap justify-around gap-1-px">
                {updatedChargePointList.map(
                    ({ busyTimeStart, busyTimeEnd }, index) => {
                        const isBusy: boolean =
                            !!busyTimeStart &&
                            !!busyTimeEnd &&
                            busyTimeStart >= 0 &&
                            busyTimeEnd >= 0;
                        return (
                            <div
                                key={isBusy + '_' + index}
                                className={`border-solid border-2 ${isBusy ? 'bg-yellow-300' : ''} min-h-8 min-w-8 flex align-middle justify-around `}
                            >
                                {isBusy && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                                        />
                                    </svg>
                                )}
                            </div>
                        );
                    },
                )}
            </div>

            <h1 className="text-xl font-bold tracking-tight">
                pwerDemanded: {powerDemanded}
            </h1>
            <h1 className="text-xl font-bold tracking-tight">
                consumedEnergyInTick: {consumedEnergyInTick}
            </h1>
        </div>
    );
}
