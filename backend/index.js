import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './route/productRoutes.js'; 
import categoryRoutes from './route/categoryRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected successfully'))
  .catch((err) => console.error(' MongoDB connection error:', err));

  //Prevent caching 
  app.use((req, res,next )=> {
    res.set('Cache-Control', 'no-store');
    next();
  });

app.use('/api/products', productRoutes); 
app.use('/api/categories', categoryRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
