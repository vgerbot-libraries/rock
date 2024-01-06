import { Solidium } from '@vgerbot/solidium';
import { Counter, CounterControl } from './Counter';

export function App() {
    return (
        <Solidium>
            <fieldset>
                <legend>Counter 1:</legend>
                <Counter />
            </fieldset>
            <fieldset>
                <legend>Counter 2:</legend>
                <Counter />
            </fieldset>
            <hr></hr>
            <CounterControl />
        </Solidium>
    );
}
