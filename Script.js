let dados = JSON.parse(localStorage.getItem("dados")) || [];
let guardado = parseFloat(localStorage.getItem("guardado")) || 0;
let meta = parseFloat(localStorage.getItem("meta")) || 0;

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function salvar() {
    localStorage.setItem("dados", JSON.stringify(dados));
}

function salvarMeta() {
    meta = parseFloat(document.getElementById("meta").value) || 0;
    localStorage.setItem("meta", meta);
    atualizar();
}

function digitandoGuardado() {
    let input = document.getElementById("inputGuardado");
    input.value = input.value.replace(/\D/g, "");
}

function formatarGuardado() {
    let input = document.getElementById("inputGuardado");

    let valor = input.value.replace(/\D/g, "");
    valor = valor / 100;

    if (isNaN(valor) || valor < 0) {
        valor = 0;
    }

    guardado = valor;
    localStorage.setItem("guardado", guardado);

    input.value = formatarMoeda(valor);
    atualizar();
}

function adicionar() {
    let descricao = document.getElementById("descricao").value;
    let valor = parseFloat(document.getElementById("valor").value);
    let tipo = document.getElementById("tipo").value;
    let categoria = document.getElementById("categoria").value;

    if (!descricao || isNaN(valor)) {
        alert("Preencha corretamente");
        return;
    }

    let data = new Date().toLocaleDateString('pt-BR');

    dados.push({
        descricao,
        valor,
        tipo,
        categoria,
        data
    });

    salvar();
    atualizar();
    fecharModal();
}

function atualizar() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    let entradas = 0;
    let saidas = 0;

    dados.forEach((item, index) => {
        let li = document.createElement("li");

        li.classList.add(item.tipo);

        li.innerHTML = `
            ${item.data} - ${item.descricao} (${item.categoria}) - ${formatarMoeda(item.valor)}
            <button onclick="remover(${index})">X</button>
        `;

        lista.appendChild(li);

        if (item.tipo === "entrada") {
            entradas += item.valor;
        } else {
            saidas += item.valor;
        }
    });

    let disponivel = entradas - saidas - guardado;
    if (disponivel < 0) disponivel = 0;

    document.getElementById("entradas").innerText = formatarMoeda(entradas);
    document.getElementById("saidas").innerText = formatarMoeda(saidas);
    document.getElementById("saldo").innerText = formatarMoeda(disponivel);

    document.getElementById("inputGuardado").value = formatarMoeda(guardado);

    let progresso = meta > 0 ? (guardado / meta) * 100 : 0;

    if (progresso > 100) progresso = 100;

    document.getElementById("progresso").style.width = progresso + "%";
    document.getElementById("textoMeta").innerText =
        meta > 0 ? `${progresso.toFixed(0)}% da meta` : "Defina uma meta";
}

function remover(index) {
    dados.splice(index, 1);
    salvar();
    atualizar();
}

function abrirModal() {
    document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

atualizar();