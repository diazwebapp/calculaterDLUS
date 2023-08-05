const sqlite3 = require('sqlite3').verbose();

// Database file path
const dbPath = './myproject.db';

// Function to connect to the database
const connectToDB = async () => {
  try {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected successfully to server');
      }
    });
    return db;
  } catch (err) {
    console.log(err.stack);
  }
};

// Method CREATE - POST
const createPerson = async (person) => {
  // Get the connection instance
  const db = await connectToDB();

  // Check if the value of the dl key already exists in the table
  db.get('SELECT * FROM persons WHERE dl = ?', [person.dl], (err, row) => {
    if (err) {
      throw err;
    }
    if (!row) {
      // Assign a new ID to the object
      db.get('SELECT COUNT(*) FROM persons', [], (err, row) => {
        if (err) {
          throw err;
        }
        person.id = row['COUNT(*)'] + 1;

        // Insert the object into the table
        db.run(
          'INSERT INTO persons(id, name, dl, status, fechaEntrega, fechaExpiracion) VALUES(?, ?, ?, ?, ?, ?)',
          [
            person.id,
            person.name,
            person.dl,
            person.status,
            person.fechaEntrega,
            person.fechaExpiracion,
          ],
          function (err) {
            if (err) {
              throw err;
            }
          }
        );
      });
      return person;
    } else {
      return false;
    }
  });
};

// Method READ - GET
const getPersons = async () => {
  // Get the connection instance
  const db = await connectToDB();

  // Find all rows in the table and convert them to an array
  let data = [];
  db.all('SELECT * FROM persons', [], (err, rows) => {
    if (err) {
      throw err;
    }
    data = rows;

    data.forEach(function (obj) {
      if (obj.status !== 'entregada') {
        delete obj.fechaEntrega;
        delete obj.fechaExpiracion;
      }
    });
  });

  // Return the array of data to the client
  return data;
};

const getAPerson = async (id) => {
  // Get the connection instance
  const db = await connectToDB();

  // Parse the ID as an integer
  id = parseInt(id);

  // Find the row with the specified ID
  let item;
  db.get('SELECT * FROM persons WHERE id = ?', [id], (err, row) => {
    if (err) {
      throw err;
    }
    item = row;

    // If no row is found, return an error
    if (!item) {
      return { error: 'Item not found' };
    }
  });

  // Return the row to the client
  return item;
};

// Method UPDATE - PUT
const updatePerson = async (id, updateData) => {
  // Get the connection instance
  const db = await connectToDB();

  // Parse the ID as an integer
  id = parseInt(id);

   var diasASumar=14;
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

   db.run(`UPDATE persons SET ${updateString} WHERE id=?`,values,(err)=>{
       if(err){
           throw err;
       }
   });

   let updatedItem;
   db.get(`SELECT * FROM persons WHERE id=?`,[id],(err,row)=>{
       if(err){
           throw err;
       }
       updatedItem=row;
   });

   return updatedItem;
};

// Method DELETE - DELETE
const deletePerson=async(id)=>{
     // Get the collection instance.
     const db=await connectToDB();
    
     // Parse ID as an integer.
     id=parseInt(id);
    
     // Delete document with specified ID from collection.
     db.run(`DELETE FROM persons WHERE id=?`,[id],function(err){
         if(err){
             throw err;
         }

         if(this.changes===0){
             return {error:'Item not found'};
         }
     });
}

module.exports={getAPerson,getPersons,createPerson,updatePerson,deletePerson,connectToDB}
