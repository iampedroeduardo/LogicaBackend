
-- probabilidade
INSERT INTO "MultiplaEscolha" (
    "nome",
    "descricao",
    "gabarito",
    "pergunta",
    "ativo",
    "status",
    "opcao1",
    "opcao2",
    "opcao3",
    "opcao4",
    "nivel",
    "categoria",
    "rankId",
    "usuarioId"
) VALUES 
(
    'Lançamento de Moedas', -- nome
    'Imagine que você possui uma moeda comum e honesta. Você decide lançá-la para o alto duas vezes consecutivas e observa os resultados.', -- descricao
    'A resposta é 1/4. A chance da primeira ser cara é 1/2 e da segunda também é 1/2. Multiplicando eventos independentes: 1/2 * 1/2 = 1/4.', -- gabarito
    'Qual a chance de sair duas caras?', -- pergunta (Curta, dentro do limite)
    true, -- ativo
    'Aprovado', -- status
    '1/2', -- opcao1
    '1/3', -- opcao2
    '1/4', -- opcao3
    '3/4', -- opcao4
    1, -- nivel
    'probabilidade', -- categoria
    1, -- rankId
    1 -- usuarioId
),
(
    'Festa de aniversário', -- nome
    'Um aniversariante está participando de um desafio onde os convidados escondem seu presente entre 4 caixas vazias. O aniversariante quer achar seu presente na primeira tentativa.', -- descricao
    'A resposta correta é 1/5 pois temos uma chance entre as 5 possíveis (1 presente + 4 caixas vazias).', -- gabarito
    'Qual a probabilidade disso ocorrer?', -- pergunta
    true, -- ativo
    'Aprovado', -- status (Atenção: deve corresponder a um valor do seu ENUM "Status")
    '1/5', -- opcao1
    '1/4', -- opcao2
    '1/2', -- opcao3
    '3/7', -- opcao4
    1, -- nivel
    'probabilidade', -- categoria (Atenção: deve corresponder a um valor do seu ENUM "Categoria")
    1, -- rankId (pode ser null)
    1 -- usuarioId (deve ser um ID existente na tabela de usuários)
),
(
    'Dado de 6 faces', -- nome
    'Em um jogo de tabuleiro, o jogador lança um dado padrão de 6 faces numeradas de 1 a 6. Ele ganha um bônus se o número sorteado for par.', -- descricao
    'A resposta é 1/2. Existem 3 números pares (2, 4, 6) em um total de 6 possibilidades. Logo, 3/6 simplificado é igual a 1/2.', -- gabarito
    'Qual a chance de sair número par?', -- pergunta (Curta, dentro do limite)
    true, -- ativo
    'Aprovado', -- status
    '1/6', -- opcao1
    '1/3', -- opcao2
    '1/2', -- opcao3
    '2/3', -- opcao4
    1, -- nivel
    'probabilidade', -- categoria
    1, -- rankId
    1 -- usuarioId
);
-- analise combinatoria
INSERT INTO "MultiplaEscolha" (
    "nome",
    "descricao",
    "gabarito",
    "pergunta",
    "ativo",
    "status",
    "opcao1",
    "opcao2",
    "opcao3",
    "opcao4",
    "nivel",
    "categoria",
    "rankId",
    "usuarioId"
) VALUES 
-- NÍVEL 1: Princípio Fundamental da Contagem (Simples)
(
    'Roupas e Cores', -- nome
    'Maria tem 3 camisetas de cores diferentes e 2 calças de estilos diferentes. Ela quer saber de quantas maneiras distintas pode se vestir usando uma peça de cada.', -- descricao
    'A resposta é 6. Pelo Princípio Fundamental da Contagem, basta multiplicar as opções: 3 camisetas x 2 calças = 6 combinações.', -- gabarito
    'Quantos looks ela pode montar?', -- pergunta (30 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '5', -- opcao1
    '6', -- opcao2
    '8', -- opcao3
    '9', -- opcao4
    1, -- nivel
    'analiseCombinatoria', -- categoria
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 2: Combinação Simples (A ordem não importa)
(
    'Duplas de Tênis', -- nome
    'Um treinador tem 5 jogadores disponíveis e precisa escolher 2 para formar uma dupla de tênis. A ordem dos escolhidos não altera a dupla formada.', -- descricao
    'A resposta é 10. Trata-se de uma Combinação de 5 elementos tomados 2 a 2. C(5,2) = 5! / (2! * 3!) = (5*4)/2 = 10.', -- gabarito
    'Quantas duplas podemos formar?', -- pergunta (30 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '10', -- opcao1
    '20', -- opcao2
    '15', -- opcao3
    '25', -- opcao4
    2, -- nivel
    'analiseCombinatoria', -- categoria
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 3: Permutação com Repetição (Mais complexo)
(
    'Anagramas da Banana', -- nome
    'Queremos formar anagramas (trocar a ordem das letras) da palavra BANANA. Note que existem letras repetidas (três A e dois N).', -- descricao
    'A resposta é 60. Permutação de 6 letras com repetição de 3 e 2. P = 6! / (3! * 2!) = 720 / (6 * 2) = 60.', -- gabarito
    'Quantos anagramas são possíveis?', -- pergunta (32 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '60', -- opcao1
    '120', -- opcao2
    '720', -- opcao3
    '360', -- opcao4
    3, -- nivel
    'analiseCombinatoria', -- categoria
    1, -- rankId
    1 -- usuarioId
);
-- padroes numericos
INSERT INTO "MultiplaEscolha" (
    "nome",
    "descricao",
    "gabarito",
    "pergunta",
    "ativo",
    "status",
    "opcao1",
    "opcao2",
    "opcao3",
    "opcao4",
    "nivel",
    "categoria",
    "rankId",
    "usuarioId"
) VALUES 
-- NÍVEL 1: Progressão Aritmética Simples (Somar constante)
(
    'Sequência de Pares', -- nome
    'Observe a sequência numérica simples: 2, 4, 6, 8... O padrão é adicionar 2 ao número anterior.', -- descricao
    'A resposta é 10. Seguindo o padrão de somar 2: 8 + 2 = 10.', -- gabarito
    'Qual o próximo número da fila?', -- pergunta (30 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '9', -- opcao1
    '10', -- opcao2
    '11', -- opcao3
    '12', -- opcao4
    1, -- nivel
    'padroesNumericos', -- categoria (Ajuste conforme seu ENUM, ex: 'matematica')
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 2: Progressão Geométrica (Multiplicação)
(
    'Triplicando Valores', -- nome
    'Dada a sequência: 1, 3, 9, 27... Cada número é o resultado do anterior multiplicado por 3.', -- descricao
    'A resposta é 81. O padrão é multiplicar por 3. Logo, 27 * 3 = 81.', -- gabarito
    'Qual o valor após o 27?', -- pergunta (25 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '30', -- opcao1
    '54', -- opcao2
    '81', -- opcao3
    '90', -- opcao4
    2, -- nivel
    'padroesNumericos', -- categoria
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 3: Padrão Misto ou Fibonacci (Soma dos anteriores)
(
    'Soma dos Anteriores', -- nome
    'Analise a série: 1, 1, 2, 3, 5, 8... Onde cada número é a soma exata dos dois números que vieram antes dele.', -- descricao
    'A resposta é 13. O padrão é a sequência de Fibonacci (5 + 8 = 13).', -- gabarito
    'Qual número completa a série?', -- pergunta (29 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '11', -- opcao1
    '12', -- opcao2
    '13', -- opcao3
    '15', -- opcao4
    3, -- nivel
    'padroesNumericos', -- categoria
    1, -- rankId
    1 -- usuarioId
);
INSERT INTO "MultiplaEscolha" (
    "nome",
    "descricao",
    "gabarito",
    "pergunta",
    "ativo",
    "status",
    "opcao1",
    "opcao2",
    "opcao3",
    "opcao4",
    "nivel",
    "categoria",
    "rankId",
    "usuarioId"
) VALUES 
-- NÍVEL 1: Sequência Alfabética Simples (Pula 1 letra)
(
    'Pulo do Alfabeto', -- nome
    'Dada a sequência de letras: A, C, E, G. A lógica é pular uma letra do alfabeto a cada passo (A, [b], C, [d], E...).', -- descricao
    'A resposta é I. Depois do G, pulamos o H e a próxima letra é o I.', -- gabarito
    'Sequência: A, C, E, G. Qual a próxima?', -- pergunta (38 caracteres)
    true, -- ativo
    'Aprovado', -- status
    'H', -- opcao1
    'I', -- opcao2
    'J', -- opcao3
    'K', -- opcao4
    1, -- nivel
    'sequenciasLogicas', -- categoria
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 2: Quadrados Perfeitos (Exponenciação)
(
    'Quadrados Perfeitos', -- nome
    'Observe os números: 1, 4, 9, 16. Eles representam a sequência de números inteiros elevados ao quadrado (1², 2², 3², 4²).', -- descricao
    'A resposta é 25. O próximo número inteiro é 5, e 5² (5 vezes 5) é igual a 25.', -- gabarito
    'Série: 1, 4, 9, 16. Qual o próximo?', -- pergunta (35 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '20', -- opcao1
    '24', -- opcao2
    '25', -- opcao3
    '36', -- opcao4
    2, -- nivel
    'sequenciasLogicas', -- categoria
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 3: Padrão Alternado (Subtrai e Soma)
(
    'Sobe e Desce', -- nome
    'Na sequência 50, 40, 45, 35, 40, existe um padrão duplo: primeiro subtrai-se 10, depois soma-se 5, e assim por diante.', -- descricao
    'A resposta é 30. O último movimento foi somar 5 (35 -> 40). O próximo deve ser subtrair 10. Logo, 40 - 10 = 30.', -- gabarito
    '50, 40, 45, 35, 40. Qual vem depois?', -- pergunta (36 caracteres)
    true, -- ativo
    'Aprovado', -- status
    '30', -- opcao1
    '45', -- opcao2
    '50', -- opcao3
    '25', -- opcao4
    3, -- nivel
    'sequenciasLogicas', -- categoria
    1, -- rankId
    1 -- usuarioId
);
-- argumentos validos
INSERT INTO "MultiplaEscolha" (
    "nome",
    "descricao",
    "gabarito",
    "pergunta",
    "ativo",
    "status",
    "opcao1",
    "opcao2",
    "opcao3",
    "opcao4",
    "nivel",
    "categoria",
    "rankId",
    "usuarioId"
) VALUES 
-- NÍVEL 1: Modus Ponens (Afirmação do Antecedente) - O mais direto.
(
    'Silogismo Simples', -- nome
    'Premissa 1: Todo homem é mortal. Premissa 2: Sócrates é homem. Lógica clássica de dedução direta.', -- descricao
    'A resposta é Sócrates é mortal. Se A implica B, e A é verdade, então B é verdade.', -- gabarito
    'Todo homem é mortal. Sócrates é homem. Logo...', -- pergunta (44 caracteres)
    true, -- ativo
    'Aprovado', -- status
    'Sócrates é imortal', -- opcao1
    'Sócrates é mortal', -- opcao2
    'Sócrates é um deus', -- opcao3
    'Nada se conclui', -- opcao4
    1, -- nivel
    'argumentosValidos', -- categoria
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 2: Modus Tollens (Negação do Consequente) - Requer atenção à negação.
(
    'Negação Lógica', -- nome
    'Premissa: Se chover, a rua molha. Fato observado: A rua NÃO está molhada. Conclusão lógica sobre a chuva.', -- descricao
    'A resposta é Não choveu. Se a consequência (rua molhada) não aconteceu, a causa (chuva) não pode ter ocorrido.', -- gabarito
    'Se chove, molha. Não molhou. Conclusão?', -- pergunta (38 caracteres)
    true, -- ativo
    'Aprovado', -- status
    'Choveu muito', -- opcao1
    'Pode ter chovido', -- opcao2
    'Não choveu', -- opcao3
    'A rua secou', -- opcao4
    2, -- nivel
    'argumentosValidos', -- categoria
    1, -- rankId
    1 -- usuarioId
),

-- NÍVEL 3: Silogismo Disjuntivo (Exclusão) - Análise de alternativas.
(
    'Dilema do Detetive', -- nome
    'O culpado é o mordomo ou o cozinheiro. Ficou provado que o cozinheiro é inocente (não foi ele).', -- descricao
    'A resposta é Foi o mordomo. Se temos apenas duas opções (A ou B) e B é falsa, A deve ser obrigatoriamente verdadeira.', -- gabarito
    'Foi o mordomo ou cozinheiro. Não foi o cozinheiro...', -- pergunta (51 caracteres)
    true, -- ativo
    'Aprovado', -- status
    'Foi o mordomo', -- opcao1
    'Ninguém foi', -- opcao2
    'Foram os dois', -- opcao3
    'Falta dados', -- opcao4
    3, -- nivel
    'argumentosValidos', -- categoria
    1, -- rankId
    1 -- usuarioId
);
INSERT INTO "MultiplaEscolha" (
    "nome",
    "descricao",
    "gabarito",
    "pergunta",
    "ativo",
    "status",
    "opcao1",
    "opcao2",
    "opcao3",
    "opcao4",
    "nivel",
    "categoria",
    "rankId",
    "usuarioId"
) VALUES 
-- 1. PROPOSIÇÕES
(
    'Definição de Proposição', 
    'Uma proposição lógica deve ser uma sentença declarativa que pode ser classificada como Verdadeira ou Falsa. Perguntas e ordens não são proposições.', 
    'A resposta é "O céu é azul". As outras opções são perguntas, ordens ou frases sem sentido completo (sentenças abertas).', 
    'Qual das frases abaixo é uma proposição?', -- 39 caracteres
    true, 'Aprovado', 
    'Que horas são?', -- Opção 1 (Interrogativa)
    'Faça a prova!', -- Opção 2 (Imperativa)
    'O céu é azul', -- Opção 3 (Declarativa - Correta)
    'x + 2 = 5', -- Opção 4 (Sentença aberta)
    1, 'proposicoes', 1, 1
),

-- 2. CONECTIVOS LÓGICOS
(
    'Conjunção "E"', 
    'O conectivo "E" (conjunção, símbolo ^) exige que todas as partes sejam verdadeiras para que o resultado final seja verdadeiro.', 
    'A resposta é "Ambas verdadeiras". Se uma for falsa, o "E" torna-se falso.', 
    'Quando a conjunção "P e Q" é verdadeira?', -- 39 caracteres
    true, 'Aprovado', 
    'Quando P é falso', 
    'Quando Q é falso', 
    'Nunca', 
    'Quando ambas são verdadeiras', 
    1, 'conectivosLogicos', 1, 1
),

-- 3. TABELAS VERDADE
(
    'Número de Linhas', 
    'O número de linhas de uma tabela verdade é calculado pela fórmula 2 elevado a N, onde N é o número de proposições simples.', 
    'A resposta é 8 lines. Sendo 3 proposições (P, Q, R), calculamos 2³ = 2 * 2 * 2 = 8.', 
    'Quantas linhas tem a tabela com 3 proposições?', -- 46 caracteres
    true, 'Aprovado', 
    '4 linhas', 
    '6 linhas', 
    '8 linhas', 
    '9 linhas', 
    2, 'tabelasVerdade', 1, 1
),

-- 4. EQUIVALÊNCIA LÓGICA
(
    'Contrapositiva', 
    'A equivalência lógica mais comum da condicional "Se P, então Q" é a contrapositiva: "Se não Q, então não P".', 
    'A resposta é "Se não canso, não corro". Inverte-se a ordem e nega-se ambas as partes.', 
    'Qual a contrapositiva de: Se corro, canso?', -- 41 caracteres
    true, 'Aprovado', 
    'Se canso, corro', 
    'Se não corro, não canso', 
    'Se não canso, não corro', 
    'Corro e não canso', 
    3, 'equivalenciasLogicas', 1, 1
),

-- 5. DIAGRAMA DE VENN
(
    'Interseção de Conjuntos', 
    'A interseção (U invertido) no Diagrama de Venn representa a região comum aos dois conjuntos. Elementos que estão em A E em B ao mesmo tempo.', 
    'A resposta é {2}. O número 2 é o único elemento presente tanto no conjunto A quanto no conjunto B.', 
    'Conjunto A={1,2} e B={2,3}. Qual a interseção?', -- 46 caracteres
    true, 'Aprovado', 
    '{1, 2, 3}', 
    '{2}', 
    '{1, 3}', 
    'Conjunto Vazio', 
    1, 'diagramasVenn', 1, 1
);