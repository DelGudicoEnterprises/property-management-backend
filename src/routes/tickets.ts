import { Router } from 'express';
import { body, param } from 'express-validator';
import prisma from '../db';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/tickets - create work order
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['tenant', 'manager', 'admin']),
  [
    body('propertyId').isInt({ gt: 0 }),
    body('unitId').optional().isInt({ gt: 0 }),
    body('issueType').isString(),
    body('problemDescription').isString(),
    body('urgency').isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res: any, next: any) => {
    try {
      const {
        propertyId,
        unitId,
        issueType,
        problemDescription,
        urgency,
        contactName,
        contactPhone,
        contactEmail,
      } = req.body;

      const ticket = await prisma.ticket.create({
        data: {
          ticketNumber: `CAB${Date.now()}`,
          propertyId,
          unitId,
          tenantId: req.user!.id,
          issueType,
          problemDescription,
          urgency,
          status: 'open',
          contactName,
          contactPhone,
          contactEmail,
        },
      });

      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/tickets - get tickets (role-based filtering)
router.get(
  '/',
  authMiddleware,
  async (req: AuthRequest, res: any, next: any) => {
    try {
      const user = req.user!;
      let tickets;

      if (user.role === 'tenant') {
        tickets = await prisma.ticket.findMany({
          where: { tenantId: user.id },
          include: {
            property: true,
            unit: true,
            assignedTech: true,
            workLogs: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      } else if (user.role === 'service_tech') {
        tickets = await prisma.ticket.findMany({
          where: { assignedTechId: user.id },
          include: {
            property: true,
            unit: true,
            tenant: true,
            workLogs: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        // manager or admin - see all tickets
        tickets = await prisma.ticket.findMany({
          include: {
            property: true,
            unit: true,
            tenant: true,
            assignedTech: true,
            workLogs: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/tickets/:id/work-log - add work log entry (tech only)
router.post(
  '/:id/work-log',
  authMiddleware,
  roleMiddleware(['service_tech']),
  [
    param('id').isInt({ gt: 0 }),
    body('hoursWorked').isNumeric(),
    body('workNotes').optional().isString(),
    body('isBillable').optional().isBoolean(),
  ],
  validateRequest,
  async (req: AuthRequest, res: any, next: any) => {
    try {
      const id = Number(req.params.id);
      const { hoursWorked, workNotes, isBillable } = req.body;
      const log = await prisma.workLog.create({
        data: {
          ticketId: id,
          technicianId: req.user!.id,
          workDate: new Date(),
          hoursWorked: parseFloat(hoursWorked),
          workNotes,
          isBillable: isBillable ?? true,
        },
      });

      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
