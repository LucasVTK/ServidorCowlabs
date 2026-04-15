import { describe, it, assert } from "poku";

describe("Teste das rotas do sistema",{background:'yellow',icon:'🤣'})

await it('/',async ()=>{
    const url = 'http://localhost:3000/'
    const resp = await fetch(url)
    const dados = await resp.json()
    assert.strictEqual(resp.status,200,"Status 200 ok")
    assert.strictEqual(dados.ok,true,"Sistema respondendo com sucesso")
})

await it('/demandas?page=1',async ()=>{
    const url = 'http://localhost:3000/demandas?page=1'
    const resp = await fetch(url)
    const dados = await resp.json()
    assert.strictEqual(resp.status,200,"Status 200 ok")
    assert.strictEqual(Array.isArray(dados.dados),true,"Demandas trazidas com sucesso")
})

await it('/admin/users',async ()=>{
    const url = 'http://localhost:3000/admin/users'
    const resp = await fetch(url)
    const dados = await resp.json()
    assert.strictEqual(resp.status,200,"Status 200 ok")
    assert.strictEqual(Array.isArray(dados),true,"Usuarios trazidos com sucesso")
})

await it('/login',async ()=>{
    const url = 'http://localhost:3000/login'
    const resp = await fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({})
    })
    const dados = await resp.json()
    assert.strictEqual(resp.status,400,"Status 400 ok")
    assert.strictEqual(dados.ok,false,"Login sem corpo falhou como esperado")
})