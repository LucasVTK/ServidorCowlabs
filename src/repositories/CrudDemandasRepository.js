import Demandas from '../database/Demandas.json' with {type: 'json'};
import fs from 'fs';

const DemandasRepository = {
  async readAll(){
    return Demandas // retorna todas as demandas
  },
  async readById(demanda_id){
    const BuscarId = Demandas.find(d => d.demanda_id === parseInt(demanda_id)) // transforma o 'demanda_id' em inteiro e busca a demanda pelo id

    return BuscarId; // Retorna a demanda encontrada
  },
  async readByTag(demanda_tag){
    const padronizarTag = demanda_tag.toLowerCase()// padroniza a tag para minúsculo deixando a busca mais funcional
    const BususcarTag = Demandas.filter(d => d.demanda_tag.toLocaleLowerCase().includes(padronizarTag)) // busca a demanda pela tag
    return BususcarTag; // retorna a demanda encrontrada
  },
  async create({data_curso, user_demanda, demanda_title, demanda_content, demanda_tag,file_location}){

    const novaDemanda = {
      demanda_id: Demandas.length + 1,
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location
    } //Cria uma nova demanda 

    Demandas.push(novaDemanda) // Adiciona a nova demanda no final do array 

    fs.writeFileSync('./src/database/Demandas.json', JSON.stringify(Demandas),'utf-8') //Atualiza o arquivo JSON com a nova demanda 

    return {
      message: 'Demanda criada com sucesso!',
      data: Demandas,
    } //Retorna uma mensagem de sucesso e os dados atualizados
  },
  async update(demanda_id, {data_curso, user_demanda,demanda_content, demanda_title, demanda_tag,file_location}){

    const demandaIndex = Demandas.findIndex(d => d.demanda_id === parseInt(demanda_id)) // transforma o 'demanda_id' em inteiro e busca a demanda pelo id

    if(demandaIndex === -1){
      return {message: 'Demanda não encontrada!'}
    } // se a demanda não for encontrada, retorna um err

    const demandaAtualizada = {
      demanda_id: parseInt(demanda_id),
      data_curso,
      user_demanda,
      demanda_content,
      demanda_title,
      demanda_tag,
      file_location,
    } // Objetos com os dados que sarão atualizados

    Demandas[demandaIndex] = demandaAtualizada // coloca a demanda dentro do array no id encontrado 

    fs.writeFileSync('./src/database/Demandas.json', JSON.stringify(Demandas), 'utf-8') ; // att o arquivo JSON na database

    return {
      message: 'Demanda atualizada com sucesso!',
      data: demandaAtualizada,
    } // retorna uma mensagem de sucesso e os dados atualizados

  },
  async delete(demanda_id){
    const DemandaIndex = Demandas.findIndex(d => d.demanda_id === parseInt(demanda_id)) //encontra o id da demanda 

    if(DemandaIndex === -1){
      return {message: 'Demanda não encontrada!'}
    } // se a demanda não for encontrada, retorna um erro

    Demandas.splice(DemandaIndex, 1) // remove a demanda do array

    fs.writeFileSync('./src/database/Demandas.json', JSON.stringify(Demandas), 'utf-8') // att o arquivo JSON na database

    return {
      message: 'Demanda deletada com sucesso!',
      data: Demandas,
    } // retorna uma mensagem de sucesso e os dados atualizados
  }
}

export default DemandasRepository;