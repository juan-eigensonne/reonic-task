import { SimulationResult } from '../components/SimulationResult';

export default function HomePage() {
    return (
        <div>
            <h1 className="text-4xl font-bold tracking-tight">
                Simulation Result
            </h1>
            <SimulationResult />
        </div>
    );
}

export const getConfig = async () => {
    return {
        render: 'static',
    };
};
