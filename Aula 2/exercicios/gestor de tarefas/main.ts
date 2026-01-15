// ===============================
// EXERCÍCIOS GUIADOS 2 - MAIN.TS
// ===============================

// Exercício 1 — Criar interface Tarefa
interface Task {
    id: number;
    title: string;
    concluded: boolean;
    dataConclusao?: Date;
    categoria: 'Trabalho' | 'Pessoal' | 'Estudo';
}

// Exercício 2 — Criar classe TarefaClass
class TaskClass implements Task {
    id: number;
    title: string;
    concluded: boolean;
    dataConclusao?: Date;
    categoria: 'Trabalho' | 'Pessoal' | 'Estudo';

    // Exercício 2a — Constructor que recebe id, título e categoria
    constructor(id: number, title: string, categoria: 'Trabalho' | 'Pessoal' | 'Estudo') {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.categoria = categoria;
    }

    // Exercício 2b — Método que marca tarefa como concluída e define data de conclusão
    markConcluded(): void {
        this.concluded = true;
        this.dataConclusao = new Date();
    }
}

// Exercício 3 — Array de objetos
let taskList: TaskClass[] = [
    new TaskClass(1, "Rever slides aula 2", "Estudo"),
    new TaskClass(2, "Fazer exercícios guiados", "Estudo"),
    new TaskClass(3, "Fazer exercícios autonomos", "Estudo")
];

// Variável para pesquisa dinâmica (Exercício 5)
let searchTerm: string = "";

// ===============================
// Exercício 4 — Adicionar tarefa via input
const input = document.querySelector("#taskInput") as HTMLInputElement;
const categorySelect = document.querySelector("#categorySelect") as HTMLSelectElement;
const buttonAdd = document.querySelector("#addBtn") as HTMLButtonElement;

buttonAdd.addEventListener("click", () => {
    const title = input.value.trim();
    if (!title) return;

    const categoria = categorySelect.value as 'Trabalho' | 'Pessoal' | 'Estudo';

    const newTask = new TaskClass(Date.now(), title, categoria);
    taskList.push(newTask);

    input.value = "";
    categorySelect.value = "Trabalho";

    renderTasks();
});

// ===============================
// Exercício 12 — Ordenação Alfabética
const sortBtn = document.querySelector("#sortBtn") as HTMLButtonElement;
sortBtn.addEventListener("click", () => {
    taskList.sort((a, b) => a.title.localeCompare(b.title, "pt-PT"));
    renderTasks();
});

// ===============================
// Exercício 14 — Limpar todas as tarefas concluídas
const clearCompletedBtn = document.querySelector("#clearCompletedBtn") as HTMLButtonElement;
clearCompletedBtn.addEventListener("click", () => {
    taskList = taskList.filter(task => !task.concluded);
    renderTasks();
});

// ===============================
// Exercício 5 — Pesquisa Dinâmica
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});

// ===============================
// Exercício 5,6,7,8,9,11,13 — Renderização dinâmica
function renderTasks() {
    const taskContainer = document.querySelector("#list") as HTMLUListElement;
    const pendingCountDiv = document.querySelector("#pending-count") as HTMLDivElement;

    // Filtra tarefas pelo texto da pesquisa (Exercício 5)
    const filteredTasks = taskList.filter(task => 
        task.title.toLowerCase().includes(searchTerm)
    );

    // Calcula tarefas pendentes (Exercício 9)
    const pendingTasks = filteredTasks.filter(t => !t.concluded);
    pendingCountDiv.textContent = `Tarefas pendentes: ${pendingTasks.length}`;

    // Limpa container
    taskContainer.innerHTML = "";

    // Percorre todas as tarefas filtradas
    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        // ---------------------------
        // Exercício 6 — Título da tarefa
        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded) titleSpan.classList.add("completed");
        li.appendChild(titleSpan);

        // ---------------------------
        // Exercício 13 — Categoria
        const categorySpan = document.createElement("span");
        categorySpan.textContent = ` [${task.categoria}]`;
        categorySpan.classList.add("task-category");
        switch(task.categoria) {
            case "Trabalho": categorySpan.style.color = "#1E90FF"; break;
            case "Pessoal": categorySpan.style.color = "#32CD32"; break;
            case "Estudo": categorySpan.style.color = "#FF8C00"; break;
        }
        li.appendChild(categorySpan);

        // ---------------------------
        // Exercício 11 — Data de conclusão
        if (task.concluded && task.dataConclusao) {
            const dataSpan = document.createElement("span");
            const dataFormatada = task.dataConclusao.toLocaleString("pt-PT", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
            dataSpan.textContent = ` (Concluída em: ${dataFormatada})`;
            dataSpan.classList.add("completed-date");
            li.appendChild(dataSpan);
        }

        // ---------------------------
        // Alternar concluída (click)
        li.addEventListener("click", () => {
            if (!task.concluded) task.markConcluded();
            else { task.concluded = false; task.dataConclusao = undefined; }
            renderTasks();
        });

        // ---------------------------
        // Exercício 8 — Editar título (duplo clique)
        li.addEventListener("dblclick", () => {
            const newTitle = prompt("Novo título para a tarefa:", task.title);
            if (newTitle && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                renderTasks();
            }
        });

        // ---------------------------
        // Exercício 7 — Remover tarefa
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";
        removeBtn.addEventListener("click", e => {
            e.stopPropagation();
            taskList = taskList.filter(t => t.id !== task.id);
            renderTasks();
        });
        li.appendChild(removeBtn);

        // Adiciona tarefa à lista
        taskContainer.appendChild(li);
    });
}

// Chamada inicial
renderTasks();
