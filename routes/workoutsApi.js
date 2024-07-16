import express from 'express';
import {
  createWorkout,
  getWorkouts,
  deleteWorkouts,
} from '../controllers/workout.js';
const router = express.Router();

router.route('/').get(getWorkouts).post(createWorkout).delete(deleteWorkouts);

export default router;
