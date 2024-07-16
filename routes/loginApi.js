import express from 'express';
const router = express.Router();

// Import models
import { createUser, loginUser } from '../controllers/auth.js';

router.post('/signUp', createUser);
router.post('/login', loginUser);

export default router;
