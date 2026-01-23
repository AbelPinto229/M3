export class TaskClass {
    constructor(id, title, category) {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.category = category;
    }
    markConcluded() {
        this.concluded = true;
        this.conclusionDate = new Date();
    }
}
