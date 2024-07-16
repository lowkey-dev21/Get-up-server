import Workouts from '../models/workoutModel.js';

export const createWorkout = async (req, res) => {
  const { exercise, days, reps } = req.body;
  try {
    const ownerId = req.token.id;
    const ownerName = req.token.name;
    console.log(ownerName);

    if (!exercise || !days || !reps) {
      return res
        .status(400)
        .json({ error: 'Please provide exercise, days, and reps' });
    }
    const workout = await Workouts.create({
      exercise,
      days,
      reps,
      owner: ownerId,
    });
    res.status(201).json({ workout });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const owner = req.token.id;
    const workouts = await Workouts.find({ owner });
    if (!workouts) {
      return res.status(404).json({ message: 'No workouts found' });
    }
    res.status(200).json({ workouts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWorkouts = async (req, res) => {
  try {
    const { workoutId } = req.query;
    await Workouts.findByIdAndDelete(workoutId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
