import { CounterService } from './CounterService';
import { useService } from '@vgerbot/solidium';

export function Counter() {
    const service = useService(CounterService);
    return (
        <div>
            {service.dbl}
            <hr></hr>
            <CounterControl />
        </div>
    );
}

export function CounterControl() {
    const service = useService(CounterService);
    return (
        <>
            <button
                onClick={() => {
                    service.increment();
                }}
            >
                Increment
            </button>
            <button
                onClick={() => {
                    service.decrement();
                }}
            >
                Decrement
            </button>
        </>
    );
}
