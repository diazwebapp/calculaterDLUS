const express = require('express');
const cors = require('cors');
const regenerate_person_data = require('./capture_form');
const { apiGetAPerson, apiGetPersons, apiCreatePerson, apiUpdatePerson, apiDeletePerson } = require('./crud-persons');

const app = express();
const port = 3000;

// Habilitar CORS para dos dominios
const corsOptions = {
  origin: ['http://dominio1.com', 'http://dominio2.com'],
};

// Middleware para habilitar CORS
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Ruta principal para mostrar el HTML generado
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta de la API para recibir y devolver JSON
app.post('/api/get_data', async (req, res) => {
  // Aquí puedes procesar los datos JSON recibidos y devolver una respuesta JSON
  const {data,targetState }= req.body;
  //const response = await regenerate_person_data(`${data}`);
  const response = await regenerate_person_data(data,targetState);
  res.json(response);
});
app.get('/api/person/:id', apiGetAPerson);
app.get('/api/persons', apiGetPersons);
app.post('/api/persons', apiCreatePerson);
app.put('/api/persons/:id', apiUpdatePerson);
app.delete('/api/persons/:id', apiDeletePerson);

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});