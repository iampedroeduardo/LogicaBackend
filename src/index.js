const express = require('express');
const dotenv = require('dotenv');
const ngrok = require('@ngrok/ngrok');
const app = express();
const router = require('./routers');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api', router);
dotenv.config()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// ngrok.connect({ addr: 3000, authtoken_from_env: true})
// 	.then(listener => console.log(`Ingress established at: ${listener.url()}`));
