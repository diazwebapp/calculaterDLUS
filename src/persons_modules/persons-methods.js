
const fs = require('fs');

// Función para leer los datos del archivo db.json
const readData = () => {
  try {
    const data = fs.readFileSync('src/public/db.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Función para escribir los datos en el archivo db.json
const writeData = (data) => {
  fs.writeFileSync('src/public/db.json', JSON.stringify(data));
};

// Método CREATE - POST
const createPerson = (person) => {
    // Leer los datos del archivo db.json
    const data = readData();
    
    // Obtener el objeto del cuerpo de la solicitud
    let newData = person;
  
    // Verificar si el valor de la clave dl ya existe en el array data
    const dlExists = data.some(p => p.dl === newData.dl);
  
    if (!dlExists) {
      // Asignar un nuevo ID al objeto
      newData.id = data.length + 1;
  
      // Agregar el objeto al array de datos
      data.push(newData);
  
      // Escribir los datos en el archivo db.json
      writeData(data);
      return newData;
    } else{
      return false
    }
    // Enviar una respuesta al cliente
    
  }
  

// Método READ - GET
const getPersons = () => {
  // Leer los datos del archivo db.json
  const data = readData();
  data.forEach(function(obj) {
    if (obj.status !== "entregada") {
        delete obj.fechaEntrega
        delete obj.fechaExpiracion 
    }
});
  // Enviar el array de datos al cliente
  return data;
};

const getAPerson = (id) => {
  // Leer los datos del archivo db.json
  const data = readData();
  
  // Obtener el ID del parámetro de la ruta
  id = parseInt(id);
  
  // Buscar el objeto con el ID especificado
  const item = data.find(d => d.id === id);
  
  // Si no se encuentra el objeto, enviar un error
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  // Enviar el objeto al cliente
  return item
};

// Método UPDATE - PUT
const updatePerson = (id,updateData) => {
    // Leer los datos del archivo db.json
    const data = readData();

    // Obtener el ID del parámetro de la ruta
    id = parseInt(id);

    // Buscar el índice del objeto con el ID especificado
    const index = data.findIndex(d => d.id === id);

    // Si no se encuentra el objeto, enviar un error
    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    var diasASumar = 14;
    var milisegundosPorDia = 24 * 60 * 60 * 1000;
    var fechaFinal = updateData.fechaEntrega + diasASumar * milisegundosPorDia;
    updateData.fechaExpiracion = fechaFinal

    // Actualizar el objeto con los datos del cuerpo de la solicitud
    data[index] = { ...data[index], ...updateData };
    

    // Escribir los datos en el archivo db.json
    writeData(data);

    // Enviar una respuesta al cliente
    return data[index];
};

// Método DELETE - DELETE
const deletePerson = (id) => {
    // Leer los datos del archivo db.json
    const data = readData();

    // Obtener el ID del parámetro de la ruta
    d = parseInt(id);

    // Buscar el índice del objeto con el ID especificado
    const index = data.findIndex(d => d.id === id);

    // Si no se encuentra el objeto, enviar un error
    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    // Eliminar el objeto del array de datos y actualizar los IDs de los objetos restantes.
    data.splice(index,1);
    
    for(let i=index; i<data.length; i++){
        data[i].id--;
    }

    // Escribir los datos en el archivo db.json.
    writeData(data);
    
};

module.exports = {getAPerson,getPersons,createPerson,updatePerson,deletePerson,readData}
