const form = document.getElementById("form-compra");
const inputProduto = document.getElementById("produto");
const inputQuantidade = document.getElementById("quantidade");
const lista = document.getElementById("lista-compras");
const btnLimpar = document.getElementById("limpar");
const mensagem = document.getElementById("mensagem");
const modal = document.getElementById("modal");
const confirmarCompra = document.getElementById("confirmar-compra");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const contadorCliques = document.getElementById("contador-cliques");
const toggleDark = document.getElementById("toggle-dark");
const seletorDaltonismo = document.getElementById("seletor-daltonismo");

const ESTOQUE_MAX = 100;

// Carregar preferências
let cliquesLimpar = parseInt(localStorage.getItem("contadorLimpar")) || 0;
contadorCliques.textContent = `Lista limpa ${cliquesLimpar} vezes.`;

if (localStorage.getItem("temaDark") === "true") {
  document.body.classList.add("dark");
  toggleDark.textContent = "☀️ Modo Claro";
}

const daltonismo = localStorage.getItem("daltonismo") || "";
if (daltonismo) {
  document.body.classList.add(daltonismo);
  seletorDaltonismo.value = daltonismo;
}

window.addEventListener("load", carregarLista);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const produto = inputProduto.value;
  const quantidade = parseInt(inputQuantidade.value);

  if (quantidade > 10) {
    mostrarMensagem("Limite de 10 unidades por vez!");
    return;
  }

  const estoqueAtual = calcularEstoque(produto);
  if (estoqueAtual + quantidade > ESTOQUE_MAX) {
    mostrarMensagem("Estoque esgotado para esse produto!");
    return;
  }

  adicionarItem(produto, quantidade, false);
  salvarNoLocalStorage(produto, quantidade, false);
  inputQuantidade.value = "";
});

btnLimpar.addEventListener("click", function () {
  localStorage.removeItem("listaCompras");
  lista.innerHTML = "";
  mostrarMensagem("Lista limpa!");

  cliquesLimpar++;
  contadorCliques.textContent = `Lista limpa ${cliquesLimpar} vezes.`;
  localStorage.setItem("contadorLimpar", cliquesLimpar);
});

confirmarCompra.addEventListener("click", () => {
  if (nomeInput.value && emailInput.value) {
    modal.style.display = "none";
    mostrarMensagem("Compra confirmada! Obrigado!");
  } else {
    alert("Preencha nome e e-mail!");
  }
});

// Dark Mode
toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleDark.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro";
  localStorage.setItem("temaDark", isDark);
});

// Modo Daltonismo
seletorDaltonismo.addEventListener("change", () => {
  document.body.classList.remove("protanopia", "deuteranopia", "tritanopia");
  const valor = seletorDaltonismo.value;
  if (valor) {
    document.body.classList.add(valor);
  }
  localStorage.setItem("daltonismo", valor);
});

function mostrarMensagem(texto) {
  mensagem.textContent = texto;
  mensagem.style.display = "block";
  setTimeout(() => {
    mensagem.style.display = "none";
  }, 3000);
}

function adicionarItem(produto, quantidade, pago) {
  const li = document.createElement("li");
  li.className = pago ? "pago" : "";

  const texto = document.createElement("span");
  texto.textContent = `⭐ ${produto} - ${quantidade}x ⭐`;
  li.appendChild(texto);

  if (!pago) {
    const botaoComprar = document.createElement("button");
    botaoComprar.textContent = "Comprar";
    botaoComprar.addEventListener("click", () => {
      modal.style.display = "flex";
      confirmarCompra.onclick = () => {
        if (nomeInput.value && emailInput.value) {
          li.classList.add("pago");
          li.removeChild(botaoComprar);
          atualizarItemNoLocalStorage(produto, true);
          modal.style.display = "none";
          mostrarMensagem("Compra confirmada!");
        } else {
          alert("Preencha nome e e-mail!");
        }
      };
    });
    li.appendChild(botaoComprar);
  }

  lista.appendChild(li);
}

function salvarNoLocalStorage(produto, quantidade, pago) {
  let listaCompras = JSON.parse(localStorage.getItem("listaCompras")) || [];
  listaCompras.push({ produto, quantidade, pago });
  localStorage.setItem("listaCompras", JSON.stringify(listaCompras));
}

function atualizarItemNoLocalStorage(produto, pago) {
  let listaCompras = JSON.parse(localStorage.getItem("listaCompras")) || [];
  listaCompras = listaCompras.map(item =>
    item.produto === produto ? { ...item, pago } : item
  );
  localStorage.setItem("listaCompras", JSON.stringify(listaCompras));
}

function carregarLista() {
  const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
  listaSalva.forEach(item =>
    adicionarItem(item.produto, item.quantidade, item.pago)
  );
}

function calcularEstoque(produto) {
  let listaCompras = JSON.parse(localStorage.getItem("listaCompras")) || [];
  return listaCompras
    .filter(item => item.produto === produto)
    .reduce((total, item) => total + item.quantidade, 0);
}
