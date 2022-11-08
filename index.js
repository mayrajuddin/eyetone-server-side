const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('api server running');
})
app.use(cors())
app.use(express.json())

// eyetone
// PLbsfr3s2xeiYadE

const uri = "mongodb+srv://eyetone:PLbsfr3s2xeiYadE@cluster0.oejruqx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const servicesCollection = client.db('eyetone').collection('services')
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })
        app.post('/services', async (req, res) => {
            const user = req.body
            const result = await servicesCollection.insertOne(user)
            res.send(result)
        })
    }
    catch { }
}


run().catch(e = console.error(e))
app.listen(port, () => {
    console.log('running server');
})