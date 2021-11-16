const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajasr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('cycleLover');
        const ProductsCollection = database.collection('products');
        const reviewCollection = database.collection("review");
        const booksCollection = database.collection("books");
        const usersCollection = database.collection("users");














        app.get('/products/:id', async (req, res) => {
                    const id = req.params.id;
                    const query = { _id: ObjectId(id) }
                    const cart = await productsCollection.findOne(query);
                    res.json(cart);
                })
        
                app.delete('/products/:id', async (req, res) => {
                    const id = req.params.id;
                    const query = { _id: ObjectId(id) };
                    const result = await productsCollection.deleteOne(query);
                    console.log('hitted');
                    res.json(result);
                })
                app.put('/products/:id', async (req, res) => {
                    const id = req.params.id;
                    const updatedCart = req.body;
                    const filter = { _id: ObjectId(id) };
                    const options = { upsert: true };
                    const updateDoc = {
                        $set: {
                            appoval: updatedCart.appoval = "Approved"
                        }
                    };
                    console.log(req.body);
                    const result = await productsCollection.updateOne(filter, updateDoc, options);
                    console.log('Inserting', id);
                    res.json(result);
        
                })










        // sdsd


      app.get('/products', async(req, res) => {
          const cursor = ProductsCollection.find({});
          const products =await cursor.toArray();
          res.send(products);
    });

    

    app.get('/products/:id', async(req, res) =>{
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = { _id: ObjectId(id)};
        const service = await ProductsCollection.findOne(query);
        res.json(service);
    })

    app.post('/products', async (req, res) =>{
        const service = req.body;
        console.log('hit the api', service);
        const result = await ProductsCollection.insertOne(service);
        console.log(result);
        res.json(result)
    });


    app.post("/review", async (req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        console.log(result);
        res.json(result);
    });

    app.get("/review", async (req, res) => {
        const cursor = reviewCollection.find({});
        const review = await cursor.toArray();
        res.send(review);
    });

         // GET book
         app.get("/books", async (req, res) => {
            const cursor = booksCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        // GET BOOKING single api
        app.get("/books/:id", async (req, res) => {
            const id = req.params.id;
        const query = { _id: ObjectId(id)}
                // const query = {email: require.body.email}
        
            const offer = await booksCollection.findOne(query)
            res.json(offer)
        });

        // GET BOOKING single api
        app.get("/books/:email", async (req, res) => {
            const query = { email: ObjectId(email)}
                // const query = {email: req.params.email};
       
            const offers = await booksCollection.find({email: req.params.email})
        
            res.json(offers)
        });

        // Add Orders API
        app.post("/books", async (req, res) => {
            const order = req.body;
            // console.log("hit the post api", order);
            const result = await booksCollection.insertOne(order);

            res.json(result);
        });

        // // DELETE API
        app.delete("/books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booksCollection.deleteOne(query);
            console.log("deleting user with id ", result);
            res.json(result);
        });
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ProductsCollection.deleteOne(query);
            console.log("deleting user with id ", result);
            res.json(result);
        });

        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(result);
        });

        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(
            filter,
            updateDoc
            );
            res.json(result);

        });

    }
    finally{
        
    }
}

run().catch(console.dir);
app.get('/', (req, res) =>{
    res.send('Running Ridebull Server');
});

app.listen(port, () =>{
    console.log('Running Ridebull on port', port);
})