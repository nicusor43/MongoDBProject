var Express = require("express");
var cors = require("cors");

const bodyParser = require("body-parser");

var app = Express();
app.use(cors());
app.use(bodyParser.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://crucerunicusor04:e1JDb26sFvKYHIXj@cluster0.r8z50fq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    const database = client.db("FootballersDB");

    const collection = database.collection("Footballers");

    const result = await collection.deleteMany({ Nume: "undefined" });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const data = await collection.find({}).toArray();
    console.log("Fetched data:", data);
  } finally {}
}

var PORT = 3000;

// start the Express server
app.listen(PORT, () => {
  run().catch(console.dir);
  console.log(`Server listening on port ${PORT}`);
});

app.get("/data", async (req, res) => {
  try {
    const database = client.db("FootballersDB");
    const collection = database.collection("Footballers");
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (error) {
    console.error("Error fetching player data:", error);
  }
});

app.post('/data', async (req, res) => {
  try {
    const db = client.db('FootballersDB');
    const collection = db.collection('Footballers');

    const data = req.body;

    const result = await collection.insertOne(data);

    res.json({ message: 'Documentul a fost adaugat', documentId: result.insertedId });
  } catch (error) {
    console.error('Eroare in adaugarea documentului:', error);
    res.status(500).json({ error: 'Eroare in adaugarea documentului' });
  }
});

app.patch('/data/:id', async (req, res) => {
  try {
    const db = client.db('FootballersDB');
    const collection = db.collection('Footballers');
    const id = req.params.id;
    const updatedData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: `ID invalid: ${id}` });
    }
    else {
      console.log("ID valid", id);
    }

    const updates = { $set: updatedData };


    const result = await collection.updateOne({ "_id" : new ObjectId(id) }, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Nu s-a gasit jucatorul' });
    }

    console.log(result.matchedCount);
    console.log(updatedData);

    res.json({ message: 'Jucator adaugat cu succes' });
  } catch (error) {
    console.error('Eroare in actualizarea jucatorului:', error);
    res.status(500).json({ error: 'Eroare in actualizarea jucatorului' });
  }
});

app.delete('/data/:id', async (req, res) => {
  try {
    const db = client.db('FootballersDB');
    const collection = db.collection('Footballers');
    const deleteId = new ObjectId(req.params.id);

    const result = await collection.deleteOne({ _id: deleteId });
    if (result.deletedCount === 1) {
      res.json({ message: 'Jucatorul a fost sters' });
    } else {
      res.status(404).json({ error: 'Jucatorul nu a fost gasit' });
    }
  } catch (error) {
    console.error('Eroare in stergerea jucatorului:', error);
    res.status(500).json({ error: 'Eroare' });
  }
});


run().catch(console.dir);
