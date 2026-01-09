var input = document.querySelector("#taskInput");
var buttonAdd = document.querySelector("#addBtn");
var list = document.querySelector("#taskList");
var output = document.querySelector("#output");
buttonAdd.addEventListener("click", function () {
    var taskText = input.value;
    if (taskText === "") {
        return;
    }
    var li = document.createElement("li");
    li.textContent = taskText;
    list.appendChild(li);
    input.value = "";
});
//EXERCICIO 1
// Cria uma variável do tipo string
var mensagem = "Este texto vem do main.ts";
// Seleciona uma div na página (#output) usando querySelector
var outputDiv = document.querySelector("#output");
// Para mostrar o texto, usa innerHTML da div
if (outputDiv) {
    outputDiv.innerHTML = mensagem;
}
//EXERCICIO 2
// Cria uma variável `count` do tipo number inicializada a 0.
var count = 0;
// Seleciona uma div para mostrar o total de tarefas.
var totalDiv = document.getElementById('total');
// Cria um botão e adiciona um event listener de click.
var buttonCount = document.querySelector("#btn");
// Dentro do listener, incrementa `count` e atualiza o conteúdo da div usando innerHTML.
if (buttonCount && totalDiv) {
    buttonCount.addEventListener("click", function () {
        count++;
        totalDiv.innerHTML = "Total: ".concat(count);
    });
}
//EXERCICIO 3
// Cria uma variável do tipo boolean
var temTarefas = false;
// Seleciona a div onde a mensagem será mostrada
var mensagemDiv = document.getElementById("mensagem");
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
var botao = document.getElementById("alternar");
botao.addEventListener("click", function () {
    temTarefas = !temTarefas;
    atualizarMensagem();
});
// Chama a função ao carregar a página para mostrar o estado inicial
atualizarMensagem();
//EXERCICIO 4
// Cria uma função que recebe um parâmetro do tipo string
function mostrarMensagem(texto) {
    //Seleciona a div
    var div = document.getElementById('novaMensagem');
    // Atribui o parâmetro à div usando innerHTML
    if (div) {
        div.innerHTML = texto;
    }
}
// Chama a função passando diferentes mensagens para testar
mostrarMensagem("Olá, mundo!");
setTimeout(function () {
    mostrarMensagem("Esta é outra mensagem!");
}, 2000);
setTimeout(function () {
    mostrarMensagem("E esta é outra mensagem!");
}, 4000);
setTimeout(function () {
    mostrarMensagem("E tens aqui mais outra mensagem!");
}, 6000);
setTimeout(function () {
    mostrarMensagem("Acabou as mensagens!");
}, 8000);
//EXERCICIO 5
// Cria uma função que recebe um texto
function validarTexto(texto) {
    //Seleciona a div para mostrar a mensagem
    var div = document.getElementById('validarTexto');
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
var input6 = document.querySelector('#meuInput');
// Seleciona o botão
var botao6 = document.querySelector('#botaoLer');
// Seleciona a div onde o texto será exibido
var resultadoDiv = document.querySelector('#resultado');
// No click do botão, lê o valor do input
botao6.addEventListener('click', function () {
    // Lê o valor do input
    var texto = input6.value;
    // Mostra o valor na página
    resultadoDiv.innerHTML = texto;
});
//EXERCICIO 7
//Seleciona o botão usando querySelector e faz cast para HTMLButtonElement
var botaoGerador = document.querySelector('#botaoGerador');
// Seleciona uma div onde a mensagem vai aparecer.
var resultadoGerado = document.querySelector('#resultadoGerador');
//Adiciona um event listener para click.
botaoGerador.addEventListener('click', function () {
    // Dentro do listener, altera o conteúdo da div usando innerHTML.
    resultadoGerado.innerHTML = "Texto gerado pelo TypeScript!";
});
//EXERCICIO 8
// Seleciona a lista (ul ou ol) onde o item vai ser adicionado.
var lista = document.querySelector('#lista');
//Cria um novo elemento com document.createElement("li").
var novoItem = document.createElement('li');
//Define o texto do novo item.
novoItem.textContent = "Item adicionado 1";
//Adiciona o novo item à lista usando appendChild.
lista.appendChild(novoItem);
//EXERCICIO 9
// Seleciona o elemento HTML
var meuElemento = document.querySelector('#meuElemento');
// Verifica se o elemento existe
if (meuElemento !== null) {
    // Atualiza o conteúdo
    meuElemento.innerHTML = "O texto foi atualizado!";
}
//EXERCICIO 10
// Cria uma variável do tipo unknown
var valorDesconhecido = "Que tipo sou eu?";
// Seleciona o elemento HTML onde vamos mostrar o valor
var resultado = document.querySelector('#resultadoDez');
// Antes de usar, verifica o tipo
if (typeof valorDesconhecido === 'string' || typeof valorDesconhecido === 'number') {
    // Se existir o elemento, atualiza o conteúdo
    if (resultado !== null) {
        resultado.innerHTML = "O valor \u00E9: ".concat(valorDesconhecido);
    }
}
