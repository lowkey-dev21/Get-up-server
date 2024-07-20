
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const verifyJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: 'Token is not valid',
      });
    }
    req.token = decoded;
    next();
  } catch (error) {
    console.error('Token verification error: ', error);
    return res.status(403).json({ message: 'Token verification failed' });
  }
};

export default verifyJWT;