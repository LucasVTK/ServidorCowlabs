import demandas from '../database/Demandas.json' with { type: 'json' };

const Demandas = {

    async readAll(){
    return demandas
    },

    async readByTag(demanda_tag){
        const filterByTag = demandas.filter(d => d.demanda_tag === demanda_tag)
        return filterByTag  // troquei o clicaTag por uma questão de boa prática.Assim o código reflete 
                            // o que ele faz aqui no back-end. O click é no front e não se relaciona
                            // diretamente com o que está sendo feito aqui. O front vai chamar uma rota
                            // que definiremos aqui, e é essa rota que retornará o resultado filtrado.
    },


    //a demanda deve conter: titulo descricao, tag, nome do outor e apenas
    // async create({ demanda_titulo, demanda_descricao, demanda_tag, demanda_autor }) {
    //     const novademanda = {
    //         demanda_titulo,
    //         demanda_descricao,
    //         demanda_tag,
    //         demanda_autor
                                // a estrutura do objeto está diferente da estrutura do JSON. 
                                // isso fará com que você inclua um objeto com campos diferentes
                                // o que prejudicará a manipulação posterior. Se estivessemos em
                                // um banco de dados, cada campo do objeto corresponderia a uma 
                                // coluna na tabela. Por isso é preciso que os valores dos dois 
                                // objetos (o que estamos criando, e o que está no banco) sejam 
                                // correspondentes. Caso contrário teremos problemas com a base
                                // de dados.

    //     }
    //     demanda_autor.push(novademanda //também há um erro aqui. "demanda_autor" é um parâmetro que você passou com a função.
                                            // ela até vai receber o objeto novademanda, porém me parece que queremos
                                            // inserir esse ojeto novademanda no JSON. Então teremos que usar o método que 
                                            // que aprendemos na aula dessa semana.
    //     return novademanda
    // },

    // abaixo, inseri a funçao create ajustada para corresponder ao que temos no JSON. Falta incluirmos os IDs. 
    // A criação de ID para cada demanda e também para cada usuário será importante. 
    // Essas IDs serão os atributos determinantes.
    async create({ data_curso, user_demanda, demanda_title, demanda_content, demanda_tag, file_location }) {
        const novademanda = {
            data_curso, 
            user_demanda,
            demanda_title,
            demanda_content, 
            demanda_tag, 
            file_location
        }

        demandas.push(novademanda)
        
        return novademanda

    }
}

export default Demandas

