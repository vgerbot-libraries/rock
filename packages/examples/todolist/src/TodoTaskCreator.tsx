import { useService } from '@vgerbot/rock';
import { TodoService } from './TodoService';
import { createSignal } from 'solid-js';

export function TodoTaskCreator() {
    const [title, setTitle] = createSignal('');
    const service = useService(TodoService);

    return (
        <div
            style={{
                display: 'flex',
                'flex-direction': 'row',
                gap: '1em'
            }}
        >
            <input
                value={title()}
                onChange={e => {
                    setTitle(e.target.value);
                }}
                style={{
                    flex: 1
                }}
            ></input>
            <button
                onClick={() => {
                    service.addTask(title());
                    setTitle('');
                }}
            >
                Add
            </button>
        </div>
    );
}
