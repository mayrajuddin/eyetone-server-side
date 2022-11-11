const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const moment = require('moment-timezone')
const app = express();

const port = process.env.PORT || 5000;



app.use(cors())
app.use(express.json())

const timeNow = () => moment.tz(Date.now(), 'Asia/Dhaka').format();



app.get('/', (req, res) => {
    res.send('eyetone server running');
})

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
            const queryParam = parseInt(req.query.limit);

            if (queryParam) {
                const cursor = servicesCollection.find({}).limit(queryParam)
                const findServices = await cursor.toArray()
                return res.send(findServices)

            }
            const cursor = servicesCollection.find({})
            const findServices = await cursor.toArray()
            res.send(findServices)
        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })

        // reviews api
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query).sort({ createdAt: -1 })
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await reviewsCollection.insertOne({ ...review, createdAt: timeNow() })
            res.send(result)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.findOne(query)
            res.send(result)
        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const review = req.body
            const option = { upsert: true }
            const updatedReview = {
                $set: {
                    ratings: review.ratings,
                    message: review.message
                }
            }
            const result = await reviewsCollection.updateOne(query, updatedReview, option)
            res.send(result)
        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally { }
}


run().catch(e => console.error(e))
app.listen(port, () => {
    console.log(`Server running port at ${port}`);
})