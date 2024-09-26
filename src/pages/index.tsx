import { SimulationResult } from '../components/SimulationResult';
import { SimulationParameters } from '../components/SimulationParameters';
import { SimulationView } from '../components/SimulationView';

export default function HomePage() {
    return (
        <div className="flex flex-col flex-1">
            <h1 className="text-4xl font-bold tracking-tight">Simulation</h1>
            <SimulationView />
        </div>
    );
}

export const getConfig = async () => {
    return {
        render: 'static',
    };
};
