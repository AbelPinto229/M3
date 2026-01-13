//                                                                                      EXERCICIOS AUTONOMOS AULA 1
//EXERCICIO 1
// Variável global para contar
let count: number = 0;
// Seleciona os elementos HTML
const contadorDiv = document.getElementById("contador") as HTMLDivElement;
const btnAdicionar = document.getElementById("btnAdicionar") as HTMLButtonElement;
// Função que incrementa e atualiza a página
function incrementarTarefas(): void {
    count++; // adiciona 1
    contadorDiv.innerHTML = `Total tarefas: ${count}`;
}
//Associa o botão à função 
btnAdicionar.onclick = incrementarTarefas;

// EXERCÍCIO 2
// Cria uma função que recebe a mensagem de erro,
// seleciona uma div específica para erros e atribui o valor usando innerHTML.
function capturaErro(mensagem: string): void {
    const erroDiv = document.getElementById("erroMensagem") as HTMLDivElement;

    if (erroDiv) {
        erroDiv.innerHTML = mensagem; // Atribui a mensagem à div
    } else {
        console.error("Elemento de erro não encontrado!");
    }
}

// EXERCÍCIO 3
// Seleciona o input e o botão
const meuInput = document.getElementById("meuInput") as HTMLInputElement;
const btnLimpar = document.getElementById("btnLimpar") as HTMLButtonElement;
// Função que limpa o input
function limpaInput(campo: HTMLInputElement): void {
    campo.value = ""; // limpa o campo
}
// Liga ao botão
btnLimpar.addEventListener("click", () => {
    limpaInput(meuInput); // chama a função passando o input
});

// EXERCÍCIO 4
// Cria uma variável booleana indicando se existem tarefas
let existemTarefas: boolean = false; // ou false, dependendo do caso

// Seleciona a div para mostrar a mensagem
const mensagemDiv4 = document.getElementById("mensagem");

// Usa if para mostrar mensagem diferente dependendo do valor
if (mensagemDiv4) {
    if (existemTarefas) {
        mensagemDiv4.textContent = "Existem tarefas pendentes!";
    } else {
        mensagemDiv4.textContent = "Não há tarefas neste momento.";
    }
}

// EXERCÍCIO 5
// Seleciona a div onde vamos mostrar o valor
const resultadoDiv = document.getElementById("resultado");

function recebeInput(valor: number | string) {
    if (!resultadoDiv) return; // garante que a div existe

    if (typeof valor === "number") {
        resultadoDiv.innerHTML = `Passaste um número: ${valor}`;
    } else {
        resultadoDiv.innerHTML = `Passaste um texto: ${valor}`;
    }
}

recebeInput(24);       // Mostra "Passaste um número: 42" na div

// EXERCÍCIO 6
//Cria uma variável do tipo string | null.
let meuTexto: string | null = "Olá, mundo!"; // pode começar como null também

// Seleciona a div onde vamos mostrar o valor
const resultado = document.getElementById("verificarNull");

// Antes de mostrar, verifica se não é null
if (meuTexto !== null && resultado) {
    // for string, mostra com innerHTML
    resultado.innerHTML = `O valor é: ${meuTexto}`;
}

// EXERCÍCIO 7
// Seleciona o elemento HTML (uma div com id="texto") e os botões
const textoDiv = document.getElementById("texto");
const botaoCor = document.getElementById("botaoCor");
const botaoFonte = document.getElementById("botaoFonte");

//Verifica se todos os elementos existem antes de usar
if (textoDiv && botaoCor && botaoFonte) {

// Evento para mudar a cor
    botaoCor.addEventListener("click", () => {
        // Alterna entre azul e vermelho
        textoDiv.style.color = textoDiv.style.color === "red" ? "blue" : "red";
    });

// Evento para mudar o peso da fonte
    botaoFonte.addEventListener("click", () => {
        // Alterna entre negrito e normal
        textoDiv.style.fontWeight = textoDiv.style.fontWeight === "bold" ? "normal" : "bold";
    });
}

// EXERCÍCIO 8
// Seleciona os elementos do DOM
const inputTarefa = document.getElementById("input") as HTMLInputElement;
const btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
const lista8 = document.getElementById("lista") as HTMLOListElement;

// Função para adicionar tarefa
function adicionarTarefa(): void {
    // Lê o valor do input
    const texto: string = inputTarefa.value.trim();

    // Valida o texto (mínimo 3 caracteres)
    if (texto.length < 3) {
        capturaErro("A tarefa deve ter pelo menos 3 caracteres.");
        return;
    }

    // Limpa mensagem de erro
    capturaErro("");

    // Cria um elemento <li> com o texto
    const li = document.createElement("li");
    li.textContent = texto;

    // Adiciona o li à lista
    lista.appendChild(li);

    // Limpa o input
    inputTarefa.value = "";

    // atualiza a mensagem
    mostrarMensagemTarefas(); 
}

// Associa o botão à função
btnAdd.addEventListener("click", adicionarTarefa);


// EXERCÍCIO 9
// Conta o número de tarefas (por exemplo, o tamanho da lista)
//Seleciona a div onde vamos mostrar o valor
const lista = document.getElementById("lista") as HTMLOListElement;
const mensagemDiv = document.getElementById("mensagemTarefa") as HTMLDivElement;

function mostrarMensagemTarefas(): void {
    const totalTarefas: number = lista.children.length;
        if (totalTarefas > 0) {
            mensagemDiv.textContent = `Tens ${totalTarefas} tarefa(s).`;
        } else {
            mensagemDiv.textContent = "Não há tarefas neste momento."
        }
        
}

// EXERCÍCIO 10
// Cria uma função que recebe texto.
function criarTarefa(texto: string): HTMLLIElement  {
    const novaLista = document.createElement("li")
    // Define o texto do li
    novaLista.textContent = texto;

    // Retorna o elemento
    return novaLista;
}

// Criar uma nova tarefa
const novaTarefa1 = criarTarefa("Comprar pão");
const novaTarefa2 = criarTarefa("Comprar leite");
// Adicionar à lista
lista.appendChild(novaTarefa1);
lista.appendChild(novaTarefa2);
