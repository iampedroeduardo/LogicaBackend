const express = require('express');
const app = express();
const router = require('./routers');

app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
