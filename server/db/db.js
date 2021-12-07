const { MongoClient } = require('mongodb');


let activeDb = '';

const dbInit = async () => {
  try {
    const dbClient = new MongoClient(process.env.MONGO_DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    dbClient.on('connectionClosed', () => {
      activeDb = '';
    }) 

    if (!activeDb ) {
      await dbClient.connect();
      activeDb = dbClient.db('Payload');
    }
    
    return activeDb;
  } catch (e) {
    console.log('--->error while connecting with graphql context (db)', e);
  }
}

module.exports = { dbInit };
