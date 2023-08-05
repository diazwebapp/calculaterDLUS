const mysql = require('mysql2/promise');

// Connection configuration
const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myproject',
};

// Function to connect to the database
const connectToDB = async () => {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected successfully to server');
    return connection;
  } catch (err) {
    console.log(err.stack);
  }
};

// Method CREATE - POST
const createPerson = async (person) => {
  // Get the connection instance
  const connection = await connectToDB();

  // Check if the value of the dl key already exists in the table
  const [dlExists] = await connection.execute(
    'SELECT * FROM persons WHERE dl = ?',
    [person.dl]
  );

  if (dlExists.length === 0) {
    // Assign a new ID to the object
    const [count] = await connection.execute('SELECT COUNT(*) FROM persons');
    person.id = count[0]['COUNT(*)'] + 1;

    // Insert the object into the table
    await connection.execute(
      'INSERT INTO persons SET ?',
      person
    );

    return person;
  } else {
    return false;
  }
};

// Method READ - GET
const getPersons = async () => {
  // Get the connection instance
  const connection = await connectToDB();

  // Find all rows in the table and convert them to an array
  const [data] = await connection.execute('SELECT * FROM persons');

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
  // Get the connection instance
  const connection = await connectToDB();

  // Parse the ID as an integer
  id = parseInt(id);

  // Find the row with the specified ID
  const [item] = await connection.execute(
    'SELECT * FROM persons WHERE id = ?',
    [id]
  );

  // If no row is found, return an error
  if (item.length ===0) {
    return { error: 'Item not found' };
  }

  // Return the row to the client
  return item[0];
};

// Method UPDATE - PUT
const updatePerson = async (id, updateData) => {
  // Get the connection instance
  const connection = await connectToDB();

  // Parse the ID as an integer
  id = parseInt(id);

   var diasASumar =14;
   var milisegundosPorDia=24*60*60*1000;
   var fechaFinal=updateData.fechaEntrega+diasASumar*milisegundosPorDia;
   updateData.fechaExpiracion=fechaFinal;

   let updateString='';
   let values=[];
   for(let key in updateData){
       updateString+=`${key}=?,`;
       values.push(updateData[key]);
   }
   updateString=updateString.slice(0,-1);
   values.push(id);

   console.log(updateString,values);

   const [result]=await connection.execute(`UPDATE persons SET ${updateString} WHERE id=?`,values);

   if(result.affectedRows===0){
       return {error:'Item not found'};
   }

   const [updatedItem]=await connection.execute(`SELECT * FROM persons WHERE id=?`,[id]);

   return updatedItem[0];
};

// Method DELETE - DELETE
const deletePerson=async(id)=>{
     // Get the collection instance.
     const connection=await connectToDB();
    
     // Parse ID as an integer.
     id=parseInt(id);
    
     // Delete document with specified ID from collection.
     const [result]=await connection.execute(`DELETE FROM persons WHERE id=?`,[id]);
    
     if(result.affectedRows===0){
         return {error:'Item not found'};
     }
}

module.exports={getAPerson,getPersons,createPerson,updatePerson,deletePerson,connectToDB}
