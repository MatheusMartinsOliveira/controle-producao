// ============================================
// 1. Dados
// ============================================
let ordens = [
  { numero: 101, produto: "Eixo de transmissão", quantidade: 200, maquina: "Torno CNC", status: "aguardando" },
  { numero: 102, produto: "Suporte de motor", quantidade: 500, maquina: "Prensa", status: "producao" },
  { numero: 103, produto: "Tampa plástica", quantidade: 1200, maquina: "Injetora", status: "concluida" },
  { numero: 104, produto: "Flange de aço", quantidade: 80, maquina: "Torno CNC", status: "aguardando" }
];

const NOMES = {
  aguardando: "Aguardando",
  producao: "Em produção",
  concluida: "Concluída"
};

// ============================================
// 2. Elementos
// ============================================
const resumo = document.querySelector("#resumo");
const botaoTv = document.querySelector("#modo-tv");
const lista = document.querySelector("#lista");
const botoes = document.querySelectorAll(".filtro");
const formOp = document.querySelector("#form-op");
const campoProduto = document.querySelector("#produto");
const campoQuantidade = document.querySelector("#quantidade");
const campoMaquina = document.querySelector("#maquina");
const campoUrgente = document.querySelector("#urgente"); // Exercício 3.5
const mensagem = document.querySelector("#mensagem");
const busca = document.querySelector("#busca");
const vazia = document.querySelector("#vazia");

// ============================================
// 3. Controle (estado da tela)
// ============================================
let proximoNumero = 105;
let filtro = "todas";

// ============================================
// 4. Funções
// ============================================
function atualizarResumo(mostrando) {
  let aguardando = 0;
  let producao = 0;
  let concluida = 0;

  ordens.forEach((op) => {
    if (op.status === "aguardando") {
      aguardando++;
    } else if (op.status === "producao") {
      producao++;
    } else {
      concluida++;
    }
  });

  resumo.textContent =
    "Mostrando " + mostrando + " de " + ordens.length + " ordens\n" +
    "Aguardando: " + aguardando + " · Em produção: " + producao + " · Concluídas: " + concluida;
}

function criarOP(op) {
  const item = document.createElement("li");
  item.classList.add("op", "status-" + op.status);

  const titulo = document.createElement("h3");
  // Regra 5: texto do usuário sempre em textContent, nunca innerHTML
  titulo.textContent = "OP-" + op.numero + " · " + op.produto;

  const detalhes = document.createElement("p");
  detalhes.textContent = op.quantidade + " peças · " + op.maquina + " · " + NOMES[op.status];

  item.append(titulo, detalhes);

  if (op.urgente) {
    const selo = document.createElement("span");
    selo.className = "urgente";
    selo.textContent = "URGENTE";
    item.append(selo);
  }

  if (op.status !== "concluida") {
    const avancar = document.createElement("button");
    avancar.textContent = op.status === "aguardando" ? "Iniciar produção" : "Concluir";

    avancar.addEventListener("click", () => {
      if (op.status === "aguardando") {
        op.status = "producao";
      } else {
        op.status = "concluida";
      }
      desenhar();
    });

    item.append(avancar);
  }

  if (op.status === "aguardando") {
    const cancelar = document.createElement("button");
    cancelar.textContent = "Cancelar";

    cancelar.addEventListener("click", () => {
      if (confirm("Cancelar a OP-" + op.numero + "?")) {
        ordens = ordens.filter((o) => o !== op);
        desenhar();
      }
    });

    item.append(cancelar);
  }

  return item;
}

function desenhar() {
  let visiveis = filtro === "todas" ? ordens : ordens.filter((op) => op.status === filtro);

  const texto = busca.value.trim().toLowerCase();
  visiveis = visiveis.filter((op) => op.produto.toLowerCase().includes(texto));


  const urgentes = visiveis.filter((op) => op.urgente);
  const demais = visiveis.filter((op) => !op.urgente);

  lista.textContent = "";
  urgentes.forEach((op) => lista.append(criarOP(op)));
  demais.forEach((op) => lista.append(criarOP(op)));

  vazia.hidden = visiveis.length > 0;
  atualizarResumo(visiveis.length);
}

// ============================================
// 5. Ouvintes
// ============================================
botaoTv.addEventListener("click", () => {
  document.body.classList.toggle("modo-tv");
  botaoTv.textContent = document.body.classList.contains("modo-tv")
    ? "Sair do modo TV"
    : "Modo TV";
});

botoes.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    filtro = event.target.dataset.filtro;
    botoes.forEach((b) => b.classList.remove("selecionado"));
    event.target.classList.add("selecionado");
    desenhar();
  });
});

formOp.addEventListener("submit", (event) => {
  event.preventDefault();

  const produto = campoProduto.value.trim();
  const quantidade = Number(campoQuantidade.value);

  if (produto === "" || Number.isNaN(quantidade) || quantidade <= 0) {
    mensagem.textContent = "Informe o produto e uma quantidade maior que zero.";
    mensagem.hidden = false;
    return;
  }

  ordens.push({
    numero: proximoNumero,
    produto: produto,
    quantidade: quantidade,
    maquina: campoMaquina.value,
    status: "aguardando",
    urgente: campoUrgente.checked
  });
  proximoNumero++;

  mensagem.hidden = true;
  formOp.reset();
  campoProduto.focus();
  desenhar();
});

busca.addEventListener("input", desenhar);

// ============================================
// 6. Começo
// ============================================
desenhar();