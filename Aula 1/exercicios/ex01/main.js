"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input = document.querySelector("#taskInput");
const buttonAdd = document.querySelector("#addBtn");
const list = document.querySelector("#taskList");
const output = document.querySelector("#output");
buttonAdd.addEventListener("click", () => {
    const taskText = input.value;
    if (taskText === "") {
        return;
    }
    const li = document.createElement("li");
    li.textContent = taskText;
    list.appendChild(li);
    input.value = "";
});
//                                                                                      EXERCICIOS GUIADOS 1
//EXERCICIO 1
// Cria uma variável do tipo string
const mensagem = "Este texto vem do main.ts";
// Seleciona uma div na página (#output) usando querySelector
const outputDiv = document.querySelector("#output");
// Para mostrar o texto, usa innerHTML da div
if (outputDiv) {
    outputDiv.innerHTML = mensagem;
}
//EXERCICIO 2
// Cria uma variável `count` do tipo number inicializada a 0.
let count = 0;
// Seleciona uma div para mostrar o total de tarefas.
const totalDiv = document.getElementById('total');
// Cria um botão e adiciona um event listener de click.
const buttonCount = document.querySelector("#btn");
// Dentro do listener, incrementa `count` e atualiza o conteúdo da div usando innerHTML.
if (buttonCount && totalDiv) {
    buttonCount.addEventListener("click", () => {
        count++;
        totalDiv.innerHTML = `Total: ${count}`;
    });
}
//EXERCICIO 3
// Cria uma variável do tipo boolean
let temTarefas = false;
// Seleciona a div onde a mensagem será mostrada
const mensagemDiv = document.getElementById("mensagem");
// Função para atualizar a mensagem
function atualizarMensagem() {
    if (temTarefas) {
        mensagemDiv.textContent = "Existem tarefas pendentes!";
        mensagemDiv.classList.remove("sem-tarefas"); // vermelho    
    }
    else {
        mensagemDiv.textContent = "Não há tarefas no momento.";
        mensagemDiv.classList.add("sem-tarefas"); // verde
    }
}
// Seleciona o botão e adiciona evento para alternar o estado
const botao = document.getElementById("alternar");
botao.addEventListener("click", () => {
    temTarefas = !temTarefas;
    atualizarMensagem();
});
// Chama a função ao carregar a página para mostrar o estado inicial
atualizarMensagem();
//EXERCICIO 4
// Cria uma função que recebe um parâmetro do tipo string
function mostrarMensagem(texto) {
    //Seleciona a div
    const div = document.getElementById('novaMensagem');
    // Atribui o parâmetro à div usando innerHTML
    if (div) {
        div.innerHTML = texto;
    }
}
// Chama a função passando diferentes mensagens para testar
mostrarMensagem("Olá, mundo!");
setTimeout(() => {
    mostrarMensagem("Esta é outra mensagem!");
}, 2000);
setTimeout(() => {
    mostrarMensagem("E esta é outra mensagem!");
}, 4000);
setTimeout(() => {
    mostrarMensagem("E tens aqui mais outra mensagem!");
}, 6000);
setTimeout(() => {
    mostrarMensagem("Acabou as mensagens!");
}, 8000);
//EXERCICIO 5
// Cria uma função que recebe um texto
function validarTexto(texto) {
    //Seleciona a div para mostrar a mensagem
    const div = document.getElementById('validarTexto');
    if (div) {
        // Verifica se o comprimento do texto é >= 3
        if (texto.length >= 3) {
            // Texto válido
            div.innerHTML = "Texto válido";
        }
        else {
            // Texto inválido
            div.innerHTML = "Texto inválido";
        }
    }
}
validarTexto("AAA"); // Texto válido
//EXERCICIO 6
// Seleciona o input e faz cast para HTMLInputElement
const input6 = document.querySelector('#meuInput');
// Seleciona o botão
const botao6 = document.querySelector('#botaoLer');
// Seleciona a div onde o texto será exibido
const resultadoDiv = document.querySelector('#resultado');
// No click do botão, lê o valor do input
botao6.addEventListener('click', () => {
    // Lê o valor do input
    const texto = input6.value;
    // Mostra o valor na página
    resultadoDiv.innerHTML = texto;
});
//EXERCICIO 7
//Seleciona o botão usando querySelector e faz cast para HTMLButtonElement
const botaoGerador = document.querySelector('#botaoGerador');
// Seleciona uma div onde a mensagem vai aparecer.
const resultadoGerado = document.querySelector('#resultadoGerador');
//Adiciona um event listener para click.
botaoGerador.addEventListener('click', () => {
    // Dentro do listener, altera o conteúdo da div usando innerHTML.
    resultadoGerado.innerHTML = "Texto gerado pelo TypeScript!";
});
//EXERCICIO 8
// Seleciona a lista (ul ou ol) onde o item vai ser adicionado.
const lista = document.querySelector('#lista');
//Cria um novo elemento com document.createElement("li").
const novoItem = document.createElement('li');
//Define o texto do novo item.
novoItem.textContent = "Item adicionado 1";
//Adiciona o novo item à lista usando appendChild.
lista.appendChild(novoItem);
//EXERCICIO 9
// Seleciona o elemento HTML
const meuElemento = document.querySelector('#meuElemento');
// Verifica se o elemento existe
if (meuElemento !== null) {
    // Atualiza o conteúdo
    meuElemento.innerHTML = "O texto foi atualizado!";
}
//EXERCICIO 10
// Cria uma variável do tipo unknown
let valorDesconhecido = "Que tipo sou eu?";
// Seleciona o elemento HTML onde vamos mostrar o valor
const resultado = document.querySelector('#resultadoDez');
// Antes de usar, verifica o tipo
if (typeof valorDesconhecido === 'string' || typeof valorDesconhecido === 'number') {
    // Se existir o elemento, atualiza o conteúdo
    if (resultado !== null) {
        resultado.innerHTML = `O valor é: ${valorDesconhecido}`;
    }
}
//# sourceMappingURL=main.js.map