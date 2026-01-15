// ===============================
// EXERCÍCIOS GUIADOS 2 - MAIN.TS
// ===============================
// Exercício 2 — Criar classe TarefaClass
var TaskClass = /** @class */ (function () {
    // Exercício 2a — Constructor que recebe id, título e categoria
    function TaskClass(id, title, categoria) {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.categoria = categoria;
    }
    // Exercício 2b — Método que marca tarefa como concluída e define data de conclusão
    TaskClass.prototype.markConcluded = function () {
        this.concluded = true;
        this.dataConclusao = new Date();
    };
    return TaskClass;
}());
// Exercício 3 — Array de objetos
var taskList = [
    new TaskClass(1, "Rever slides aula 2", "Estudo"),
    new TaskClass(2, "Fazer exercícios guiados", "Estudo"),
    new TaskClass(3, "Fazer exercícios autonomos", "Estudo")
];
// Variável para pesquisa dinâmica (Exercício 5)
var searchTerm = "";
// ===============================
// Exercício 4 — Adicionar tarefa via input
var input = document.querySelector("#taskInput");
var categorySelect = document.querySelector("#categorySelect");
var buttonAdd = document.querySelector("#addBtn");
buttonAdd.addEventListener("click", function () {
    var title = input.value.trim();
    if (!title)
        return;
    var categoria = categorySelect.value;
    var newTask = new TaskClass(Date.now(), title, categoria);
    taskList.push(newTask);
    input.value = "";
    categorySelect.value = "Trabalho";
    renderTasks();
});
// ===============================
// Exercício 12 — Ordenação Alfabética
var sortBtn = document.querySelector("#sortBtn");
sortBtn.addEventListener("click", function () {
    taskList.sort(function (a, b) { return a.title.localeCompare(b.title, "pt-PT"); });
    renderTasks();
});
// ===============================
// Exercício 14 — Limpar todas as tarefas concluídas
var clearCompletedBtn = document.querySelector("#clearCompletedBtn");
clearCompletedBtn.addEventListener("click", function () {
    taskList = taskList.filter(function (task) { return !task.concluded; });
    renderTasks();
});
// ===============================
// Exercício 5 — Pesquisa Dinâmica
var searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});
// ===============================
// Exercício 5,6,7,8,9,11,13 — Renderização dinâmica
function renderTasks() {
    var taskContainer = document.querySelector("#list");
    var pendingCountDiv = document.querySelector("#pending-count");
    // Filtra tarefas pelo texto da pesquisa (Exercício 5)
    var filteredTasks = taskList.filter(function (task) {
        return task.title.toLowerCase().includes(searchTerm);
    });
    // Calcula tarefas pendentes (Exercício 9)
    var pendingTasks = filteredTasks.filter(function (t) { return !t.concluded; });
    pendingCountDiv.textContent = "Tarefas pendentes: ".concat(pendingTasks.length);
    // Limpa container
    taskContainer.innerHTML = "";
    // Percorre todas as tarefas filtradas
    filteredTasks.forEach(function (task) {
        var li = document.createElement("li");
        // ---------------------------
        // Exercício 6 — Título da tarefa
        var titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded)
            titleSpan.classList.add("completed");
        li.appendChild(titleSpan);
        // ---------------------------
        // Exercício 13 — Categoria
        var categorySpan = document.createElement("span");
        categorySpan.textContent = " [".concat(task.categoria, "]");
        categorySpan.classList.add("task-category");
        switch (task.categoria) {
            case "Trabalho":
                categorySpan.style.color = "#1E90FF";
                break;
            case "Pessoal":
                categorySpan.style.color = "#32CD32";
                break;
            case "Estudo":
                categorySpan.style.color = "#FF8C00";
                break;
        }
        li.appendChild(categorySpan);
        // ---------------------------
        // Exercício 11 — Data de conclusão
        if (task.concluded && task.dataConclusao) {
            var dataSpan = document.createElement("span");
            var dataFormatada = task.dataConclusao.toLocaleString("pt-PT", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
            dataSpan.textContent = " (Conclu\u00EDda em: ".concat(dataFormatada, ")");
            dataSpan.classList.add("completed-date");
            li.appendChild(dataSpan);
        }
        // ---------------------------
        // Alternar concluída (click)
        li.addEventListener("click", function () {
            if (!task.concluded)
                task.markConcluded();
            else {
                task.concluded = false;
                task.dataConclusao = undefined;
            }
            renderTasks();
        });
        // ---------------------------
        // Exercício 8 — Editar título (duplo clique)
        li.addEventListener("dblclick", function () {
            var newTitle = prompt("Novo título para a tarefa:", task.title);
            if (newTitle && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                renderTasks();
            }
        });
        // ---------------------------
        // Exercício 7 — Remover tarefa
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";
        removeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            taskList = taskList.filter(function (t) { return t.id !== task.id; });
            renderTasks();
        });
        li.appendChild(removeBtn);
        // Adiciona tarefa à lista
        taskContainer.appendChild(li);
    });
}
// Chamada inicial
renderTasks();
