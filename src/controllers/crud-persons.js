const { createPerson, getPersons, getAPerson, updatePerson, deletePerson } = require("../database/mongodb");

// Método CREATE - POST
const apiCreatePerson = (req, res) => {
    // Obtener el objeto del cuerpo de la solicitud
    const newData = req.body;
    const person = createPerson(newData)
    if(!person){
        return res.status(404).json()
    }
    res.json(person)
  }
  

// Método READ - GET
const apiGetPersons = async (req, res) => {
  const data = await getPersons();
  let status = req.query.status;
  const nombre = req.query.nombre;
  const fecha = req.query.fecha ? new Date(req.query.fecha).getTime() : undefined;
  status && status == 'nuevas' ? status = 'nueva' : status
  
  let filteredData = data ;

  console.log(status,nombre,fecha)
  if (status !== undefined && nombre === undefined && fecha === undefined) {
    filteredData = filteredData.filter(item => item.status === status);
    return res.json(filteredData);
  }
  if (status === undefined && nombre === undefined && fecha !== undefined) {
    filteredData = filteredData.filter(item => item.fechaRegistro === fecha );
    return res.json(filteredData);
  }
  if (status === undefined && nombre !== undefined && fecha === undefined) {
    filteredData = filteredData.filter(item => item.name.toLowerCase().includes(nombre.toLowerCase()));
    return res.json(filteredData);
  }

  if (status !== undefined && nombre !== undefined && fecha === undefined) {
    filteredData = filteredData.filter(item => item.name.toLowerCase().includes(nombre.toLowerCase()) && item.status === status);
    return res.json(filteredData);
  }
  if (status !== undefined && nombre === undefined && fecha !== undefined) {
    filteredData = filteredData.filter(item => item.fechaRegistro === fecha && item.status === status);
    return res.json(filteredData);
  }
  
  if (status === undefined && nombre !== undefined && fecha !== undefined) {
    filteredData = filteredData.filter(item => item.fechaRegistro === fecha && item.name.toLowerCase().includes(nombre.toLowerCase()) );
    return res.json(filteredData);
  }
  

  if (status !== undefined && nombre !== undefined && fecha !== undefined) {
    filteredData = filteredData.filter(item => item.status === status && item.fechaRegistro == fecha && item.name.toLowerCase().includes(nombre.toLowerCase()));
    return res.json(filteredData);
  }

  return res.json(filteredData);
};

const apiGetAPerson = async (req, res) => {
  // Obtener el ID del parámetro de la ruta
  const id = parseInt(req.params.id);
  const item = await getAPerson(id)
  res.json(item)
};

// Método UPDATE - PUT
const apiUpdatePerson = async (req, res) => {

    // Obtener el ID del parámetro de la ruta
    const id = parseInt(req.params.id);
    const data = await updatePerson(id,req.body)

    // Enviar una respuesta al cliente
    res.json(data);
};

// Método DELETE - DELETE
const apiDeletePerson = async (req, res) => {
    // Obtener el ID del parámetro de la ruta
    const id = parseInt(req.params.id);
    await deletePerson(id)
    // Enviar una respuesta al cliente.
    res.status(204).end();
};

module.exports = {apiGetPersons,apiGetAPerson,apiCreatePerson,apiUpdatePerson,apiDeletePerson}
