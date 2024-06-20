const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// let products = []; //in memory storage

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lbhoupe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const productsCollection = client.db("brand_shop").collection("products");

    app.get("/products", async (req, res) => {
      //   const productsCollection = client.db("brand_shop").collection("products");
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      //   products.push(product);
      //   console.log(product);
      //   const productsCollection = client.db("brand_shop").collection("products");
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log(req);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const updatedDoc = req.body;
      const product = {
        $set: {
          name: updatedDoc.updatedName,
          imageUrl: updatedDoc.updatedImageUrl,
          brandName: updatedDoc.updatedBrandName,
          price: updatedDoc.updatedPrice,
          description: updatedDoc.updatedDescription,
          rating: updatedDoc.updatedRating,
        },
      };
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await productsCollection.updateOne(
        query,
        product,
        options
      );
      res.send(result);
    });
  } catch {
    throw new Error("Something went wrong on the server!", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("server running properly");
});

app.listen(port, () => {
  console.log(`Running on port:${port}`);
});
