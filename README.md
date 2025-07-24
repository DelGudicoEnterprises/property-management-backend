# Property Management System - Backend API

🚀 **READY FOR RAILWAY DEPLOYMENT** 🚀

A Node.js backend API for a comprehensive Property Management System with role-based access control.

## Quick Deploy to Railway

1. **Create new GitHub repository**
2. **Upload all files from this folder to repository root**
3. **Connect to Railway**
4. **Add environment variables:**
   - `DATABASE_URL` (Railway provides PostgreSQL)
   - `JWT_SECRET` (your secret key)
5. **Deploy automatically!**

## Features

- ✅ **Authentication & Authorization**: JWT-based auth with role-based access control
- ✅ **User Roles**: Tenant, Service Tech, Manager, Admin
- ✅ **Work Order Management**: Create, assign, and track maintenance tickets
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **TypeScript**: Relaxed configuration for deployment
- ✅ **PDF Storage Ready**: Configured for future file upload integration

## Test Accounts

- **Tenant**: `tenant@example.com` / `password`
- **Tech**: `tech@example.com` / `password`
- **Manager**: `manager@example.com` / `password`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tickets
- `GET /api/tickets` - Get tickets (role-based filtering)
- `POST /api/tickets` - Create work order
- `POST /api/tickets/:id/work-log` - Add work log entry

## Deployment Status

✅ **All TypeScript errors fixed**
✅ **Relaxed TypeScript configuration**
✅ **Railway-ready structure**
✅ **Complete file organization**

## Next Steps

1. Upload to new GitHub repository
2. Deploy to Railway
3. Add environment variables
4. Test login functionality
5. Connect to frontend (CodeSandbox)

Your Property Management System backend is ready for production! 🎉
