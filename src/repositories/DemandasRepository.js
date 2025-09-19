import demandas from '../database/Demandas.json' with { type: 'json' };

const Demandas = {

    async readAll(){
    return demandas
},

    async readByTag(demanda_tag){
        const ClicaTag = demandas.filter(d => d.demanda_tag === demanda_tag)
        return ClicaTag
    },


    //a demanda deve conter: titulo descricao tag nome do outor e apenas
    async create({ demanda_titulo, demanda_descricao, demanda_tag, demanda_autor }) {
        const novademanda = {
            demanda_titulo,
            demanda_descricao,
            demanda_tag,
            demanda_autor
        }
        demanda_autor.push(novademanda)
        return novademanda
    }
}

export default Demandas

