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
        this.ativo = false;
    };
    return UtilizadorClass;
}());
//Exercício 3 — Array de utilizadores
//Cria um array chamado listaUtilizadores.
var listaUtilizadores = [];
listaUtilizadores.push(new UtilizadorClass(1, "Abel", "ajdszp@hotmail.com"));
listaUtilizadores.push(new UtilizadorClass(2, "Joel", "jjdszp@hotmail.com"));
//Exercício 4 — Estrutura HTML (cartões)
//Cria no HTML um contentor para mostrar os utilizadores. (Foi criado no index.html)
//- Cria uma div principal para conter a lista. 
var container = document.getElementById("lista-utilizadores");
// - Para cada item do array, cria uma nova div. 
listaUtilizadores.forEach(function (utilizador) {
    // - Cada div representa um cartão com os dados do objeto. 
    var userCardDiv = document.createElement("div");
    userCardDiv.classList.add("user-card");
    userCardDiv.innerHTML = "\n        <h3>".concat(utilizador.name, "</h3>\n        <p>Email: ").concat(utilizador.email, "</p>\n        <p>Estado: ").concat(utilizador.ativo ? "Ativo" : "Inativo", "</p>");
    // - Adiciona essa div ao contentor principal. 
    container.appendChild(userCardDiv);
});
// Exercício 5 — Função de renderização
// Função que cria os cartões de utilizadores
function renderUtilizadores(lista) {
    var container = document.getElementById("lista-utilizadores");
    container.innerHTML = ""; // Limpa o container antes de renderizar
    lista.forEach(function (utilizador) {
        var userCardDiv = document.createElement("div");
        userCardDiv.classList.add("user-card");
        // Cria o cartão com estado colorido
        userCardDiv.innerHTML = "\n            <h3>".concat(utilizador.name, "</h3>\n            <p>Email: ").concat(utilizador.email, "</p>\n            <p class=\"estado ").concat(utilizador.ativo ? "ativo" : "inativo", "\">\n                Estado: ").concat(utilizador.ativo ? "Ativo" : "Inativo", "\n            </p>\n        ");
        container.appendChild(userCardDiv);
    });
}
renderUtilizadores(listaUtilizadores);
