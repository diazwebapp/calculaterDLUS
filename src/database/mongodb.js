const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);

// Function to connect to the database
const connectToDB = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
  } catch (err) {
    console.log(err.stack);
  }
};

// Function to get the database instance
const getDB = () => {
  return client.db(dbName);
};

// Function to get the collection instance
const getCollection = () => {
  return getDB().collection('persons');
};

// Method CREATE - POST
const createPerson = async (person) => {
  // Get the collection instance
  const collection = getCollection();

  // Check if the value of the dl key already exists in the collection
  const dlExists = await collection.findOne({ dl: person.dl });

  if (!dlExists) {
    // Assign a new ID to the object
    person.id = (await collection.countDocuments()) + 1;

    // Insert the object into the collection
    await collection.insertOne(person);

    return person;
  } else {
    return false;
  }
};

// Method READ - GET
const getPersons = async () => {
  // Get the collection instance
  const collection = getCollection();

  // Find all documents in the collection and convert them to an array
  const data = await collection.find().toArray();

  data.forEach(function (obj) {
    if (obj.status !== 'entregada') {
      delete obj.fechaEntrega;
      delete obj.fechaExpiracion;
    }
  });

  // Return the array of data to the client
  return data;
};

const getAPerson = async (id) => {
  // Get the collection instance
  const collection = getCollection();

  // Parse the ID as an integer
  id = parseInt(id);

  // Find the document with the specified ID
  const item = await collection.findOne({ id: id });

  // If no document is found, return an error
  if (!item) {
    return { error: 'Item not found' };
  }

  // Return the document to the client
  return item;
};

// Method UPDATE - PUT
const updatePerson = async (id, updateData) => {
  // Get the collection instance
  const collection = getCollection();

  // Parse the ID as an integer
  id = parseInt(id);

  var diasASumar = 14;
  var milisegundosPorDia = 24 * 60 * 60 * 1000;
  var fechaFinal =
    updateData.fechaEntrega + diasASumar * milisegundosPorDia;
  updateData.fechaExpiracion = fechaFinal;

  // Update the document with the specified ID with the updateData object
  const result = await collection.updateOne(
    { id: id },
    { $set: updateData }
  );

  // If no document is updated, return an error
  if (result.modifiedCount === 0) {
    return { error: 'Item not found' };
  }

  // Return the updated document to the client
  return await collection.findOne({ id: id });
};

// Method DELETE - DELETE
const deletePerson = async (id) => {
    // Get the collection instance.
    const collection = getCollection();
    
    // Parse ID as an integer.
    id = parseInt(id);
    
    // Delete document with specified ID from collection.
    const result = await collection.deleteOne({id: id});
    
    if(result.deletedCount ===0){
        return {error: 'Item not found'};
    }
    
}

module.exports = {getAPerson,getPersons,createPerson,updatePerson,deletePerson,connectToDB}
