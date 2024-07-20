import User from '../models/loginModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' });
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        error: 'Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash, username });

    const token = createToken(newUser._id);

    res.status(201).json({ token, username: newUser.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: 'Password does not match' });
    }

    const token = createToken(user._id);

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
