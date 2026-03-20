# Laundry Management System - Deployment Guide

## Issue: "Invalid email or password" Error After Deployment

This error occurs when the demo users haven't been created in your production database.

---

## ✅ Fix for Active Deployment

If your app is already deployed on Vercel:

### Option 1: Use Seed API Endpoint (Recommended)

1. Visit your Vercel deployment URL and call the seed endpoint:
   ```
   https://your-app.vercel.app/api/seed
   ```

2. The endpoint will automatically create:
   - 6 demo users
   - 3 services (Wash, Iron, Wash & Iron)
   - 8 cost categories
   - Shop settings

3. Demo credentials (password: `123456`):
   - owner@demo.com
   - admin@demo.com
   - cashier@demo.com
   - delivery@demo.com
   - tech@demo.com
   - customer@demo.com

### Option 2: Seed via Command Line

```bash
cd laundry-system
npx prisma db seed
```

---

## 🚀 Steps for Fresh Deployment

### 1. Update Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and set:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
NEXTAUTH_SECRET=laundry-system-secret-key-2024-super-secure-x123
NEXTAUTH_URL=https://your-app.vercel.app
SEED_SECRET=your-secure-seed-secret-key
```

### 2. Rebuild & Redeploy

- Push changes to GitHub or trigger redeploy in Vercel
- Once deployed, call the seed endpoint:
  ```
  POST https://your-app.vercel.app/api/seed
  Authorization: Bearer your-secure-seed-secret-key
  ```

### 3. After Seeding

Clear your browser cache and try logging in with demo credentials.

---

## 📝 Troubleshooting

**Still getting "Invalid email or password"?**

1. **Check DATABASE_URL**: Ensure it's pointing to your Supabase database
   ```bash
   npx prisma db push
   ```

2. **Verify environment variables**: Check Vercel Environment Variables are correct

3. **Check database connection**:
   - Go to Supabase Dashboard
   - Verify the database exists
   - Check user table has records: `SELECT * FROM "User"`

4. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🔐 Security Notes

- Change `SEED_SECRET` to a strong random string
- Remove `SEED_SECRET` after initial seeding
- In production, disable seed endpoint or require strong authentication
- Never commit `.env` with secrets to GitHub
