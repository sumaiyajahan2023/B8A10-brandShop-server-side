const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lbhoupe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/products", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("brand_shop");
    const productsCollection = db.collection("products");
    const cursor = productsCollection.find();
    const result = await cursor.toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

app.get("/users", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("brand_shop");
    const usersCollection = db.collection("users");
    const cursor = usersCollection.find();
    const result = await cursor.toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

app.get("/products/:id", async (req, res, next) => {
  try {
    await client.connect();
    const db = client.db("brand_shop");
    const productsCollection = db.collection("products");
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await productsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

app.post("/products", async (req, res, next) => {
  try {
    await client.connect();
    const db = client.db("brand_shop");
    const productsCollection = db.collection("products");
    const product = req.body;
    const result = await productsCollection.insertOne(product);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

app.post("/users", async (req, res, next) => {
  try {
    await client.connect();
    const db = client.db("brand_shop");
    const usersCollection = db.collection("users");
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

app.delete("/products/:id", async (req, res, next) => {
  try {
    await client.connect();
    const db = client.db("brand_shop");
    const productsCollection = db.collection("products");
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await productsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

app.put("/products/:id", async (req, res, next) => {
  try {
    await client.connect();
    const db = client.db("brand_shop");
    const productsCollection = db.collection("products");
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
    const result = await productsCollection.updateOne(query, product, options);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.send("Electronics store server running properly...");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Running on port:${port}`);
});

module.exports = app;
