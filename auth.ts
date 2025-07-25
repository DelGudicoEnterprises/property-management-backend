import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  validateRequest,
  async (req: any, res: any, next: any) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      
      const payload = { sub: user.id, role: user.role };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '7d'
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '7d'
      });
      
      res.json({ 
        success: true, 
        data: { 
          accessToken, 
          refreshToken, 
          user: { 
            id: user.id, 
            email: user.email, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            role: user.role 
          } 
        } 
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me - get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: any, next: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', body('refreshToken').isString(), validateRequest, (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload: any = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    const newAccessToken = jwt.sign({ sub: payload.sub, role: payload.role }, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    });
    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export default router;
