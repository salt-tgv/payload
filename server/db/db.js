const { MongoClient } = require('mongodb');

const dbInit = async () => {
  try {
    const dbClient = new MongoClient(process.env.DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    if (!dbClient.isConnected()) await dbClient.connect();
    const db = dbClient.db('Payload'); // database name
    return db;
  } catch (e) {
    console.log('--->error while connecting with graphql context (db)', e);
  }
}

module.exports = { dbInit };
