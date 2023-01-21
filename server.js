"use strict";

const express = require("express");
const cors = require ("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(cors());
// Adding global midleware to parse incoming json requests
app.use(express.json());
const PORT = process.env.PORT;

// Connect my Node app to cat database in MongoDB server
mongoose.connect(process.env.DATABASE_URL);

console.log(process.env.DATABASE_URL);
// Collection : Schema and model
// Schema: determine the shape of our data || Blueprint or template for our collection

const productSchema = new mongoose.Schema({
  username: String,
  name: String,
  brand: String,
  price: Number,
  imageUrl: String,
  description: String
});

// Model: creation phase

const productModel = mongoose.model('products', productSchema); //collection called products

// Seed (or populate) our database
function seedMakeupCollection() {
  const pencil = new productModel({
    username: "ajermasenoka@gmail.com",
    name: "Lippie Pencil",
    brand: "colourpop",
    price: "5.0",
    imageUrl: "https://cdn.shopify.com/s/files/1/1338/0845/collections/lippie-pencil_grande.jpg?v=1512588769",
    description: "Lippie Pencil A long-wearing and high-intensity lip pencil that glides on easily and prevents feathering. Many of our Lippie Stix have a coordinating Lippie Pencil designed to compliment it perfectly, but feel free to mix and match!"
  })

  const foundation= new productModel({
    username: "ajermasenoka@gmail.com",
    name: "No Filter Foundation",
    brand: "colourpop",
    price: "12.0",
    imageUrl: "https://i.ebayimg.com/images/g/G~YAAOSwIDthQoiT/s-l500.jpg",
    description: "Developed for the Selfie Age, our buildable full coverage, natural matte foundation delivers flawless looking skin from day-to-night. The oil-free, lightweight formula blends smoothly and is easily customizable to create the coverage you want. Build it up or sheer it out, it was developed with innovative soft-blurring pigments to deliver true color while looking and feeling natural. The lockable pump is easy to use and keeps your routine mess-free! As always, 100% cruelty-free and vegan."
  })

  const lipstick = new productModel({
    username: "aj161",
    name: "Lipstick",
    brand: "boosh",
    price: "26.0",
    imageUrl:"https://cdn.shopify.com/s/files/1/1016/3243/products/BABS_LID_540x.jpg?v=1574716430",
    description: "All of our products are free from lead and heavy metals, parabens, phthalates, artificial colourants, and synthetic fragrances.  Boosh lipstick glides on smoothly for clean & protective SPF coverage. They are filled with hydrating oils and butters to preserve and enhance your lips natural surface. Organic sweet orange oil gives a light and cheerful scent."
  })
  
  const serum = new productModel({
    username: "aj161",
    name: "Serum Foundation",
    brand: "deciem",
    price: "6.7",
    imageUrl:"https://i.ebayimg.com/images/g/G~YAAOSwIDthQoiT/s-l500.jpg",
    description: "Serum Foundations are lightweight medium-coverage formulations available in a comprehensive shade range across 21 shades. These foundations offer moderate coverage that looks natural with a very lightweight serum feel. They are very low in viscosity and are dispensed with the supplied pump or with the optional glass dropper available for purchase separately if preferred. "
  });

foundation.save();
lipstick.save();
pencil.save();
serum.save();
}

// seedMakeupCollection();

// proof of life
app.get("/products", getProductsHandler);
app.get("/products/:id", getProductByIdHandler);
app.get("/productbybrand", getProductsByBrand);
app.post("/product",cors(), addProductHandler);
app.delete('/product/:id', cors(), deleteProductHandler);
app.put('/product/:id', cors(), updateProductHandler);

app.get('/', (request, response) => {
  response.status(200).send('API server is live');
})

function getProductsHandler(req, res) {
  // let catsData = await catModel.find({});
  // res.send(catsData);

  // OR
  let username = req.query.username;
  productModel.find({username:username}, function (err, productsData) {
    if (err) {
      console.log("Did not work");
    } else {
      console.log(productsData);
      res.send(productsData);
    }
  });
}

// localhost:3001/products/6398d7d651967507b9fbecea
async function getProductByIdHandler(req, res) {
  const specificProduct = await productModel.findById(req.params.id);
  res.send(specificProduct);
}

//localhost:3001/productbybrand?brand=boosh
async function getProductsByBrand(req,res) {
  const brand = req.query.brand;

productModel.find({ brand }, function(err,selectedProducts) {
  if(err) {
    response.send(`error in getting product info >> ${err}`)
  } else {
    res.send(selectedProducts)
  }
})
}

async function addProductHandler(req,res) {
  console.log(req.body);
  console.log(req.body.name);
  const username =  req.body.username;
  const name = req.body.name;
  const brand = req.body.brand;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  
  let newProduct = await productModel.create({username ,name, brand, price, imageUrl, description});
  
  productModel.find({}, function(err,allProducts) {
    if(err) {
      response.send(`error in getting products info >> ${err}`)
    } else {
      res.send(allProducts)
    }
  })
}

// localhost:3001/product/6398da68cfbeecf6b97c2848 >> DELETE - using params
async function deleteProductHandler(req,res){
  let id = req.params.id;
  let username = user.email||user.nickname;

  productModel.findByIdAndDelete(id, async function(error, deletedProduct){
    if(error){
      console.log(error);
      res.send(`Error was encountered ${error}`);
    } else {
      console.log(deletedProduct);
      let productsData = await productModel.find({username:username});
      res.send(productsData);
    }
    })
    };
  
// localhost:3001/product/6398d7d651967507b9fbecea >> UPDATE (put)
async function updateProductHandler(req,res){
  console.log(req.params);
  console.log(req.body);
  const {username, name, brand, price, imageUrl,description } = req.body;
  const id = req.params.id;
  // or const {id} = req.params;
  const updatedProduct = await productModel.findByIdAndUpdate(id, {name, brand, price,imageUrl,description });
  console.log(updatedProduct);
  let productsData = await productModel.find({username:username});
  res.send(productsData);
}

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});