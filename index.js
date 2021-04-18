  const express = require('express');
  const MongoClient = require('mongodb').MongoClient;
  const ObjectID = require('mongodb').ObjectID;
  const bodyParser = require('body-parser')
  const cors = require ('cors');
  require('dotenv').config();

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qw23i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());


  const port = process.env.PORT || 5500;
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const productsCollection = client.db("ebrandShopStore").collection("products");
    const ordersCollection = client.db("ebrandShopStore").collection("orders");

    //All Products
    app.get('/products', (req, res) =>{
      productsCollection.find()
      .toArray((err, items) =>{
        res.send(items)
      })
    })

    //Single Product
    app.get('/product/:id', (req, res) => {
      productsCollection.find({_id: ObjectID(req.params.id)})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })


    //Add New Product
    app.post('/addProduct', (req, res) =>{
      const newProduct = req.body; 
      productsCollection.insertOne(newProduct)
      .then(result => {
      res.send('Added successfully', result.insertedCount > 0);
        })
    })

    
    //Checkout Order
    app.post('/chekoutOrder', (req, res) => {
      const details = req.body;
      ordersCollection.insertOne(details)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })


    //Order List
    app.get('/order', (req, res) => {
      const email = req.query.email
      ordersCollection.find({email: email})
      .toArray((err, documents) => {
        res.send(documents)
        })
      })

    //Delete Product
      app.delete('/delete/:id', (req, res) => {
        productsCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then(result => {
          res.send(result.deletedCount > 0)
        })
      })

  });

app.get('/', (req, res) => {
      res.send('Wait Please! Server Working...')
})

app.listen(port, ()=>{
console.log(`Example app listening at http://localhost:${port}`)
})






