# Backend – Lógica++

API backend do projeto **Lógica++**, desenvolvida em **Node.js**, responsável por autenticação, comunicação com banco de dados e serviços auxiliares.

---

## 🛠 Tecnologias

* Node.js
* PostgreSQL
* JWT (autenticação)
* Envio de e-mails (SMTP)
* Cloudflare Tunnel

---

## 📁 Estrutura (resumida)

```
backend/
├─ src/
│  └─ index.js
├─ .env
└─ package.json
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5433/NOME_DO_BANCO?schema=public"
JWT_SECRET="sua_chave_secreta"
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="senha_de_app_do_email"
SERVER_URL="https://sua-url-publica.trycloudflare.com"
```

> ⚠️ **Nunca versione o arquivo `.env`**. Utilize um `.env.example` se necessário.

---

## ▶️ Executando o Backend

```bash
node src/index.js
```

A API será iniciada em:

```
http://localhost:3000
```

---

## 🌐 Acesso fora da rede local (Cloudflare Tunnel)

Para permitir acesso ao backend fora da mesma rede:

1. Instale o **cloudflared**
2. Inicie a API normalmente
3. Execute:

```bash
cloudflared tunnel --url http://localhost:3000/
```

4. Copie a URL pública gerada
5. Atualize a variável `SERVER_URL` no `.env`
6. Utilize a mesma URL no frontend

---

## ✅ Observações

* O backend deve estar rodando antes do frontend
* Para produção, utilize variáveis de ambiente seguras e serviços apropriados

---

🚀 Backend desenvolvido em Node.js
