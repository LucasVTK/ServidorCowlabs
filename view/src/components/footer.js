const defaultFooter = `
    <!-- footer início -->
    <footer id="rodape" class="pt-3 pb-3 bg-blue sticky">
      <div class="container align-middle">
        <div
          class="d-flex align-middle flex-wrap justify-content-between align-items-center border-bottom"
        >
          <div
            class="col-md-4 d-flex text-light align-items-center align-middle"
          >
            <a
              class="navbar-brand align-middle d-flex align-items-center"
              href="https://cowlabs.com.br/src/home/index.htm"
              style="font-weight: bold"
            >
              CowLabs
            </a>
          </div>

          <ul class="list-unstyled pt-3 align-middle d-flex">
            <li class="ms-3">
              <a class="link-body-emphasis" href="#"
                ><i class="bi align-middle text-light bi-twitter-x"></i
              ></a>
            </li>
            <li class="ms-3">
              <a class="link-body-emphasis" href="#"
                ><i class="bi align-middle text-light bi-instagram"></i
              ></a>
            </li>
            <li class="ms-3">
              <a class="link-body-emphasis" href="#"
                ><i class="bi align-middle text-light bi-facebook"></i
              ></a>
            </li>
            <li class="ms-3">
              <a class="link-body-emphasis" href="#"
                ><i class="bi align-middle text-light bi-linkedin"></i
              ></a>
            </li>
            <li class="ms-3">
              <a class="link-body-emphasis" href="#"
                ><i class="bi align-middle text-light bi-whatsapp"></i
              ></a>
            </li>
          </ul>
        </div>
      </div>

      <div class="container">
        <div
          class="d-flex flex-wrap justify-content-between align-items-center my-4"
        >
          <div class="col-md-4 mb-0 text-body-secondary">
            <p class="">&copy; 2025 cowlabs , Todos direitos reservados.</p>
          </div>
          <div class="nav col-md-5 justify-content-end">
            <p
              class="mt-1 ms-2 bi bi-geo-alt text-body-secondary align-items-center align-middle pt-3"
            >
              Rua da Criatividade, nº 42 – Bairro das Ideias, Universo Web – BR
            </p>
          </div>
        </div>
      </div>
    </footer>

    <!-- fim do footer -->

`

function footer(){

    document.body.innerHTML += defaultFooter


}

export default footer