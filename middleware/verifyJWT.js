/**
 * Verify JWT token middleware
 *
 * This middleware function verifies the JWT token sent in the `Authorization` header
 * of the request. If the token is valid, it decodes the token and attaches the
 * decoded data to the `req` object. If the token is invalid or missing, it returns
 * an error response with a 401 or 403 status code.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function in the stack
 *
 * @example
 * ```javascript
 * import express from 'express';
 * import verifyJWT from './verifyJWT';
 *
 * const app = express();
 *
 * app.use(verifyJWT);
 *
 * app.get('/protected-route', (req, res) => {
 *   // req.token is now available
 *   res.json({ message: 'Hello, authenticated user!' });
 * });
 * ```
 */
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