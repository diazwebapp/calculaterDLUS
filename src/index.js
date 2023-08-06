require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const regenerate_person_data = require('./controllers/capture_form');
const { apiGetAPerson, apiGetPersons, apiCreatePerson, apiUpdatePerson, apiDeletePerson } = require('./controllers/crud-persons');
const { connectToMongo } = require('./database/mongodb');

const app = express();
const port = process.env.PORT || 3000;

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
  res.sendFile(__dirname + '/public/index.html');
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });

app.get('/backup', function(req, res){
  const file = __dirname + '/public/db.json';
  res.download(file);
});
app.post('/backup', upload.single('file'), function (req, res, next) {
  // req.file is the `file` file
  // req.body will hold the text fields, if there were any
  res.redirect('/');
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Iniciar el servidor
app.listen(port, async  () => {
  await connectToMongo()
  console.log(`Servidor escuchando en el puerto ${port}`);
  
});