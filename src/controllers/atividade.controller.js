const prisma = require("../prisma/client");

module.exports.cadastrar = async (req, res) => {
    try {
        const {questoes} = req.body;
        for(const questao of questoes){
            if(questao.type === "multiplaEscolha"){
                const opcoes = [questao.opcao1, questao.opcao2, questao.opcao3, questao.opcao4];
                let opcaoCorreta = ""
                if(questao.opcaoCorreta === "a"){
                    opcaoCorreta = questao.opcao1;
                    opcoes.splice(0, 1);
                } else if(questao.opcaoCorreta === "b"){
                    opcaoCorreta = questao.opcao2;
                    opcoes.splice(1, 1);
                } else if(questao.opcaoCorreta === "c"){
                    opcaoCorreta = questao.opcao3;
                    opcoes.splice(2, 1);
                } else if(questao.opcaoCorreta === "d"){
                    opcaoCorreta = questao.opcao4;
                    opcoes.splice(3, 1);
                }
                await prisma.multiplaEscolha.create({
                data: {
                    nome: questao.nome,
                    descricao: questao.descricao,
                    rankId: questao.rankId,
                    opcao1: opcaoCorreta,
                    opcao2: opcoes[0],
                    opcao3: opcoes[1],
                    opcao4: opcoes[2],
                    pergunta: questao.pergunta,
                    gabarito: questao.gabarito,
                    nivel: questao.nivel,
                    ativo: true,
                    status: req.admin ? "Aprovado" : "Pendente",
                    usuarioId: req.userId,
                }
            })
            }
        }
        res.status(200).json(true)
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Erro interno ao cadastrar a atividade."})
    }
}
module.exports.listarRanks = async (req, res) => {
    try{
        const ranks = await prisma.rank.findMany();
        res.status(200).json(ranks);
    } catch(error){
        console.log(error);
        res.status(500).json({error: "Erro interno ao listar os ranks."})
    }
}