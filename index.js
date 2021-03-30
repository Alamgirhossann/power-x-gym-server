const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
// const fileUpload = require('express-fileupload');
// const fs = require('fs-extra');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s5oej.mongodb.net/${process.env.DB_NAME}retryWrites=true&w=majority`;

const app = express()
app.use(express.static('doctors'));
// app.use(fileUpload());
app.use(bodyParser.json())
app.use(cors())
const port = 4000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const classesCollection = client.db(`${process.env.DB_NAME}`).collection("classes");
  const priceCollection = client.db(`${process.env.DB_NAME}`).collection("price");
  const paymentCollection = client.db(`${process.env.DB_NAME}`).collection("payment");

  app.post('/payment', (req, res)=>{
    const payment = req.body
    console.log(payment);
    paymentCollection.insertOne(payment)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/getClass/:id', (req, res) => {
    classesCollection.find({id: req.params.id})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  app.get('/getClass', (req, res) => {
    classesCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/price', (req, res)=>{
    priceCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/price/:id', (req, res) => {
    priceCollection.find({id: req.params.id})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  console.log('database connected');
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)