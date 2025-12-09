module.exports.emailConfirmacao = (tokenValidacao) => {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Validação de Email</title>
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

    a.button {
      margin-top: 20px;
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 10px;
      cursor: pointer;
      background-color: #6446DB;
      color: #fff;
      transition: 0.2s;
      text-decoration: none;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Validação de Email</h2>
    <p>Obrigado por se registrar! Por favor, clique no botão abaixo para validar seu email:</p>
    <a href="${process.env.SERVER_URL}/api/validate-email/${tokenValidacao}" class="button">Validar Email</a>
  </div>
</body>
</html>`;
};
