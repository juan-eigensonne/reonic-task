'use client';
import { TickResponse } from 'reonic';
import { ChargePointVisualization } from './ChargePointVisualization';

export type TickVisualizatorProps = {
    data: TickResponse;
};

export function TickVisualizator(props: TickVisualizatorProps) {
    const { updatedChargePointList, time } = props.data;
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
                            <ChargePointVisualization
                                key={isBusy + '_' + index}
                                isBusy={isBusy}
                            />
                        );
                    },
                )}
            </div>
        </div>
    );
}
