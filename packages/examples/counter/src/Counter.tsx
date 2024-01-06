import { CounterService } from './CounterService';
import { useService } from '@vgerbot/solidium';

export function Counter() {
    const service = useService(CounterService);
    return (
        <div>
            <ul>
                <dl>
                    <dt>count: </dt>
                    <dd>{service.count}</dd>
                </dl>
                <dl>
                    <dt>double: </dt>
                    <dd>{service.double}</dd>
                </dl>
                <dl>
                    <dt>fibonacci: </dt>
                    <dd>{service.fib}</dd>
                </dl>
            </ul>
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
