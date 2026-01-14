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
        this.ativo=false;
    }
}

//Exercício 3 — Array de utilizadores
//Cria um array chamado listaUtilizadores.
let listaUtilizadores : Utilizador []=[];

listaUtilizadores.push(new UtilizadorClass(1,"Abel", "ajdszp@hotmail.com"))
listaUtilizadores.push(new UtilizadorClass(2,"Joel", "jjdszp@hotmail.com"))

//Exercício 4 — Estrutura HTML (cartões)
//Cria no HTML um contentor para mostrar os utilizadores. (Foi criado no index.html)
//- Cria uma div principal para conter a lista. 
const container = document.getElementById("lista-utilizadores") as HTMLUListElement;

// - Para cada item do array, cria uma nova div. 
listaUtilizadores.forEach(utilizador => {
// - Cada div representa um cartão com os dados do objeto. 
    const userCardDiv = document.createElement("div") as HTMLDivElement;
    userCardDiv.classList.add("user-card ");
    userCardDiv.innerHTML = `
        <h3>${utilizador.name}</h3>
        <p>Email: ${utilizador.email}</p>
        <p>Estado: ${utilizador.ativo ? "Ativo" : "Inativo"}</p>`;

// - Adiciona essa div ao contentor principal. 
    container.appendChild(userCardDiv);
});