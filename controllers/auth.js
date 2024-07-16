import User from '../models/loginModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET, { expiresIn: '3d' });
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    // Extract the name, email, and password from the request body
    const { email, password } = req.body;

    // Validate the email
    if (!validator.isEmail(email)) {
      console.error('Invalid email: ', email);
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Validate the password
    if (!validator.isStrongPassword(password)) {
      console.error('Weak password');
      return res.status(400).json({
        error:
          'Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.error('Email already exists: ', email);
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password using bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = await User.create({  email, password: hash });
    console.log('New user created: ', newUser); // Log the created user

    // Generate a JWT token for the new user
    const token = createToken(newUser._id);

    // Return the new user in the response
    res.status(201).json({ token });
    // res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user: ', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User does not exist`, email);
      return res.status(400).json({ message: 'User does nont exist' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.error(`Password does not match`, email);
      return res.status(400).json({ message: 'Password does not match' });
    }

    // Generate a JWT token for the new user
    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user: ', error.message);
    res.status(400).json({ error: error.message });
  }
};
