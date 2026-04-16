# Relatorio de performance com Autocannon

Data do teste: 2026-04-15

## Escopo

Foram executados dois cenarios:

1. Endpoint principal: `GET /demandas?page=1`
2. Baseline de comparacao: `GET /`

Configuracao de carga usada nos dois testes:

- `autocannon -c 1000 -d 10`
- Servidor local em `http://localhost:3000`
- Pipelining: `1`

Observacao operacional:

- O script `npm run test:stress` conseguiu subir a API e rodar o benchmark, mas falhou ao encerrar o processo no Windows por um erro `spawn EPERM` do `start-server-and-test`.
- Para consolidar os numeros de forma estavel, a coleta final foi feita com `autocannon -j` diretamente contra a API ja em execucao.

## Resumo executivo

O endpoint `GET /demandas?page=1` saturou com `1000` conexoes concorrentes. A media de latencia ficou em `8241.76 ms`, o `p99` chegou a `9966 ms` e houve `280` timeouts explicitos durante a janela do teste. No mesmo perfil de carga, a rota `/` respondeu `26062` requisicoes `200 OK` sem erros, com latencia media de `379.26 ms`.

Em outras palavras: o servidor Express em si responde bem melhor do que a rota de listagem de demandas. O gargalo esta concentrado no caminho que consulta o banco, faz agregacao e pagina os dados.

## Resultado do endpoint /demandas?page=1

Janela do teste:

- Inicio: `2026-04-15T14:28:32.277Z`
- Fim: `2026-04-15T14:28:42.700Z`
- Duracao observada: `10.42 s`

Metricas principais:

| Metrica | Valor |
| --- | --- |
| Conexoes | `1000` |
| Requisicoes concluidas | `720` |
| Respostas `200 OK` | `720` |
| Erros | `280` |
| Timeouts | `280` |
| Requisicoes enviadas | `2000` |
| Req/s medio | `72.0` |
| Req/s maximo | `200` |
| Throughput medio | `238013.7 B/s` |
| Throughput total | `2379600 B` |

Latencia:

| Percentil | Valor |
| --- | --- |
| Min | `5697 ms` |
| p50 | `8274 ms` |
| p90 | `9668 ms` |
| p97.5 | `9908 ms` |
| p99 | `9966 ms` |
| Max | `10007 ms` |
| Media | `8241.76 ms` |

Leitura tecnica:

- A rota ficou claramente saturada no nivel de carga testado.
- O tempo de resposta ficou praticamente colado no teto de `10 s`, o que indica fila acumulada e pouca folga operacional.
- Como o `autocannon` registrou `2000` requisicoes enviadas, mas apenas `720` concluidas e `280` timeouts explicitos, parte das requisicoes ainda estava em voo quando a janela foi encerrada. Isso reforca o sinal de saturacao.

## Baseline do endpoint /

Janela do teste:

- Inicio: `2026-04-15T14:29:09.920Z`
- Fim: `2026-04-15T14:29:20.154Z`
- Duracao observada: `10.23 s`

Metricas principais:

| Metrica | Valor |
| --- | --- |
| Conexoes | `1000` |
| Requisicoes concluidas | `26062` |
| Respostas `200 OK` | `26062` |
| Erros | `0` |
| Timeouts | `0` |
| Requisicoes enviadas | `27062` |
| Req/s medio | `2606.6` |
| Req/s maximo | `3258` |
| Throughput medio | `1081590.3 B/s` |
| Throughput total | `10815730 B` |

Latencia:

| Percentil | Valor |
| --- | --- |
| Min | `1 ms` |
| p50 | `365 ms` |
| p90 | `593 ms` |
| p97.5 | `1199 ms` |
| p99 | `1418 ms` |
| Max | `1654 ms` |
| Media | `379.26 ms` |

## Comparacao direta

| Indicador | `/demandas?page=1` | `/` | Diferenca |
| --- | --- | --- | --- |
| Req/s medio | `72.0` | `2606.6` | baseline ~`36x` maior |
| Latencia media | `8241.76 ms` | `379.26 ms` | `/demandas` ~`21.7x` mais lenta |
| p99 | `9966 ms` | `1418 ms` | `/demandas` ~`7x` pior |
| Timeouts | `280` | `0` | erro apenas na rota com banco |

Interpretacao:

- A aplicacao consegue responder bem quando a rota nao depende da consulta pesada.
- O principal gargalo esta na leitura paginada de demandas, nao no bootstrap do Express.
- O comportamento e compativel com saturacao no banco, na query ou no pool de conexoes.

## Hipoteses mais provaveis para o gargalo

Com base no comportamento observado, os pontos mais provaveis sao:

1. Consulta SQL custosa para alta concorrencia, com `JOIN`, `STRING_AGG`, `GROUP BY`, `ORDER BY` e `OFFSET/FETCH`.
2. Trabalho duplicado por requisicao, porque a rota de listagem executa a consulta paginada e depois uma segunda consulta de `COUNT(*)`.
3. Dependencia de banco remoto, o que adiciona latencia de rede e piora o efeito de fila sob `1000` conexoes concorrentes.
4. Limite de pool/conexoes do banco ou da camada Node em situacao de stress.

## Conclusao

No cenario testado, a API nao sustentou `1000` conexoes concorrentes na rota `GET /demandas?page=1` com margem segura. O endpoint permaneceu funcional, mas com latencia muito alta e timeouts suficientes para caracterizar saturacao. A rota `/` mostrou que a aplicacao tem capacidade muito maior quando nao precisa executar a consulta ao banco.