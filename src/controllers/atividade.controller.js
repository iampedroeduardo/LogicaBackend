const prisma = require("../prisma/client");

// module.exports.cadastrar = async (req, res) => {
//     try {
//         const {questoes} = req.body;
//         for(const questao of questoes){
//             if(questao.type === "multiplaEscolha"){
//                 await prisma.multiplaEscolha.create({
//                 data: {
//                     nome: questao.nome,
//                     descricao: questao.descricao,
//                     tipo: 

//                 }
//             })
//             }
            
//         }
//     }
// }
module.exports.listarRanks = async (req, res) => {
    try{
        const ranks = await prisma.rank.findMany();
        res.status(200).json(ranks);
    } catch(error){
        console.log(error);
        res.status(500).json({error: "Erro interno ao listar os ranks."})
    }
}