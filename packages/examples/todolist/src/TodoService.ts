import { Observe, Signal, Interceptor } from '@vgerbot/rock';

export interface TodoItem {
    title: string;
    createTime: Date;
}

export class TodoService {
    @Signal
    public tasks: TodoItem[] = [];

    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todo') || '[]').map(
            (it: { title: string; createTime: string }) => ({
                title: it.title,
                createTime: new Date(it.createTime)
            })
        );
    }

    addTask(title: string) {
        this.tasks = this.tasks.concat({
            title,
            createTime: new Date()
        });
    }
    @Observe()
    storeOnTaskChange() {
        localStorage.setItem('todo', JSON.stringify(this.tasks));
    }
    @Interceptor('tasks')
    validateNewTask(newTasks: TodoItem[]) {
        return newTasks;
    }
}
