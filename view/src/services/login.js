document.querySelector("#login-form").addEventListener("submit", validaLogin);

// const user = document.querySelector("#user").value;

async function validaLogin(e) {
    e.preventDefault();

    const user = document.querySelector("#user_email").value;
    const senha = document.querySelector("#Senha").value;

    if (user === "" || senha === "") {
        alert("Preencha todos os campos");
        return;
    }

    const body = {
        user_email: user,
        user_senha: senha
    };

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Usuário ou senha inválidos");
        }

        const data = await response.json();

        // Salva o token JWT — use sessionStorage se quiser que expire ao fechar o navegador
        sessionStorage.setItem("token", data.token);

        // Salva os dados do usuário retornados pelo backend
        sessionStorage.setItem("LogedUser", JSON.stringify(data.user));

        // Abre o diálogo e redireciona
        meuDialogo();

    } catch (error) {
        console.error("Erro no login:", error);
        alert(`Erro ao fazer login: ${error.message}`);
    }
}

function meuDialogo() {
    console.log(`Usuário logado com sucesso`)
    document.getElementById("meuDialogo").showModal();


    setTimeout(() => {
    // direciona para pagina de perfil
        window.location.href = "../pages/profile.html";
    }, 2000);
    
    //      window.location.href = '../demandas/index.html';
    //  }, 2000);
   
}