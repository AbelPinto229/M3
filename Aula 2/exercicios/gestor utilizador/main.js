//                    exercicios guiados 2-1
// Exercício 1 — Interface Utilizador
//Cria uma interface chamada Utilizador.
//Exercício 2 — Classe UtilizadorClass
//Cria uma classe UtilizadorClass que implemente a interface Utilizador.
var UtilizadorClass = /** @class */ (function () {
    function UtilizadorClass(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.ativo = true;
    }
    UtilizadorClass.prototype.desativar = function () {
        this.ativo = !this.ativo;
    };
    return UtilizadorClass;
}());
//Exercício 3 — Array de utilizadores
//Cria um array chamado listaUtilizadores.
var listaUtilizadores = [];
listaUtilizadores.push(new UtilizadorClass(Date.now(), "Abel", "ajdszp@hotmail.com"));
listaUtilizadores.push(new UtilizadorClass(Date.now(), "Joel", "jjdszp@hotmail.com"));
//Exercício 4 — Estrutura HTML (cartões)
//Cria no HTML um contentor para mostrar os utilizadores. (Foi criado no index.html)
//- Cria uma div principal para conter a lista. 
var container = document.getElementById("lista-utilizadores");
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
function renderUtilizadores(lista) {
    var container = document.getElementById("lista-utilizadores");
    container.innerHTML = ""; // Limpa o container antes de renderizar
    lista.forEach(function (utilizador) {
        var userCardDiv = document.createElement("div");
        userCardDiv.classList.add("user-card");
        // Cria o cartão e no CSS eu altero a cor consoante a class p.estado
        userCardDiv.innerHTML = "\n            <h3>".concat(utilizador.name, "</h3>\n            <p>Email: ").concat(utilizador.email, "</p>\n            <p class=\"estado ").concat(utilizador.ativo ? "ativo" : "inativo", "\">\n                Estado: ").concat(utilizador.ativo ? "Ativo" : "Inativo", "\n            </p>\n            <p class=\"tarefas\">0 tarefas atribu\u00EDdas</p> <!-- NOVO CAMPO -->\n        ");
        //Exercício 7 — Adiciona um botão "Desativare ativar" em cada cartão.
        //Adiciona um botão "Desativar" em cada cartão.
        var btnDesativar = document.createElement("button");
        btnDesativar.textContent = utilizador.ativo ? "Desativar" : "Ativar";
        btnDesativar.classList.add("btn-desativar"); // usa CSS para estilo
        // Evento para alternar estado via método da classe
        btnDesativar.addEventListener("click", function () {
            utilizador.desativar(); // chama o método da classe
            renderUtilizadores(listaUtilizadores); // atualiza os cartões
        });
        userCardDiv.appendChild(btnDesativar);
        container.appendChild(userCardDiv);
    });
    atualizarContador(); // Atualiza o contador após renderizar Exercicio 9
}
//Exercício 6 — Adicionar utilizador via formulário
//Criar uma form para colocar o formulario
var form = document.createElement("form");
form.classList.add("form");
//Cria inputs para nome e email e um botão "Adicionar" 
var nomeInput = document.createElement("input");
nomeInput.classList.add("nome-input");
nomeInput.type = "text";
nomeInput.placeholder = "First and Last name";
nomeInput.required = true;
var emailInput = document.createElement("input");
emailInput.classList.add("email-input");
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true;
var btnAdd = document.createElement("button");
btnAdd.classList.add("btn-adicionar");
btnAdd.textContent = "Novo utilizador";
form.appendChild(nomeInput);
form.appendChild(emailInput);
form.appendChild(btnAdd);
var containerForm = document.getElementById("form");
containerForm.prepend(form);
//Ligar o botão à lista de utilizadores e cria id automatico
form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita reload
    if (!form.checkValidity()) {
        alert("Preencha os campos corretamente. O email deve conter '@'.");
        return;
    }
    var nome = nomeInput.value.trim();
    var email = emailInput.value.trim();
    // Criar nova instância da classe
    listaUtilizadores.push(new UtilizadorClass(Date.now(), nome, email));
    renderUtilizadores(listaUtilizadores);
    // Limpar inputs
    nomeInput.value = "";
    emailInput.value = "";
});
// Exercício 8 — Filtrar utilizadores ativos e desativos
// Seleciona o container do formulário
var containerBtn = document.getElementById("form");
// Botão para mostrar todos
var btnMostrarTodos = document.createElement("button");
btnMostrarTodos.textContent = "Mostrar todos";
btnMostrarTodos.type = "button"; // evita submissão do form
btnMostrarTodos.classList.add("btn-filtrar");
containerForm.appendChild(btnMostrarTodos);
btnMostrarTodos.addEventListener("click", function () {
    renderUtilizadores(listaUtilizadores);
});
// Botão para mostrar apenas ativos
var btnMostrarAtivos = document.createElement("button");
btnMostrarAtivos.textContent = "Mostrar apenas ativos";
btnMostrarAtivos.type = "button";
btnMostrarAtivos.classList.add("btn-filtrar");
containerForm.appendChild(btnMostrarAtivos);
btnMostrarAtivos.addEventListener("click", function () {
    var ativos = listaUtilizadores.filter(function (u) { return u.ativo; });
    renderUtilizadores(ativos);
});
// Botão para mostrar apenas inativos
var btnMostrarInativos = document.createElement("button");
btnMostrarInativos.textContent = "Mostrar apenas inativos";
btnMostrarInativos.type = "button";
btnMostrarInativos.classList.add("btn-filtrar");
containerForm.appendChild(btnMostrarInativos);
btnMostrarInativos.addEventListener("click", function () {
    var inativos = listaUtilizadores.filter(function (u) { return !u.ativo; });
    renderUtilizadores(inativos);
});
// Exercício 9 — Contador de utilizadores
var contadorDiv = document.createElement("div");
contadorDiv.id = "contador-utilizadores";
contadorDiv.style.fontWeight = "bold";
contadorDiv.style.marginBottom = "10px";
// Coloca no topo do container de utilizadores
container.prepend(contadorDiv);
function atualizarContador() {
    var contador = document.getElementById("contador-utilizadores");
    contador.textContent = "Total de utilizadores: ".concat(listaUtilizadores.length);
}
//Exercício 10 — Preparação para integração futura
//Adiciona ao cartão do utilizador uma área chamada "Tarefas".
