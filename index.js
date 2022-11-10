const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('eyetone server running');
})
app.use(cors())
app.use(express.json())

// eyetone
// PLbsfr3s2xeiYadE

const uri = "mongodb+srv://eyetone:PLbsfr3s2xeiYadE@cluster0.oejruqx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('eyetone').collection('services')
        const reviewsCollection = client.db('eyetone').collection('reviews')
        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await servicesCollection.insertOne(service)
            res.send(result)
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const findServices = await cursor.toArray()
            res.send(findServices)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })
        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })
    }
    finally { }
}


run().catch(e => console.error(e))
app.listen(port, () => {
    console.log(`Server running port at ${port}`);
})