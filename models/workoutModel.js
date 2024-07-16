import mongoose, { Schema } from 'mongoose';

const workoutSchema = new Schema({
  exercise: { type: String, required: true },
  days: { type: String, required: true },
  reps: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Workouts', workoutSchema);
