import { CounterService } from './CounterService';
import { useService } from '@vgerbot/solidium';

export function Counter() {
    const service = useService(CounterService);
    return (
        <div>
            {service.formated}
            <hr></hr>
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
        </div>
    );
}
