import { Solidium } from '@vgerbot/solidium';
import { Todo } from './Todo';
import { TodoTaskCreator } from './TodoTaskCreator';

export function App() {
    return (
        <Solidium>
            <TodoTaskCreator></TodoTaskCreator>
            <Todo></Todo>
        </Solidium>
    );
}
