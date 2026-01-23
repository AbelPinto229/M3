export interface Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: 'Work' | 'Personal' | 'Study';
}

export class TaskClass implements Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: 'Work' | 'Personal' | 'Study';

    constructor(id: number, title: string, category: 'Work' | 'Personal' | 'Study') {
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
