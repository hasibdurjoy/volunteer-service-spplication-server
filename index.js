const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yohkm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("volunteer_services_application");
        const serviceCollection = database.collection("services");
        const volunteerCollection = database.collection("volunteers");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.get('/volunteers', async (req, res) => {
            const cursor = volunteerCollection.find({});
            const volunteers = await cursor.toArray();
            res.send(volunteers);
        });

        app.get('/volunteers/:uid', async (req, res) => {
            const uid = [req.params.uid];
            const query = { uid: { $in: uid } };
            const volunteer = await volunteerCollection.find(query).toArray();
            res.send(volunteer);
        });


        //Add orders api
        app.post('/volunteers', async (req, res) => {
            const order = req.body;
            const result = await volunteerCollection.insertOne(order)
            res.json(result);
        });

        // DELETE API
        app.delete('/volunteers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await volunteerCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running my CRUD server');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

