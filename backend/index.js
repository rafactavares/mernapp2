import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT;
const mongoDBUri = process.env.mongoDBUri;
const DBNAME = process.env.DBNAME;
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from "./Routes/products.js";
import userRoutes from "./Routes/users.js";
import isAuth from './Middleware/auth.js';
import orderRoutes from "./Routes/orders.js";

const app = express()

// Middleware
app.use(cors())
app.use(express.json());
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use(isAuth);
app.use("/orders", orderRoutes);


// Middleware
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
    exposedHeaders: ["*"],
    credentials: true,
  };
  
  app.use(cors(corsOptions));




//Create a new product
app.post("/create", async (req, res) => {
    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      stock: req.body.stock,
      brand: req.body.brand,
      category: req.body.category,
      thumbnail: req.body.thumbnail,
      images: req.body.images,
    });
  
    await Product.create(newProduct);
    res.send("Product saved to the database!");
});




async function connectToMongoDB() {
  try {
      await mongoose.connect((mongoDBUri), { 
          useNewUrlParser: true, 
          useUnifiedTopology: true,
          dbName: DBNAME
      });
      console.log('Express app connected to MongoDB');
      app.listen(PORT, () => {
          console.log(`Express app listening on port ${PORT}`)
      })            
  } catch (error) {
      console.error('Could not connect to MongoDB', error);
  }
}    

connectToMongoDB();