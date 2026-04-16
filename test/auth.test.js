import httpMocks from "node-mocks-http";
import { afterEach, assert, describe, it } from "poku";
import quibble from "quibble";

// senha "minhaSenhaSecreta" com bcrypt e salt 10
const hash = "$2b$10$mwXfHXkbQj.CNyobX/8Yh.xnbX2Dn6SAfIGQx4Mxsau5UBwvVGFli"

// Usuário mock para ser retornado pelo repositório durante o teste
// como se viesse do banco de dados, com a senha já criptografada
const userMock = {
    user_id: 1,
    user_nome: "Rafael",
    user_email: "teste@gmail.com",
    user_senha: hash,
    user_tipo: "admin"
}

//mock do repositório, falseando a função usada pelo login (exportado como default)
await quibble.esm("../src/repositories/RegistroRepository.js", {
  default: {
    async readAll() { return true },
    async readById(id) { return true },
  
    async readUser(user_email) {
      if (user_email === userMock.user_email) {
        return userMock;
      }
      return null;
    },
    
    async create(model) { return true },
    async update(id, model) { return true },
    async updatePassword(user_id, user_senha) { return true },
  }
});

// importando o controller que foi exportado como esxport default
const obj = (await import("../src/controllers/AuthController.js")).default;

describe(" AuthController ", { background: 'blue' })

  await it("login(req, res) - Usuário logado com sucesso", async () => {
    
    // Define a variável de ambiente necessária para o jwt.sign funcionar no teste
    process.env.JWT_SECRET = "teste_secret";

    const req = httpMocks.createRequest({
      method: "POST",
      url: "/admin/login",
      body: {
        user_email: "teste@gmail.com",
        user_senha: "minhaSenhaSecreta" 
      },
    });
    const res = httpMocks.createResponse();
    
    await obj.login(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.strictEqual(data.ok, true, "Resposta deve conter ok: true");
    assert.strictEqual(data.message, "Usuário logado com sucesso!", "Mensagem deve indicar sucesso no login");
    
    const expectedPayload = {
      id: userMock.user_id,
      email: userMock.user_email,
      tipo: userMock.user_tipo
    };
    
    assert.deepStrictEqual(data.user, expectedPayload, "Dados do usuário no retorno devem corresponder ao payload do JWT");
    assert.strictEqual(typeof data.token, "string", "Token deve ser uma string"); 

  });

afterEach(() => { quibble.reset() });