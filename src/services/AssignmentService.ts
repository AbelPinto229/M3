//Sistema de atribuição de tarefas a utilizadores

const taskToUsers: Map<number, Set<number>> = new Map();
const userToTasks: Map<number, Set<number>> = new Map();

export function assignUser(taskID: number, userID: number): void {
    // Adiciona user à task
    if (!taskToUsers.has(taskID)) {
        taskToUsers.set(taskID, new Set());
    }
    taskToUsers.get(taskID)!.add(userID);

    // Adiciona task ao user
    if (!userToTasks.has(userID)) {
        userToTasks.set(userID, new Set());
    }
    userToTasks.get(userID)!.add(taskID);
}   
export function unassignUser(taskID: number, userID: number): void {
    // Remove user da task
    taskToUsers.get(taskID)?.delete(userID);    
    // Remove task do user
    userToTasks.get(userID)?.delete(taskID);
}
export function getUsersFromTask(taskID: number): number[] {
    const users = taskToUsers.get(taskID);              
    return users ? Array.from(users) : [];
}           
export function getTasksFromUser(userID: number): number[] {
    const tasks = userToTasks.get(userID);              
    return tasks ? Array.from(tasks) : [];
}

