const inputTarefa = document.querySelector("#input-tarefa");
const btnAdicionar = document.querySelector("#btn-adicionar");
const listaTarefas = document.querySelector("#lista-tarefas");
const botoesFiltro = document.querySelectorAll(".btn-filtro");
const contadorPendentes = document.querySelector("#contador-pendentes");
const btnLimparConcluidas = document.querySelector("#btn-limpar-concluidas");

let tarefas = [];
let filtroAtual = "todas"; // Pode ser: "todas", "pendentes" ou "concluidas"

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("minhas_tarefas");
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
        renderizarTarefas();
    }
}

function salvarNoLocalStorage() {
    localStorage.setItem("minhas_tarefas", JSON.stringify(tarefas));
}

function atualizarContador() {
    const pendentes = tarefas.filter(tarefa => !tarefa.concluida);
    contadorPendentes.innerText = `Tarefas pendentes: ${pendentes.length}`;
}

function renderizarTarefas() {
    listaTarefas.innerHTML = "";

    atualizarContador();

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "pendentes") return !tarefa.concluida;
        if (filtroAtual === "concluidas") return tarefa.concluida;
        return true;
    });

    tarefasFiltradas.forEach((tarefa) => {
        const indexReal = tarefas.indexOf(tarefa);

        const li = document.createElement("li");
        
        const spanTexto = document.createElement("span");
        spanTexto.innerText = tarefa.texto;

        if (tarefa.concluida) {
            spanTexto.classList.add("concluida");
        }

        spanTexto.addEventListener("click", function () {
            tarefas[indexReal].concluida = !tarefas[indexReal].concluida;
            salvarNoLocalStorage();
            renderizarTarefas();
        });

        const btnDeletar = document.createElement("button");
        btnDeletar.innerText = "❌";
        btnDeletar.classList.add("btn-deletar");

        btnDeletar.addEventListener("click", function () {
            tarefas.splice(indexReal, 1);
            salvarNoLocalStorage();
            renderizarTarefas();
        });

        li.appendChild(spanTexto);
        li.appendChild(btnDeletar);
        listaTarefas.appendChild(li);
    });
}

function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    if (texto === "") {
        alert("Por favor, digite uma tarefa antes de adicionar!");
        return;
    }

    tarefas.push({
        texto: texto,
        concluida: false
    });

    salvarNoLocalStorage();
    renderizarTarefas();

    inputTarefa.value = "";
    inputTarefa.focus();
}

// -------------------------------------------------------------
// Lógica dos Botões de Filtro
// -------------------------------------------------------------
botoesFiltro.forEach(botao => {
    botao.addEventListener("click", function () {
        // Remove a classe 'ativo' de todos os botões
        botoesFiltro.forEach(btn => btn.classList.remove("ativo"));
        
        // Adiciona a classe 'ativo' no botão clicado
        this.classList.add("ativo");

        // Atualiza a variável de controle com o valor contido no 'data-filtro'
        filtroAtual = this.dataset.filtro;

        // Re-desenha a lista com o novo filtro
        renderizarTarefas();
    });
});

btnAdicionar.addEventListener("click", adicionarTarefa);

inputTarefa.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});

btnLimparConcluidas.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja apagar as tarefas concluídas?")) {
        tarefas = tarefas.filter(tarefa => !tarefa.concluida);
        salvarNoLocalStorage();
        renderizarTarefas();
    }
});

carregarTarefas();