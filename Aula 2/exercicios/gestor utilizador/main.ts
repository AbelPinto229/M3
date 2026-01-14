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
const container = document.getElementById("lista-utilizadores") as HTMLDivElement;

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

// Exercício 5 — Função de renderização
// Função que cria os cartões de utilizadores
function renderUtilizadores(lista: Utilizador[]): void {
    const container = document.getElementById("lista-utilizadores") as HTMLDivElement;
    container.innerHTML = ""; // Limpa o container antes de renderizar

    lista.forEach(utilizador => {
        const userCardDiv = document.createElement("div");
        userCardDiv.classList.add("user-card");

        // Cria o cartão com estado colorido
        userCardDiv.innerHTML = `
            <h3>${utilizador.name}</h3>
            <p>Email: ${utilizador.email}</p>
            <p class="estado ${utilizador.ativo ? "ativo" : "inativo"}">
                Estado: ${utilizador.ativo ? "Ativo" : "Inativo"}
            </p>
        `;

        container.appendChild(userCardDiv);
    });
}
renderUtilizadores(listaUtilizadores);
