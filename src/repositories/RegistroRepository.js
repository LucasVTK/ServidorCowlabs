import Registros from '../database/Registros.json' with { type: 'json' };


const users = [...Registros] //funciona como um local storage

// const makeMatricula = () => {
//     const year = new Date().getYear();
//     const semestre = new Date().getMonth() < 6 ? '10' : '20';

//     if (users.length === 0) {
//     return `${year}${semestre}1`; // primeiro do semestre
// }

//     const ultima = users[users.length - 1].matricula;
//     const seq = Number(String(ultima).slice(6)) + 1; // pega a parte final e soma 1
//     return `${year}${semestre}${seq}`
// };

const UsersRepo = {
    async readAll() {
    return users  //antes o readAll retornava Registros, onde era estatico, agora ele retorna o array users que é dinamico.
    },

    async readByEmail(email) {
    const pesquisaEmail = users.find(u => u.email === email)
    return pesquisaEmail;
    },

    create({ nome, matricula, email, senha, curso }){
        
        const novo = { 
            nome,
            matricula,
            email, 
            senha, 
            curso, 
            tipo: 'Aluno' 
        };
        
        users.push(novo);
        
        return novo;
    }
}

export default UsersRepo;
