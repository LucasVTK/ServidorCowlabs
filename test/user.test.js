import httpMocks from "node-mocks-http";
import { afterEach, assert, describe, it } from "poku";
import quibble from "quibble";

// UsuÃ¡rio mock para ser enviado no body durante o teste
const userMock = {
    user_nome: "Rafael",
    user_email: "teste@gmail.com",
    user_senha: "minhaSenhaSecreta",
    user_tipo: "admin"
}

const usersMock = [
    {
        user_id: 1,
        user_nome: "Rafael",
        user_email: "teste@gmail.com",
        user_tipo: "admin"
    }
]

const verificaLoginMock = {
    user_email: "teste@gmail.com",
    user_name: "Rafael",
    user_cpf: "12345678901"
}

// mock do repositÃ³rio, falseando a funÃ§Ã£o usada pelo create (exportado como default)
await quibble.esm("../src/repositories/RegistroRepository.js", {
  default: {
    async readAll() { return usersMock },
    async readById(id) {
      if (id === "1") {
        return usersMock;
      }
      return null;
    },
    async readUser(user_email) { return true },
    
    async create(model) {
      if (model.user_email === userMock.user_email) {
        return { rowsAffected: [1] };
      }
      return { rowsAffected: [0] };
    },

    async update(id, model) { return { rowsAffected: [1] } },
    async updatePassword(user_id, user_senha) { return { rowsAffected: [1] } },
    async verificaLogin(user_email, user_name, user_cpf) {
      if (
        user_email === verificaLoginMock.user_email &&
        user_name === verificaLoginMock.user_name &&
        user_cpf === verificaLoginMock.user_cpf
      ) {
        return { recordset: [] };
      }
      return { recordset: [verificaLoginMock] };
    },
  }
});

// mock do auth, falseando a funÃ§Ã£o usada pelo create para criptografar a senha
await quibble.esm("../src/controllers/AuthController.js", {
  default: {
    crypt(user_senha) {
      return `hash-${user_senha}`;
    }
  }
});

const obj = (await import("../src/controllers/UserController.js")).default;

describe(" UserController ", { background: 'blue' })

  await it("create(req, res) - UsuÃ¡rio inserido com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/admin/users",
      body: {
        user_nome: userMock.user_nome,
        user_email: userMock.user_email,
        user_senha: userMock.user_senha,
        user_tipo: userMock.user_tipo
      },
    });
    const res = httpMocks.createResponse();

    await obj.create(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.strictEqual(data.ok, true, "Resposta deve conter ok: true");
    assert.strictEqual(data.message, "Usuário inserido com sucesso!", "Mensagem deve indicar sucesso no cadastro");
    assert.strictEqual(data.email, userMock.user_email, "Email retornado deve corresponder ao usuÃ¡rio enviado");

  });

  await it("getAllUsers(req, res) - Usuarios listados com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/admin/users",
    });
    const res = httpMocks.createResponse();

    await obj.getAllUsers(req, res);
    const data = res._getJSONData();

    assert.deepStrictEqual(data, usersMock, "Usuarios retornados devem corresponder aos usuarios mockados");

  });

  await it("getUserById(req, res) - Usuario encontrado com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/users/1",
      params: {
        id: "1"
      },
    });
    const res = httpMocks.createResponse();

    await obj.getUserById(req, res);
    const data = res._getJSONData();

    assert.deepStrictEqual(data, usersMock, "Usuario retornado deve corresponder ao id buscado");

  });

  await it("Update(req, res) - Usuario alterado com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/users/update/1",
      params: {
        id: "1"
      },
      body: {
        user_nome: userMock.user_nome,
        user_email: userMock.user_email,
        user_senha: userMock.user_senha,
        user_tipo: userMock.user_tipo
      },
    });
    const res = httpMocks.createResponse();

    await obj.Update(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.strictEqual(data.ok, true, "Resposta deve conter ok: true");
    assert.strictEqual(data.message, "Usuário alterado com sucesso!", "Mensagem deve indicar sucesso na alteracao");
    assert.strictEqual(data.email, userMock.user_email, "Email retornado deve corresponder ao usuario enviado");

  });

  await it("updatePassword(req, res) - Senha alterada com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      url: "/users/update_password/1",
      params: {
        id: "1"
      },
      body: {
        senha: userMock.user_senha,
        user_senha: userMock.user_senha,
        user_email: userMock.user_email
      },
    });
    const res = httpMocks.createResponse();

    await obj.updatePassword(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.strictEqual(data.ok, true, "Resposta deve conter ok: true");
    assert.strictEqual(data.message, "Senha alterada com sucesso!", "Mensagem deve indicar sucesso na alteracao da senha");
    assert.strictEqual(data.email, userMock.user_email, "Email retornado deve corresponder ao usuario enviado");

  });

  await it("verificaLogin(req, res) - Usuario liberado para registro com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/users/verificaLogin",
      body: verificaLoginMock,
    });
    const res = httpMocks.createResponse();

    await obj.verificaLogin(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.strictEqual(data.ok, true, "Resposta deve conter ok: true");
    assert.strictEqual(data.message, "Usuario, Email e CPF Unico, Registro liberado", "Mensagem deve indicar sucesso na verificacao");
    assert.strictEqual(data.field, verificaLoginMock.user_email, "Campo retornado deve corresponder ao email enviado");

  });

afterEach(() => { quibble.reset() });
