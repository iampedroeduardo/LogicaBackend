# Lógica++ · Back-end

API REST do **Lógica++**, um app gamificado para praticar lógica de programação e raciocínio lógico. Desenvolvido como Trabalho de Conclusão do curso Técnico em Informática para Internet do IFRS Campus Rio Grande (2025).

A API cuida de autenticação, cadastro e aprovação de questões, montagem das trilhas de exercícios e de toda a gamificação: XP, níveis, ranks, ranking entre usuários, ofensiva de dias seguidos e recompensas de avatar.

> Front-end (app e plataforma web): [LogicaFrontend](https://github.com/iampedroeduardo/LogicaFrontend)

## Tecnologias

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

- **Node.js + Express 5**, com rotas, controllers e middleware separados
- **PostgreSQL + Prisma ORM**, com schema e migrations versionados e SQL puro onde faz sentido (window functions no ranking)
- **JWT + bcrypt** para autenticação e senhas criptografadas
- **Nodemailer** para validação de e-mail e recuperação de senha por código
- **Multer** para upload de imagens nas questões

## Destaques técnicos

**Sorteio ponderado de questões.** Ao iniciar uma trilha, a API busca as questões aprovadas que o usuário ainda não respondeu, do rank atual e dos anteriores, filtradas pela categoria escolhida. O rank da questão é sorteado com peso que dobra a cada nível: o rank atual tem a maior chance, e os anteriores aparecem cada vez menos. Assim, o usuário revisa conteúdo antigo sem que ele domine a trilha.

**A mesma questão nunca aparece igual.** As alternativas de múltipla escolha são embaralhadas. Nas questões de código, a API sorteia quais erros ou lacunas cadastrados vão aparecer e quais distratores serão oferecidos.

**Ranking com window function.** O ranking usa `ROW_NUMBER() OVER (...)` para posicionar cada usuário por rank, nível e XP e devolve só uma janela ao redor do usuário logado, sem carregar a tabela inteira.

**Gamificação no back-end.** O XP ganho ou perdido depende do nível da questão e da distância entre o rank da questão e o do usuário. Ao acumular XP, o usuário sobe de nível e de rank e desbloqueia cores e acessórios para o avatar. A ofensiva conta os dias seguidos de prática e guarda o recorde.

**Fluxo de moderação.** Qualquer usuário pode enviar questões, que passam pelos status `Rascunho → Pendente → Aprovado/Negado`. Só administradores aprovam, e só questões aprovadas entram nas trilhas.

## Modelo de dados

Principais entidades (veja o schema completo em [`prisma/schema.prisma`](prisma/schema.prisma)):

| Entidade | Papel |
|---|---|
| `Usuario` | Perfil, credenciais, rank, nível, XP, ofensiva e avatar |
| `Rank` | Etapas da trilha, cada uma ligada a um conteúdo (variáveis, condicionais, laços…) |
| `MultiplaEscolha` | Questões de múltipla escolha, com imagem opcional e gabarito comentado |
| `Algoritmo` | Questões de código ("Complete o código" e "Encontre o erro") |
| `ErroLacuna` / `Distrator` | Trechos do código marcados como erro ou lacuna e as opções erradas de cada um |
| `Historico*` | Respostas de cada usuário, usadas para não repetir questões e calcular a ofensiva |

## Endpoints

Todas as rotas ficam sob `/api`. As marcadas com 🔒 exigem `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/cadastro` | Cria a conta e envia o e-mail de validação |
| GET | `/validate-email/:token` | Confirma o e-mail |
| POST | `/entrar` | Login, retorna o JWT |
| PUT | `/editar` | Edita o perfil |
| GET 🔒 | `/atualizar-dados` | Dados atualizados do usuário logado |
| GET 🔒 | `/ranking/:cursor/:acima/:abaixo` | Janela do ranking ao redor de um usuário |
| GET 🔒 | `/ofensiva` | Ofensiva atual e recorde |
| POST | `/email-recuperar-senha` | Envia o código de recuperação |
| POST | `/verificar-codigo` | Valida o código de recuperação |
| POST | `/recuperacao-nova-senha` | Define a nova senha |
| POST | `/alterar-senha` | Altera a senha informando a atual |
| POST 🔒 | `/atividades/cadastro` | Cadastra ou edita uma questão (com upload de imagens) |
| GET 🔒 | `/atividades/listar` | Lista as questões do usuário ou as pendentes de aprovação |
| GET 🔒 | `/atividades/algoritmo/:id` | Detalhes de uma questão de código |
| GET 🔒 | `/atividades/multiplaEscolha/:id` | Detalhes de uma questão de múltipla escolha |
| GET 🔒 | `/atividades/ranks` | Lista os ranks |
| GET 🔒 | `/atividades/categorias-raciocinio` | Categorias de raciocínio lógico |
| POST 🔒 | `/atividades/trilha` | Registra a resposta, atualiza XP e ofensiva e sorteia a próxima questão |

## Como rodar

**Pré-requisitos:** Node.js 18+ e PostgreSQL.

```bash
git clone https://github.com/iampedroeduardo/LogicaBackend.git
cd LogicaBackend
npm install
```

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/logica?schema=public"
JWT_SECRET="sua_chave_secreta"
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="senha_de_app_do_email"
SERVER_URL="http://localhost:3000"
```

Crie as tabelas e carregue os dados iniciais:

```bash
npx prisma migrate deploy
psql "$DATABASE_URL" -f src/sql/rank.sql
psql "$DATABASE_URL" -f src/sql/atividades.sql   # questões de exemplo (requer um usuário com id 1)
```

Inicie a API em `http://localhost:3000`:

```bash
node src/index.js
```

**Acesso fora da rede local:** para testar o app no celular, exponha a API com `cloudflared tunnel --url http://localhost:3000/` e use a URL gerada em `SERVER_URL` e no `app.json` do front-end.

## Autores

- **Pedro Eduardo dos Santos** · [@iampedroeduardo](https://github.com/iampedroeduardo)
- **Jéssica Villas Bôas** · [@JVillasBoas](https://github.com/JVillasBoas)

Orientação: Profª Drª Raquel de Miranda Barbosa · IFRS Campus Rio Grande
