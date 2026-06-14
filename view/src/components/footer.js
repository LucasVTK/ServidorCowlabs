const defaultFooter = `
    <!-- footer início -->
   
      <footer class="footer-premium bg-brand-solid text-white pt-5">
        <div class="container">
          <div class="row align-items-center pb-4 border-bottom border-white border-opacity-10">
            <div class="col-md-4 mb-3 mb-md-0">
              <a class="logo-font" href="/view/public/index.html">Cow<span>Labs</span></a>
            </div>
            <div class="col-md-8 text-md-end">
              <div class="social-links">
                <a href="#"><i class="bi bi-instagram"></i></a>
                <a href="#"><i class="bi bi-linkedin"></i></a>
                <a href="#"><i class="bi bi-whatsapp"></i></a>
              </div>
            </div>
          </div>
          <div class="row py-4 small opacity-75">
            <div class="col-md-6 text-center text-md-start">
              <p class="mb-0">&copy; 2025 CowLabs UniFOA. Todos os direitos reservados.</p>
            </div>
            <div class="col-md-6 text-center text-md-end">
              <p class="mb-0"><i class="bi bi-geo-alt me-2"></i>Rua da Criatividade, nº 42 – UniFOA</p>
            </div>
          </div>
        </div>
      </footer>

    <!-- fim do footer -->

`;

function footer() {
  document.body.insertAdjacentHTML("beforeend", defaultFooter);
}

export default footer;
