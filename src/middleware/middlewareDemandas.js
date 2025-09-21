import demandas from "../repositories/DemandasRepository.js"

const middlewareFiltroDemandas = { 
    preparaDemanda: async (req, res, next) =>{
        const { demanda_tag } = req.body

        let demandasFiltradas

        if(!demanda_tag){
            demandasFiltradas = await demandas.readAll()
        }else{
            demandasFiltradas = await demandas.readByTag(demanda_tag)
        }

        req.demandasFiltradas = demandasFiltradas
        next()
    }
}

export default middlewareFiltroDemandas