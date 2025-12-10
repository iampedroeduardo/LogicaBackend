module.exports.emailRecuperacaoSenha = (codigo) => {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperação de Senha</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #4b79a1, #283e51);
      color: #fff;
      text-align: center;
    }

    .container {
      background: rgba(255, 255, 255, 0.15);
      padding: 40px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      width: 350px;
      display: inline-block;
      margin-top: 50px;
    }

    .code-box {
      margin: 20px auto;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 6px;
      background: rgba(255,255,255,0.25);
      padding: 15px 0;
      border-radius: 12px;
      color: #000;
      border: 2px solid rgba(255,255,255,0.35);
      width: 220px;
    }

    p {
      line-height: 1.5;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Recuperação de Senha</h2>
    <p>Você solicitou a recuperação de senha.</p>
    <p>Use o código abaixo para continuar com o processo:</p>

    <div class="code-box">${codigo}</div>
  </div>
</body>
</html>`;
};
