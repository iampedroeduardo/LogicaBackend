module.exports.validacaoEmailSucesso = () => {
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Validação de Email — Sucesso</title>

  <style>
    :root{
      --bg: #EEEEEE;
      --green: #4CAF50;
      --text: #222;
      --muted: gray;
      --card-padding: 20px;
      --max-width: 700px;
    }

    html,body{
      height:100%;
      margin:0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      background: var(--bg);
      color: var(--text);
    }

    .page {
      min-height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      box-sizing:border-box;
    }

    .card {
      width:100%;
      max-width: var(--max-width);
      background:white;
      border-radius:12px;
      padding: var(--card-padding);
      text-align:center;
      box-shadow:0 6px 18px rgba(0,0,0,0.06);
    }

    .icon {
      width:100px;
      height:100px;
      margin:0 auto;
      display:block;
    }

    .title {
      font-size:24px;
      font-weight:700;
      margin-top:20px;
      margin-bottom:10px;
      text-align:center;
    }

    .subtitle {
      font-size:16px;
      color:var(--muted);
      text-align:center;
      margin-bottom:30px;
      line-height:1.4;
    }

    .actions {
      display:flex;
      justify-content:center;
      gap:12px;
      flex-wrap:wrap;
    }

    .btn {
      display:inline-block;
      padding:10px 18px;
      border-radius:8px;
      text-decoration:none;
      font-weight:600;
      cursor:pointer;
      border:none;
      background:#1976D2;
      color:white;
      box-shadow:0 4px 10px rgba(25,118,210,0.18);
    }

    .btn.secondary {
      background: transparent;
      color: #1976D2;
      border: 1px solid rgba(25,118,210,0.16);
      box-shadow:none;
    }

    @media (max-width:420px){
      .card { padding:16px; border-radius:10px; }
      .title { font-size:20px; }
      .subtitle { font-size:15px; }
    }
  </style>
</head>

<body>
  <main class="page">
    <section class="card">

      <!-- Ícone check-circle-outline (Material) -->
      <svg class="icon" viewBox="0 0 24 24">
        <path fill="#4CAF50" d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z"/>
      </svg>

      <h1 class="title">Email Validado com Sucesso!</h1>

      <p class="subtitle">
        Sua conta foi ativada. Agora você já pode fazer o login no aplicativo.
      </p>

    </section>
  </main>
</body>
</html>
`
}