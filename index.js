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
    const usersCollection = client.db("brand_shop").collection("users");

    app.get("/products", async (req, res) => {
      try {
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error handling /products route:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error handling /products route:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/users", async (req, res) => {
      try {
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error handling /products route:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/products", async (req, res) => {
      try {
        const product = req.body;
        const result = await productsCollection.insertOne(product);
        res.send(result);
      } catch (error) {
        console.error("Error handling /products route:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error("Error handling /products route:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.delete("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error handling /products route:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.put("/products/:id", async (req, res) => {
      try {
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
      } catch (error) {
        console.error("Error handling /products route:", error);
        res.status(500).send("Internal Server Error");
      }
    });
  } catch (error) {
    throw new Error("Something went wrong on the server!", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Electronics store server running properly...");
});

app.listen(port, () => {
  console.log(`Running on port:${port}`);
});
