import { Rock } from '@vgerbot/rock';
import { Todo } from './Todo';
import { TodoTaskCreator } from './TodoTaskCreator';

export function App() {
    return (
        <Rock>
            <TodoTaskCreator></TodoTaskCreator>
            <Todo></Todo>
        </Rock>
    );
}
