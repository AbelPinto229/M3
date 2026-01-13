//                    exercicios guiados 2
// Exercício 1 — Criar interface Tarefa
//Cria uma interface chamada Tarefa que defina a estrutura de um objeto de tarefa.
interface Task {
    id: number;
    title: string;
    concluded: boolean;
}

//Exercício 2 — Criar classe TarefaClass
//Cria uma classe TarefaClass que implemente a interface Tarefa.
class TaskClass implements Task {
    id: number;
    title: string;
    concluded: boolean;
//Crie um constructor que receba o id e o título.
    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        this.concluded = false;
    }
//Adicione um método que mude o estado para true.
    markConcluded(): void {
        this.concluded = true;
    }
}

//Exercício 3 — Array de objetos
//Cria um array chamado listaTarefas que armazene vários objetos do tipo Tarefa.
let taskList: TaskClass[] = [];
//Adicione 2 ou 3 tarefas de exemplo manualmente.
taskList.push(new TaskClass(1,"Rever slides aula 2"))
taskList.push(new TaskClass(2,"Fazer exercicios guiados"))
taskList.push(new TaskClass(3,"Fazer exercicios autonomos"))
renderTasks();


    //Exercício 4 — Adicionar tarefa via input
    //Cria um campo de texto e um botão para adicionar novas tarefas ao array.
    const input = document.querySelector("#taskInput") as HTMLInputElement;
    const buttonAdd = document.querySelector("#addBtn") as HTMLButtonElement;

    buttonAdd.addEventListener("click", () => {
    const title = input.value.trim();

    if (title === "") {
        return;
    }
    
    //Instancie a classe TarefaClass com um ID único (ex: `Date.now()`) e Use push() para inserir no array.
    const newTask = new TaskClass(Date.now(), title);
        taskList.push(newTask);
        input.value = "";
        renderTasks()
    });
    //Chame uma função para atualizar a visualização no HTML *Exercício 5 — Renderização dinâmica*
   function renderTasks() {
    var taskContainer = document.querySelector("#list");
    taskContainer.innerHTML = ""; // Limpa a lista antes de renderizar

    taskList.forEach(function (task) {
        var li = document.createElement("li");
        li.textContent = task.title;

        // Aplica classe CSS com base no estado
        if (task.concluded) {
            li.classList.add("completed");
        } else {
            li.classList.remove("completed");
        }

        // Evento para alternar concluída
        li.addEventListener("click", function () {
            task.concluded = !task.concluded; // Marca ou desmarca
            renderTasks(); // Atualiza a lista
        });

        //Exercício 7 — Remover tarefa
        //Adiciona um botão "Remover" ao lado de cada tarefa na lista.
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";  
        removeBtn.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que o clique no botão dispare o evento do li
            taskList = taskList.filter(t => t.id !== task.id);      
            renderTasks(); // Atualiza a lista
        });
        li.appendChild(removeBtn);          
        taskContainer.appendChild(li);
    });
}
//Exercício 9 - Altera o nome da tarefa já existente
//Permite editar o título de uma tarefa já existente na lista

//(Implementação opcional, pode ser feita com duplo clique ou botão de editar)
        addEventListener("dblclick", function () {
            var newTitle = prompt("Novo título para a tarefa:", "");
                if (newTitle !== null && newTitle.trim() !== "") {
                    task.title = newTitle.trim();
                    renderTasks(); // Atualiza a lista
                }       
        });
          
    