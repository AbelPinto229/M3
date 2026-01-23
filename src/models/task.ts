// ===============================
// Task Model
// ===============================
export type TaskCategory = 'Work' | 'Personal' | 'Study';

export interface Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: TaskCategory;
}

export class TaskClass implements Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: TaskCategory;

    constructor(id: number, title: string, category: TaskCategory) {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.category = category;
    }

    markConcluded(): void {
        this.concluded = true;
        this.conclusionDate = new Date();
    }
}
