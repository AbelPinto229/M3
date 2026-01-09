//                                                                                      EXERCICIOS AUTONOMOS AULA 1
//EXERCICIO 1
// Variável global para contar
var count = 0;
// Seleciona os elementos HTML
var contadorDiv = document.getElementById("contador");
var btnAdicionar = document.getElementById("btnAdicionar");
// Função que incrementa e atualiza a página
function incrementarTarefas() {
    count++; // adiciona 1
    contadorDiv.innerHTML = "Total tarefas: ".concat(count);
}
//Associa o botão à função 
btnAdicionar.onclick = incrementarTarefas;
// EXERCÍCIO 2
// Cria uma função que recebe a mensagem de erro,
// seleciona uma div específica para erros e atribui o valor usando innerHTML.
function capturaErro(mensagem) {
    var erroDiv = document.getElementById("erroMensagem");
    if (erroDiv) {
        erroDiv.innerHTML = mensagem; // Atribui a mensagem à div
    }
    else {
        console.error("Elemento de erro não encontrado!");
    }
}
// EXERCÍCIO 3
// Seleciona o input e o botão
var meuInput = document.getElementById("meuInput");
var btnLimpar = document.getElementById("btnLimpar");
// Função que limpa o input
function limpaInput(campo) {
    campo.value = ""; // limpa o campo
}
// Liga ao botão
btnLimpar.addEventListener("click", function () {
    limpaInput(meuInput); // chama a função passando o input
});
// EXERCÍCIO 4
// Cria uma variável booleana indicando se existem tarefas
var existemTarefas = false; // ou false, dependendo do caso
// Seleciona a div para mostrar a mensagem
var mensagemDiv = document.getElementById("mensagem");
// Usa if para mostrar mensagem diferente dependendo do valor
if (mensagemDiv) {
    if (existemTarefas) {
        mensagemDiv.textContent = "Existem tarefas pendentes!";
    }
    else {
        mensagemDiv.textContent = "Não há tarefas neste momento.";
    }
}
// EXERCÍCIO 5
// Seleciona a div onde vamos mostrar o valor
var resultadoDiv = document.getElementById("resultado");
function recebeInput(valor) {
    if (!resultadoDiv)
        return; // garante que a div existe
    if (typeof valor === "number") {
        resultadoDiv.innerHTML = "Passaste um n\u00FAmero: ".concat(valor);
    }
    else {
        resultadoDiv.innerHTML = "Passaste um texto: ".concat(valor);
    }
}
recebeInput(24); // Mostra "Passaste um número: 42" na div
// EXERCÍCIO 6
//Cria uma variável do tipo string | null.
var meuTexto = "Olá, mundo!"; // pode começar como null também
// Seleciona a div onde vamos mostrar o valor
var resultado = document.getElementById("verificarNull");
// Antes de mostrar, verifica se não é null
if (meuTexto !== null && resultado) {
    // for string, mostra com innerHTML
    resultado.innerHTML = "O valor \u00E9: ".concat(meuTexto);
}
// EXERCÍCIO 7
// Seleciona o elemento HTML (uma div com id="texto") e os botões
var textoDiv = document.getElementById("texto");
var botaoCor = document.getElementById("botaoCor");
var botaoFonte = document.getElementById("botaoFonte");
//Verifica se todos os elementos existem antes de usar
if (textoDiv && botaoCor && botaoFonte) {
    // Evento para mudar a cor
    botaoCor.addEventListener("click", function () {
        // Alterna entre azul e vermelho
        textoDiv.style.color = textoDiv.style.color === "red" ? "blue" : "red";
    });
    // Evento para mudar o peso da fonte
    botaoFonte.addEventListener("click", function () {
        // Alterna entre negrito e normal
        textoDiv.style.fontWeight = textoDiv.style.fontWeight === "bold" ? "normal" : "bold";
    });
}
// EXERCÍCIO 8
