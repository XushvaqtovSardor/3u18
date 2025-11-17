import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Invalid token', error: error.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
