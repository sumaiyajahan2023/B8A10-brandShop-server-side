const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

let products = [] //in memory storage

async function run() {
    try{
        app.get('/products', async(req, res) => {
            res.send(products)
        })
        
        app.post('/products', async(req, res) => {
            const product = req.body;
            products.push(product)
            console.log(product)
            res.send(products)
        })
    }
    catch{
        throw new Error('Something went wrong on the server!', error)
    }
}
run().catch(console.log)

app.get('/', (req, res) => {
    res.send('server running properly')
})

app.listen(port, ()=>{
    console.log(`Running on port:${port}`)
})
