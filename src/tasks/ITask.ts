// src/tasks/ITask.ts
import { TaskStatus } from './TaskStatus.js';

export interface ITask {
    id: number;               
    title: string;            
    completed: boolean;       
    status: TaskStatus;      

    // Returns the task type (ex: "Simple", "Bug", "Feature")
    getType(): string;

    // Changes the task state
    moveTo(status: TaskStatus): void;
}

/*
Tips (how to implement):
*/

// Start by thinking: "Where will I store the deadlines?"
// Create a private structure inside the service (ex: a Map or object)

const deadlines: Map<number, Date> = new Map();

// Use taskId as key and date as value
// Implement first only the storage (setDeadline)
// Then implement time logic (compare dates)
// Convert dates to numbers (timestamp) to ease comparisons
// Create a helper function to get the current date
export function setDeadline(taskID: number, date:Date):void{
    deadlines.set(taskID, date);
}

// isExpired(taskId) should:
// → fetch the date
// → compare with current time
// → return true/false
export function isExpired(taskID:number):boolean{
    const deadline = deadlines.get(taskID);
    if(!deadline) return false;
    const now = new Date();
    return now.getTime() > deadline.getTime();
}

// getExpiredTasks() should:
// → go through all deadlines
// → filter the expired ones
// → return only taskIds or tasks
// Implement by stages: store → compare → filter → return 
export function getExpiredTasks():number[]{
    const now = new Date();
    const expiredTasks:number[] = [];
    for(const [taskID, deadline] of deadlines.entries()){
        if(now.getTime() > deadline.getTime()){
            expiredTasks.push(taskID);
        }   
    }
    return expiredTasks;
}

