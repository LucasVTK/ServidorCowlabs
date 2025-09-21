const API = "http://localhost:3000/demandas/filter";
const cbs = document.querySelectorAll("input.filtro");
const cards = document.querySelector(".row_cards");

async function cardConstructor(tag) {
  console.log("log de CardConstructor: essa é a tag recebida", tag);

  const noCards = `
  <div style="display: flex; flex-direction: column; align-items: center; text-align: center; min-height: 50vh">
    <p>Oops. Nenhuma demanda encontrada!</p>
    <img src="https://www.cowlabs.com.br/assets/img/sad_cow.gif" style="width: 80px; height: auto;">
  </div>`;

  const getDemandas = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: tag ? JSON.stringify({ demanda_tag: tag }) : JSON.stringify({}),
  });

  const demandas = await getDemandas.json();
  console.log("lista demandas", demandas);

  const items = demandas.items || demandas;

  cards.innerHTML = ``;

  if (!items || items.length === 0) {
    cards.innerHTML = noCards;
    return;
  }

  items.forEach((d) => {
    cards.innerHTML += `
      <div class="col-12" data-curso="${d.data_curso}">
        <div class="card mb-4">
          <div class="card-body">
            <div class="name_user">
              <span>
                <img class="imagem-user" src="https://cowlabs.com.br/assets/img/ImagemUser.jpg" class="rounded-circle" alt="">
                <span class="fs-5 fw-bold user_name">${d.user_demanda}</span>
              </span>
            </div>
            <h4 class="titulo">${d.demanda_title}</h4>
            <p class="card-text mb-0 descricao">${d.demanda_content}</p>
            <span class="curso-tag d-none">${d.demanda_tag}</span>
          </div>
          <div class="row justify-content-end m-2">
            <div class="btn-group col-auto mt-auto">
              <button type="button" class="btn demanda_btn">Ver demanda</button>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// a função abaixo insere uma nova demanda na página
document.querySelector(`form`).addEventListener(`submit`, (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("LogedUser"));
  const textoDemanda = $("#textoDemanda").val();
  const tituloDemanda = $("#novaDemanda").val();
  const filesLocation = $("#fileLocation")[0].files[0];
  const filesLocInput = filesLocation ? URL.createObjectURL(filesLocation) : "";

  let demandasExistentes =
    JSON.parse(localStorage.getItem("DemandasFakeDB")) || [];

  const newDemanda = {
    data_curso: user[0].curso,
    user_demanda: user[0].name,
    demanda_title: tituloDemanda,
    demanda_content: textoDemanda,
    demanda_tag: user[0].curso,
    file_location: filesLocInput,
  };

  demandasExistentes.unshift(newDemanda);
  localStorage.setItem("DemandasFakeDB", JSON.stringify(demandasExistentes));

  const modalElement = bootstrap.Modal.getInstance(
    document.getElementById("modalDemanda")
  );

  modalElement.hide();

  cardConstructor();
  montademanda();
});

function montademanda() {
  const botoes = document.querySelectorAll(".demanda_btn");
  botoes.forEach((botao) => {
    botao.addEventListener("click", function () {
      const card = botao.closest(".card");
      const nomeUsuario = card.querySelector(".user_name").innerHTML;
      const titulo = card.querySelector(".titulo").innerHTML;
      const descricao = card.querySelector(".descricao").innerHTML;

      const dadosDemanda = {
        usuario: nomeUsuario,
        titulo: titulo,
        descricao: descricao,
      };

      localStorage.setItem("demandaSelecionada", JSON.stringify(dadosDemanda));
      window.location.href = "/src/demanda_view/index.html";
    });
  });
}

function getCheckedValues(formID) {
  const form = document.getElementById(formID);
  const checkedBoxes = form.querySelectorAll('input[type="checkbox"]:checked');
  const values = Array.from(checkedBoxes).map((checkbox) => checkbox.value);

  console.log("retorno dos values", values);
  return values;
}

async function filter(formID) {
  const form = document.getElementById(formID);
  let tagValues = getCheckedValues(formID);
  console.log("cardConstructor recebe ", tagValues);

  // envia só a primeira tag marcada, porque o back espera string
  cardConstructor(tagValues.length > 0 ? tagValues[0] : null);
}

// adiciona onchange no filter sidebar
document
  .getElementById("form_filter_sidebar")
  .addEventListener("change", () => {
    filter("form_filter_sidebar");
  });

document
  .getElementById("form_filter_dropdown")
  .addEventListener("change", () => {
    filter("form_filter_dropdown");
  });

document.querySelector("#clear_filter").addEventListener("click", () => {
  document.getElementById("form_filter_sidebar").reset();
  cardConstructor();
});

document.querySelector("#filter_btn_sm").addEventListener("click", () => {
  document.getElementById("form_filter_dropdown").reset();
  cardConstructor();
});

cardConstructor(null); // inicial: todas
montademanda();