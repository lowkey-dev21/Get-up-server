import express, { urlencoded } from 'express';
const app = express();
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import authRoutes from './routes/loginApi.js';
import workouts from './routes/workoutsApi.js';
import verifyJWT from './middleware/verifyJWT.js';

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Define routes
app.use('/api/auth', authRoutes);
app.use(verifyJWT);
app.use('/api/workouts', workouts);

// Start server
const PORT = process.env.PORT;
const dbURL = process.env.MONGODB_URL;

mongoose
  .connect(dbURL)
  .then(
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT} & connected to Data Base`),
    ),
  )
  .catch((error) => console.error(error));
