//                    exercicios guiados 2
// Exercício 1 — Interface
interface Task {
    id: number;
    title: string;
    concluded: boolean;
}

// Exercício 2 — Classe
class TaskClass implements Task {
    id: number;
    title: string;
    concluded: boolean;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        this.concluded = false;
    }

    markConcluded(): void {
        this.concluded = true;
    }
}

// Exercício 3 — Array
let taskList: TaskClass[] = [];

taskList.push(new TaskClass(1, "Rever slides aula 2"));
taskList.push(new TaskClass(2, "Fazer exercícios guiados"));
taskList.push(new TaskClass(3, "Fazer exercícios autónomos"));

// Exercício 5 — Renderização
function renderTasks(): void {
    const ul = document.getElementById("list") as HTMLUListElement;
    if (!ul) return;

    ul.innerHTML = "";

    taskList.forEach(task => {
        const li = document.createElement("li");

        // Texto
        const span = document.createElement("span");
        span.textContent = task.title;

        // Exercício 6
        if (task.concluded) {
            span.classList.add("concluded");
        }

        // Botão Editar
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.addEventListener("click", () => {
            editTask(task.id);
        });

        // Botão Remover
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";
        removeBtn.addEventListener("click", () => {
            removeTask(task.id);
        });

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        ul.appendChild(li);
    });
}


// Exercício 7 — Remover tarefa
function removeTask(id: number): void {
    taskList = taskList.filter(task => task.id !== id);
    renderTasks();
}

// Exercício 4 — Adicionar tarefa
const input = document.querySelector("#taskInput") as HTMLInputElement;
const buttonAdd = document.querySelector("#addBtn") as HTMLButtonElement;

buttonAdd.addEventListener("click", () => {
    const title = input.value.trim();
    if (title === "") return;

    const newTask = new TaskClass(Date.now(), title);
    taskList.push(newTask);
    input.value = "";
    renderTasks();
});

// Teste Exercício 6
taskList[0].markConcluded();
taskList[1].markConcluded();

// Render inicial
renderTasks();

// Exercício 8 — Editar tarefa
function editTask(id: number): void {
    const task: TaskClass | undefined = taskList.find(task => task.id === id);
    if (!task) return;

    const newTitle = prompt("Editar título da tarefa:", task.title);
    if (!newTitle || newTitle.trim() === "") return;

    task.title = newTitle.trim();
    renderTasks();
}
