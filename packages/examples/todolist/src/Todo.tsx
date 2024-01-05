import { useService } from '@vgerbot/solidium';
import { TodoService } from './TodoService';

export function Todo() {
    const service = useService(TodoService);
    return (
        <ul>
            {service.tasks.map(task => (
                <dl
                    style={{
                        'border-bottom': '1px solid #ddd'
                    }}
                >
                    <dt>{task.createTime.toISOString()}</dt>
                    <dd>{task.title}</dd>
                </dl>
            ))}
        </ul>
    );
}
