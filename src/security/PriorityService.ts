/*Dicas (como implementar):
- Primeiro cria o enum Priority (num ficheiro separado)
- Depois pensa: “Onde guardo a prioridade?”
*/

export enum Priority {
    High = 'HIGH',
    Critical = 'CRITICAL'
}

//- Cria uma estrutura Map(taskId → priority)
const priority: Map<number, Priority> = new Map();
//- setPriority deve apenas guardar o valor
export function setPriority(taskID:number, prio:Priority):void{
    priority.set(taskID, prio);
}
//- getPriority deve apenas ler o valor
export function getPriority(taskID:number):Priority | undefined{
    return priority.get(taskID);
}
/*- getHighPriorityTasks deve:→ percorrer todas as prioridades
→ filtrar por HIGH e CRITICAL
→ devolver os ids ou tasks
- Implementa por fases:
1) enum
2) storage
3) set
4) get
5) filtro
*/
export function getHighPriorityTasks():number[]{
    const highPriorityTasks:number[] = [];
    for(const [taskID, prio] of priority.entries()){
        if(prio === Priority.High || prio === Priority.Critical){
            highPriorityTasks.push(taskID);
        }   
    }   
    return highPriorityTasks;
}   
