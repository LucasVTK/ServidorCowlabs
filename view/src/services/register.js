// antes de realizar o login, temos que verificar se o usuário já existe
// para isso desativamos o botão de registro e só iremos ativá-lo quando todas as informações de usuário, CPF e e-mail forem novas entradas no banco de dados. Isso previne a existência de dois nomes de usuários iguais, e que duas pessoas tenham mais de uma conta e que sejam enviadas mensagens de recuperação de senha (a serem implementadas futuramente) para uma outra pessoa.

// inseren event listener nos campos trackeados
document.getElementById("User").addEventListener("change", () => inputCompare("User"));
// document.getElementById("Email").addEventListener("change", () => inputCompare("Email"));
// document.getElementById("CPF").addEventListener("change", () => inputCompare("CPF"));


// mensagem de erro de poucos caracteres
const UserMinCharact = `
<div>
<p class ="LoginMsg">O nome do usuário deve ter mais do que cinco caracteres.</p>
</div>
`

function inputCompare(inputId){
    
    const campoId = document.getElementById(inputId);
    
    
    // primeiro vamos comparar se o usário possui mais do que cinco caracteres. Entendemos que menos do que isso não é um nome razoável
    const minCaract = 5
    
    const loginMsg = document.getElementById("UserCheckerMsg")
    
    // checa a length do usuário. 
    if( campoId.id == "User" && campoId.value.length <= minCaract){
        // mensagem caso seja menor que cinco caracteres
        loginMsg.innerHTML = UserMinCharact
        return;
    }else{
        loginMsg.innerHTML = ``
        
        // como atualmente o trabalho está sendo desenvolvido para verificação do backend, não foi ajustada a verificação se o usuário solicitado já existe, o que pode ser feito com consulta ao backend. Será criada uma issue para consultar o nome do usuário no backend para esta verificação. Por este motivo, estas linhas do código estão comentadas, já que será objeto de trabalhos futuros.
        // recupera as informações do LocalStorage
        // // let users = JSON.parse(localStorage.getItem("RegisterUser"));
        // let url = `localhost:3000/users/${id}`
        // let users = 
        
        // // const FindUser = users.find(p=>p.name == campoId.value)
        
        // // checa se o usuário já existe
        // if(FindUser){
            
        //     // mensagem informando que o usuário existe
        //     loginMsg.innerHTML = `
        //     <div>
        //         <p class ="LoginMsgError">Este usuário já existe.</p>
        //     </div>
        //     `
        // }else{
        //     // limpa as informações na div
        //     loginMsg.innerHTML = ``
        // }
    }

}


// vamos fazer uma verificação de CEP com consumo de API

document.querySelector("#CEP").onblur = async function(e){
    // pegar a informação do usuário
    const info = document.querySelector("#CEP").value
    // validação dos dados
    if(info.length==8 && !isNaN(info)){
        // criando a constante URL
        const url = `https://viacep.com.br/ws/${info}/json/`
        // usando a funçao fetch e pegando a resposta do servidor
        const response = await fetch(url)
        // converter essa resposta em padrão JSON
        const dados = await response.json()
        
        // validação do retorno
        if(dados.erro){
            alert("CEP inexistente")
        }else{
            document.querySelector("#uf").value = dados.uf
            document.querySelector("#cidade").value = dados.localidade
            document.querySelector("#endereco").value = dados.logradouro
            // bairro foi incluído, pois não havia na versão do localstorage. O endereço era salvo sem essa consulta na ideia original.
            document.querySelector("#bairro").value = dados.bairro
            
            document.querySelector("#numero").focus()
        }
        
    }else{
        alert("CEP inválido")
    }

}



document.querySelector("#registerForm").addEventListener("submit", register)

async function register(e) {
    e.preventDefault();

    const Nome = document.querySelector("#User").value;
    const Realname = document.querySelector("#Realname").value;
    const CPF = document.querySelector("#CPF").value;
    const Email = document.querySelector("#Email").value;
    const Curso = document.querySelector("#curso").value;
    const Senha = document.querySelector("#Senha").value;
    const ConfirmSenha = document.querySelector("#ConfirmSenha").value;
    const uf = document.querySelector("#uf").value;
    const cidade = document.querySelector("#cidade").value;
    const endereco = document.querySelector("#endereco").value;
    const numero = document.querySelector("#numero").value;
    const complemento = document.querySelector("#complemento").value;
    const bairro = document.querySelector("#bairro").value;
    const cep = document.querySelector("#CEP").value;

    const InfoUser = document.querySelector("#InfoUser");

    const AdviseWrongPassword = `<div class="alert alert-danger d-flex align-items-center alert-dismissible fade show" role="alert">
    <strong>As senhas precisam ser iguais!</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

    if (Senha !== ConfirmSenha) {
        InfoUser.innerHTML = AdviseWrongPassword;
        closeAdvise();
        return;
    }

    if (Nome === "" || Realname === "" || CPF === "" || Email === "" || Curso === "") {
        alert("Preencha todos os campos");
        return;
    }

   
    const newUser = {
        user_name: Nome,
        user_real_name: Realname,
        user_cpf: CPF,
        user_email: Email,
        user_senha: Senha,
        user_tipo: "Aluno",
        user_uf: uf,
        user_cidade: cidade,
        user_endereco: endereco,
        user_num: numero,
        user_complemento: complemento,
        user_bairro: bairro,
        user_cep: cep
    };

    try {
        const response = await fetch("http://localhost:3000/users/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
           
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao cadastrar: ${response.status}`);
        }

        
        registerDone();

    } catch (error) {
        console.error("Erro no cadastro:", error);
        InfoUser.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Erro ao cadastrar:</strong> ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }
}


//função que avisa que o registro foi efetuado e chama o redirecionamento
function registerDone(){
    
    // esse é o aviso ao usuário de que deu tudo certo com o registro e ele será redirecionado
    const AdviseRegisterDone = `
    
        <div class="alert alert-success d-flex align-items-center" role="alert">
            <div>
            Registro Efetuado com sucesso. Você será redirecionado para login.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" id="AdviseCloseBtn"></button>
            </div>
        </div>
    `
    const InfoUser  = document.querySelector("#InfoUser")
    
    InfoUser.innerHTML = AdviseRegisterDone
   
    // como o registro foi realizado com sucesso, o usuário será redirecionado automaticamente em 3 segundos.

    redirectLogin()

}

// função que fecha automaticamente o botão do aviso de que as senhas não conferem
function closeAdvise(){
    setTimeout(()=>{
        document.getElementById("AdviseCloseBtn").click();

    }, 1500);

}

// essa função será chamada para redirecionar o usuário.
function redirectLogin(){
    setTimeout(()=>{
        window.location.href = '../pages/loing.html';
      
    }, 3000);
    
}