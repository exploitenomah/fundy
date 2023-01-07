
const { MongoClient, ServerApiVersion } = require('mongodb');

export const connect = async (dbToConnect) => {
  const uri = process.env.CONNECTION_STRING
    try {
      const client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
        .connect();
      let db = client.db(dbToConnect);
      return {
        client,
        db,
      };
    } catch (err) {
      console.error('UNABLE TO CONNECT TO DATABASE!!! ❌❌❌❌❌ ERROR: ==>>> ', err);
    } 
} 