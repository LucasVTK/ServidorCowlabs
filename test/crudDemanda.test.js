import httpMocks from "node-mocks-http";
import { afterEach, assert, describe, it } from "poku";
import quibble from "quibble";

const demandasMock = [
    {
        id: 1,
        demanda_title: "Demanda teste 1"
    },
    {
        id: 2,
        demanda_title: "Demanda teste 2"
    }
]

const demandaByIdMock = {
    id: 1,
    demanda_title: "Teste de Demanda 1"
}

const demandasByTagMock = [
    {
        id: 1,
        demanda_tag: "frontend"
    }
]

const novaDemandaMock = {
        "data_curso": "2026-04-14",
        "user_demanda": "Rafael",
        "demanda_title": "Nova demanda",
        "demanda_content": "Conteudo da demanda",
        "demanda_tag": "frontend",
        "demanda_file": null,
        "demanda_create_data": "2026-04-16T03:26:26.783Z",
        "tb_user_user_id": null,
        "demandas_status": "aberta",
        "demandas_status_date": null
      }

await quibble.esm("../src/repositories/CrudDemandaRepository.js", {
  default: {
    async readAll(page, limit) {
      return {
        dados: demandasMock,
        total: 2
      };
    },
    async readById(id) {
      if (id === "1") {
        return demandaByIdMock;
      }
      return null;
    },
    async readByTag(demanda_tag) {
      if (demanda_tag === "frontend") {
        return demandasByTagMock;
      }
      return null;
    },
    async create(model) { return model },
    async update(id, model) { return { id, ...model } },
    async delete(id) { return { ok: true, id } },
  }
});

const obj = (await import("../src/controllers/CrudDemandaController.js")).default;

describe(" CrudDemandaController ", { background: 'blue' })

  await it("getAllDemandas(req, res) - Demandas listadas com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/demandas?page=1",
      query: {
        page: "1"
      },
    });
    const res = httpMocks.createResponse();

    await obj.getAllDemandas(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.deepStrictEqual(data.dados, demandasMock, "Dados retornados devem corresponder Ã s demandas mockadas");
    assert.strictEqual(data.paginacao.total, 2, "Total da paginaÃ§Ã£o deve ser 2");
    assert.strictEqual(data.paginacao.currentPage, 1, "PÃ¡gina atual deve ser 1");

  });

  await it("getDemandasById(req, res) - Demanda encontrada com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/demandas/id/1",
      params: {
        id: "1"
      },
    });
    const res = httpMocks.createResponse();

    await obj.getDemandasById(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.deepStrictEqual(data, demandaByIdMock, "Demanda retornada deve corresponder ao id buscado");

  });

  await it("getDemandasByTag(req, res) - Demanda encontrada com sucesso pela tag", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/demandas/tag/frontend",
      params: {
        demanda_tag: "frontend"
      },
    });
    const res = httpMocks.createResponse();

    await obj.getDemandasByTag(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.strictEqual(data.total, 1, "Total deve corresponder a quantidade de demandas encontradas");
    assert.deepStrictEqual(data.items, demandasByTagMock, "Itens retornados devem corresponder a tag buscada");

  });

  await it("creatDemandas(req, res) - Demanda criada com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/demandas/create",
      body: novaDemandaMock,
    });
    const res = httpMocks.createResponse();

    await obj.creatDemandas(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.strictEqual(data.data.demanda_title, novaDemandaMock.demanda_title)
    assert.strictEqual(data.data.demanda_content, novaDemandaMock.demanda_content)
    assert.strictEqual(data.data.demanda_tag, novaDemandaMock.demanda_tag)
  });

  await it("updateDemandas(req, res) - Demanda alterada com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/demandas/update/1",
      params: {
        id: "1"
      },
      body: novaDemandaMock,
    });
    const res = httpMocks.createResponse();

    await obj.updateDemanda(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.deepStrictEqual(data.data, {
      id: 1,
      demanda_title: "Nova demanda",
      demanda_content: "Conteudo da demanda"
    });
  });

  await it("deleteDemandas(req, res) - Demanda deletada com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      url: "/demandas/delete/1",
      params: {
        id: "1"
      },
    });
    const res = httpMocks.createResponse();

    await obj.deleteDemanda(req, res);
    const data = res._getJSONData();

    assert.strictEqual(res.statusCode, 200, "Status code deve ser 200");
    assert.deepStrictEqual(data, { "message": "Demanda excluída com sucesso." }, "Retorno deve corresponder a exclusao da demanda");

  });

afterEach(() => { quibble.reset() });
