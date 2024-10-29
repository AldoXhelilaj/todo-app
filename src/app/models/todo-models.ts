export interface Subtask {
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoItem {
    _id?: string;
    title: string;
    completed: boolean;
    editing?: boolean;
    subtasks?: Subtask[];
    priority?: "low" | "medium" | "high";
    originalTitle?: string
}