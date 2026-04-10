export default async function loaderDemandas() {
  const URL = `http://localhost:3000/demandas`;
  const resp = await fetch(URL);
  const {items} = await resp.json();


  const cards = document.querySelector(".row_cards");

  

  if (items) {
    cards.innerHTML = ""
    console.log(items);

    
    items.forEach((d)=>{
      cards.innerHTML += `
        <div class="col-12" data-curso="${``}">
        <div class="card mb-4">
          <div class="card-body">
            <div class="name_user">
              <span>
                <img  class="imagem-user"  src="/view/src/img/ImagemUser.jpg"" class="rounded-circle" alt="">
                <span class="fs-5 fw-bold user_name">${d.user_name}</span>
              </span>
            </div>
            <h4 class="titulo">${d.demanda_title}</h4>
            <p class="card-text mb-0 descricao">${d.demanda_content}</p>
            <span class="curso-tag d-none">${``}</span>
          </div>
          <div class="row justify-content-end m-2">
            <div class="btn-group col-auto mt-auto">
              <button type="button" class="btn demanda_btn">Ver demanda</button>
            </div>
          </div>
        </div>
      </div>
      `
    })
    // demandas.Map((d) => {
    //   cards.innerHTML += `
                
    //     `;
    // });
  }
}