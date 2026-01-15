//                    exercicios guiados 2-1
// Exercício 1 — Interface Utilizador
//Cria uma interface chamada Utilizador.

interface Utilizador {
    id: number;
    name: string;
    email: string;
    ativo: boolean;
    
}
//Exercício 2 — Classe UtilizadorClass
//Cria uma classe UtilizadorClass que implemente a interface Utilizador.

class UtilizadorClass implements Utilizador {
    id: number;
    name: string;
    email: string;
    ativo: boolean

    constructor (id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.ativo = true;
    }
    desativar(): void {
        this.ativo=!this.ativo;
    }
}

//Exercício 3 — Array de utilizadores
//Cria um array chamado listaUtilizadores.
let listaUtilizadores : UtilizadorClass []=[];

listaUtilizadores.push(new UtilizadorClass(Date.now(),"Abel", "ajdszp@hotmail.com"))
listaUtilizadores.push(new UtilizadorClass(Date.now(),"Joel", "jjdszp@hotmail.com"))

//Exercício 4 — Estrutura HTML (cartões)
//Cria no HTML um contentor para mostrar os utilizadores. (Foi criado no index.html)
//- Cria uma div principal para conter a lista. 
const container = document.getElementById("lista-utilizadores") as HTMLDivElement;
/* substitiu isto por a funcao rendertask pq o botao ativar e desativar só me aparecia depois de criar novo user
// - Para cada item do array, cria uma nova div. 
listaUtilizadores.forEach(utilizador => {
// - Cada div representa um cartão com os dados do objeto. 
    const userCardDiv = document.createElement("div") as HTMLDivElement;
    userCardDiv.classList.add("user-card");
    userCardDiv.innerHTML = `
        <h3>${utilizador.name}</h3>
        <p>Email: ${utilizador.email}</p>
        <p>Estado: ${utilizador.ativo ? "Ativo" : "Inativo"}</p>`;

// - Adiciona essa div ao contentor principal. 
    container.appendChild(userCardDiv);
});
*/
renderUtilizadores(listaUtilizadores);

// Exercício 5 — Função de renderização
// Função que cria os cartões de utilizadores
function renderUtilizadores(lista: UtilizadorClass[]): void {
    const container = document.getElementById("lista-utilizadores") as HTMLDivElement;
    container.innerHTML = ""; // Limpa o container antes de renderizar

    lista.forEach(utilizador => {
        const userCardDiv = document.createElement("div");
        userCardDiv.classList.add("user-card");

        // Cria o cartão e no CSS eu altero a cor consoante a class p.estado
        userCardDiv.innerHTML = `
            <h3>${utilizador.name}</h3>
            <p>Email: ${utilizador.email}</p>
            <p class="estado ${utilizador.ativo ? "ativo" : "inativo"}">
                Estado: ${utilizador.ativo ? "Ativo" : "Inativo"}
            </p>
            <p class="tarefas">0 tarefas atribuídas</p>`; // Exercício 10 — Preparação para integração futura
        
        //Exercício 7 — Adiciona um botão "Desativare ativar" em cada cartão.
        //Adiciona um botão "Desativar" em cada cartão.
        
        const btnDesativar = document.createElement("button");
        btnDesativar.textContent = utilizador.ativo ? "Desativar" : "Ativar";
        if (utilizador.ativo) {
            btnDesativar.classList.add("inativo"); // vermelho
        } else {
            btnDesativar.classList.add("ativo"); // verde
        }

        // Evento para alternar estado via método da classe
        btnDesativar.addEventListener("click", () => {
            utilizador.desativar();        // chama o método da classe
            renderUtilizadores(listaUtilizadores); // atualiza os cartões
        });

        userCardDiv.appendChild(btnDesativar);
        container.appendChild(userCardDiv);
    });
    
    atualizarContador(); // Atualiza o contador após renderizar Exercicio 9
}

//Exercício 6 — Adicionar utilizador via formulário
//Criar uma form para colocar o formulario
const form = document.createElement("form")
form.classList.add("form")

//Cria inputs para nome e email e um botão "Adicionar" 
const nomeInput = document.createElement("input") as HTMLInputElement;
nomeInput.classList.add("nome-input");
nomeInput.type = "text";
nomeInput.placeholder = "First and Last name"
nomeInput.required = true

const emailInput = document.createElement("input") as HTMLInputElement;
emailInput.classList.add("email-input");
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true

const btnAdd = document.createElement("button") as HTMLButtonElement;
btnAdd.classList.add("btn-adicionar");
btnAdd.textContent = "Novo utilizador";

form.appendChild(nomeInput);
form.appendChild(emailInput);
form.appendChild(btnAdd);

const containerForm = document.getElementById("form") as HTMLDivElement;
containerForm.prepend(form);

//Ligar o botão à lista de utilizadores e cria id automatico
form.addEventListener("submit", (e) => {
    e.preventDefault(); // evita reload

    if (!form.checkValidity()) {
        alert("Preencha os campos corretamente. O email deve conter '@'.");
        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    // Criar nova instância da classe
    listaUtilizadores.push(new UtilizadorClass(Date.now(), nome, email));

    renderUtilizadores(listaUtilizadores);

    // Limpar inputs
    nomeInput.value = "";
    emailInput.value = "";
});

// Exercício 8 — Filtrar utilizadores ativos e desativos
// Seleciona o container do formulário
const containerBtn = document.getElementById("form") as HTMLDivElement;

// Botão para mostrar todos
const btnMostrarTodos = document.createElement("button");
btnMostrarTodos.textContent = "Mostrar todos";
btnMostrarTodos.type = "button"; // evita submissão do form
btnMostrarTodos.classList.add("btn-filtrar");
containerForm.appendChild(btnMostrarTodos);

btnMostrarTodos.addEventListener("click", () => {
    renderUtilizadores(listaUtilizadores);
});

// Botão para mostrar apenas ativos
const btnMostrarAtivos = document.createElement("button");
btnMostrarAtivos.textContent = "Mostrar apenas ativos";
btnMostrarAtivos.type = "button";
btnMostrarAtivos.classList.add("btn-filtrar");
containerForm.appendChild(btnMostrarAtivos);

btnMostrarAtivos.addEventListener("click", () => {
    const ativos = listaUtilizadores.filter(u => u.ativo);
    renderUtilizadores(ativos);
});

// Botão para mostrar apenas inativos
const btnMostrarInativos = document.createElement("button");
btnMostrarInativos.textContent = "Mostrar apenas inativos";
btnMostrarInativos.type = "button";
btnMostrarInativos.classList.add("btn-filtrar");
containerForm.appendChild(btnMostrarInativos);

btnMostrarInativos.addEventListener("click", () => {
    const inativos = listaUtilizadores.filter(u => !u.ativo);
    renderUtilizadores(inativos);
});

// Exercício 9 — Contador de utilizadores

const contadorDiv = document.createElement("div");
contadorDiv.id = "contador-utilizadores";
contadorDiv.style.fontWeight = "bold";
contadorDiv.style.marginBottom = "10px";

// Coloca no topo do container de utilizadores
container.prepend(contadorDiv);

function atualizarContador(): void {
    const contador = document.getElementById("contador-utilizadores") as HTMLDivElement;
    contador.textContent = `Total de utilizadores: ${listaUtilizadores.length}`;
}



