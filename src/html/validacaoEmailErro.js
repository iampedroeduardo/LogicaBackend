module.exports.validacaoEmailErro = () => {
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Validação de Email — Erro</title>
  <style>
    :root{
      --bg: #EEEEEE;
      --red: #EF5350;
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
      padding: 20px;
      box-sizing:border-box;
    }

    .card {
      width:100%;
      max-width: var(--max-width);
      background: white;
      border-radius: 12px;
      padding: var(--card-padding);
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
      text-align:center;
    }

    .icon {
      width:100px;
      height:100px;
      margin: 0 auto;
      display:block;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 10px;
      text-align:center;
    }

    .subtitle {
      font-size: 16px;
      color: var(--muted);
      text-align:center;
      margin-bottom: 30px;
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
      border: none;
      background: #1976D2;
      color: white;
      box-shadow: 0 4px 10px rgba(25,118,210,0.18);
    }

    .btn.secondary {
      background: transparent;
      color: #1976D2;
      border: 1px solid rgba(25,118,210,0.16);
      box-shadow: none;
    }

    /* mobile adjustments */
    @media (max-width:420px){
      .card { padding:16px; border-radius:10px; }
      .title { font-size:20px; }
      .subtitle { font-size:15px; }
    }
  </style>
</head>
<body>
  <main class="page" role="main">
    <section class="card" aria-labelledby="erro-title">
      <!-- SVG do ícone close-circle-outline (material-style) -->
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="#EF5350" d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M15.59,8L12,11.59L8.41,8L7,9.41L10.59,13L7,16.59L8.41,18L12,14.41L15.59,18L17,16.59L13.41,13L17,9.41L15.59,8Z"/>
      </svg>

      <h1 id="erro-title" class="title">Não foi possível validar o seu email!</h1>

      <p class="subtitle">
        O link de validação pode ter expirado ou ser inválido. Por favor, tente
        se cadastrar novamente.
      </p>
    </section>
  </main>
</body>
</html>
`
}