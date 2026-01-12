//Exercício 2 — Criar classe TarefaClass
//Cria uma classe TarefaClass que implemente a interface Tarefa.
var TaskClass = /** @class */ (function () {
    //Crie um constructor que receba o id e o título.
    function TaskClass(id, title) {
        this.id = id;
        this.title = title;
        this.concluded = false;
    }
    //Adicione um método que mude o estado para true.
    TaskClass.prototype.markConcluded = function () {
        this.concluded = true;
    };
    return TaskClass;
}());
//Exercício 3 — Array de objetos
//Cria um array chamado listaTarefas que armazene vários objetos do tipo Tarefa.
var taskList = [];
//Adicione 2 ou 3 tarefas de exemplo manualmente.
taskList.push(new TaskClass(1, "Rever slides aula 2"));
taskList.push(new TaskClass(2, "Fazer exercicios guiados"));
taskList.push(new TaskClass(3, "Fazer exercicios autonomos"));
//Percorra o array e mostre apenas os títulos numa div ou ul.
var ul = document.getElementById("list");
taskList.forEach(function (task) {
    var li = document.createElement("li");
    li.textContent = task.title;
    ul.appendChild(li);
});
//Exercício 4 — Adicionar tarefa via input
//Cria um campo de texto e um botão para adicionar novas tarefas ao array.
var input = document.querySelector("#taskInput");
var buttonAdd = document.querySelector("#addBtn");
buttonAdd.addEventListener("click", function () {
    var title = input.value.trim();
    if (title === "") {
        return;
    }
    //Chame uma função para atualizar a visualização no HTML.
    //Exercício 5 — Renderização dinâmica
    //Cria uma função que limpe a lista no HTML e a reconstrua sempre que o array mudar.
    function renderTasks() {
        var ul = document.getElementById("list");
        if (!ul)
            return;
        ul.innerHTML = ""; // limpa a lista
        //percorre o array taskList
        taskList.forEach(function (task) {
            var li = document.createElement("li"); // cria elemento <li>
            li.textContent = task.title; // adiciona o título da tarefa
            //Exercício 6 — Estilização por estado
            //Verifica se a tarefa está concluída
            if (task.concluded) {
                //Adiciona a classe CSS e altero no style
                li.classList.add("concluded");
            }
            ul.appendChild(li); // adiciona ao container
        });
    }
    //Instancie a classe TarefaClass com um ID único (ex: `Date.now()`) e Use push() para inserir no array.
    var newTask = new TaskClass(Date.now(), title);
    taskList.push(newTask);
    input.value = "";
    renderTasks();
});
// TESTE Exercício 6 — Estilização por estado a primeira tarefa como concluída e atualizar lista
taskList[0].markConcluded();
taskList[1].markConcluded();
