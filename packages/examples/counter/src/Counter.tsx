import { CounterService } from './CounterService';
import { useService } from '@vgerbot/rock';

export function Counter() {
    const service = useService(CounterService);
    return (
        <div>
            {service.formated}
            <hr></hr>
            <button
                onClick={() => {
                    service.count += 1;
                }}
            >
                Increment
            </button>
            <button
                onClick={() => {
                    service.count -= 1;
                }}
            >
                Decrement
            </button>
        </div>
    );
}
