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
const mensagemDiv = document.getElementById("mensagem");

// Usa if para mostrar mensagem diferente dependendo do valor
if (mensagemDiv) {
    if (existemTarefas) {
        mensagemDiv.textContent = "Existem tarefas pendentes!";
    } else {
        mensagemDiv.textContent = "Não há tarefas neste momento.";
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

