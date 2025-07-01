const form = document.getElementById("form-compra");
const inputProduto = document.getElementById("produto");
const inputQuantidade = document.getElementById("quantidade");
const lista = document.getElementById("lista-compras");
const btnLimpar = document.getElementById("limpar");
const mensagem = document.getElementById("mensagem");

window.addEventListener("load", carregarLista);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const produto = inputProduto.value.trim();
  const quantidade = parseInt(inputQuantidade.value);

  if (produto && quantidade > 0) {
    adicionarItem(produto, quantidade, false);
    salvarNoLocalStorage(produto, quantidade, false);
    inputProduto.value = "";
    inputQuantidade.value = "";
  }
});

btnLimpar.addEventListener("click", function () {
  localStorage.removeItem("listaCompras");
  lista.innerHTML = "";
});

// Função para mostrar mensagem
function mostrarMensagem(texto) {
  mensagem.textContent = texto;
  mensagem.style.display = "block";
  setTimeout(() => {
    mensagem.style.display = "none";
  }, 2000);
}

// Adiciona item ao HTML
function adicionarItem(produto, quantidade, pago) {
  const li = document.createElement("li");
  li.className = pago ? "pago" : "";

  const texto = document.createElement("span");
  texto.textContent = `${produto} - ${quantidade}x`;
  li.appendChild(texto);

  if (!pago) {
    const botaoComprar = document.createElement("button");
    botaoComprar.textContent = "Comprar";
    botaoComprar.addEventListener("click", () => {
      li.classList.add("pago");
      li.removeChild(botaoComprar);
      atualizarItemNoLocalStorage(produto, true);
      mostrarMensagem("Obrigado por comprar!");
    });
    li.appendChild(botaoComprar);
  }

  lista.appendChild(li);
}

// Salvar novo item
function salvarNoLocalStorage(produto, quantidade, pago) {
  let listaCompras = JSON.parse(localStorage.getItem("listaCompras")) || [];
  listaCompras.push({ produto, quantidade, pago });
  localStorage.setItem("listaCompras", JSON.stringify(listaCompras));
}

// Atualizar item para "pago"
function atualizarItemNoLocalStorage(produto, pago) {
  let listaCompras = JSON.parse(localStorage.getItem("listaCompras")) || [];
  listaCompras = listaCompras.map(item =>
    item.produto === produto ? { ...item, pago: pago } : item
  );
  localStorage.setItem("listaCompras", JSON.stringify(listaCompras));
}

// Carregar lista salva
function carregarLista() {
  const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
  listaSalva.forEach(item =>
    adicionarItem(item.produto, item.quantidade, item.pago)
  );
}
