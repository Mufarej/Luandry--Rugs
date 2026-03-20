# 🚀 SUPABASE DATABASE SETUP GUIDE

## Overview

Supabase is a fully managed PostgreSQL database platform with built-in authentication, real-time features, and edge functions. It's a perfect drop-in replacement for your current PostgreSQL setup.

**Advantages:**
- ✅ No infrastructure management
- ✅ Automatic backups
- ✅ Built-in real-time subscriptions
- ✅ Free tier with 500MB storage
- ✅ Simple migration from PostgreSQL
- ✅ Production-ready security

---

## 📋 Step 1: Create Supabase Account & Project

### 1a. Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click "Sign Up" (use GitHub, Google, or email)
3. Verify your email

### 1b. Create New Project
1. Click "New Project"
2. Fill in project details:
   - **Name**: `laundry-management`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., us-east-1, eu-west-1)
3. Click "Create new project"
4. Wait for database initialization (~2 minutes)

### 1c. Get Connection String
1. Go to **Settings** → **Database**
2. Find "Connection string" section
3. Copy the **URI** for `Node.js` (with `?sslmode=require` at the end)
4. Example:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.supabase.co:5432/postgres?sslmode=require
   ```

---

## 🔧 Step 2: Push Your Schema to Supabase

### 2a. Update Environment Variable

Create/update `.env.local` in `/workspaces/Luandry--Rugs/laundry-system/`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.supabase.co:5432/postgres?sslmode=require"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
SEED_SECRET="dev-seed-secret"
```

Replace `[YOUR-PASSWORD]` with the password you created in step 1b.

### 2b. Push Schema to Supabase

```bash
cd /workspaces/Luandry--Rugs/laundry-system

# Install Prisma if not already installed
npm install @prisma/client prisma

# Push schema to Supabase
npx prisma db push
```

**Expected output:**
```
✔ Your database is now in sync with your schema. Done in XXms
```

### 2c. Seed Demo Data (Optional)

```bash
npx ts-node prisma/seed.ts
```

or

```bash
npm run seed
```

This will create demo accounts:
- **Owner**: owner@demo.com / 123456
- **Admin**: admin@demo.com / 123456
- **Cashier**: cashier@demo.com / 123456
- **Delivery**: delivery@demo.com / 123456
- **Technician**: technician@demo.com / 123456
- **Customer**: customer@demo.com / 123456

---

## ✅ Step 3: Verify Connection

### 3a. Test Local Development

```bash
cd /workspaces/Luandry--Rugs/laundry-system

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and:
1. Try logging in with demo account
2. Navigate to different role dashboards
3. Check connection indicator (should show "Online")

### 3b. Check Supabase Dashboard

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** or **Database** tab
4. See your tables populated with data

---

## 🔄 Step 4: Enable Real-Time Features (Optional)

Supabase has built-in real-time subscriptions. To enable:

### 4a. In Supabase Dashboard

1. Go to **Project Settings** → **Realtime**
2. Scroll to "Replication"
3. Check the tables you want real-time updates:
   - ✅ `Order`
   - ✅ `OrderItem`
   - ✅ `OrderHistory`
4. Click "Save"

### 4b. Update Socket Connection (Optional)

The current Socket.io implementation uses HTTP. For Supabase real-time, you can optionally use:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://YOUR_PROJECT.supabase.co',
  'YOUR_ANON_KEY'
)

// Subscribe to real-time updates
supabase
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'Order' },
    (payload) => console.log('Change:', payload)
  )
  .subscribe()
```

---

## 🔐 Step 5: Setup Authentication (Optional)

Supabase provides built-in authentication. You can optionally migrate from NextAuth to Supabase Auth:

### Choose One:
1. **Keep NextAuth** (Recommended for this project)
   - Continue using current setup
   - Supabase handles only database

2. **Use Supabase Auth** (Advanced)
   - Simpler setup
   - Built-in OAuth providers
   - Requires code changes

For this guide, we'll keep NextAuth.

---

## 📊 Step 6: Production Environment

### 6a. Add Production Variables

In your hosting platform (Vercel, Docker, etc.), add environment variables:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PROD-PASSWORD]@db.supabase.co:5432/postgres?sslmode=require"
NEXTAUTH_SECRET="production-secret-min-32-characters"
NEXTAUTH_URL="https://your-production-domain.com"
SEED_SECRET="change-in-production"
```

### 6b. Backup Strategy

Supabase provides automatic daily backups. For additional security:

1. Go to **Settings** → **Backups**
2. Enable "Point in time recovery" (paid feature)
3. Or use manual backups

### 6c. Monitor Database

1. Go to **Statistics** dashboard
2. Monitor:
   - Database size
   - Connections
   - Disk usage
3. Set up alerts in your hosting platform

---

## 🐛 Troubleshooting

### Connection Refused
**Problem**: `connect ECONNREFUSED`

**Solution**:
- Verify DATABASE_URL is correct
- Check network security rules in Supabase
- Ensure `sslmode=require` is in the URL

### SSL Certificate Error
**Problem**: `EPROTO: protocol error`

**Solution**:
- Ensure `?sslmode=require` is at the end of DATABASE_URL
- Add to your Node.js: `NODE_TLS_REJECT_UNAUTHORIZED=0` (dev only!)

### Prisma Migration Failed
**Problem**: Schema push fails

**Solution**:
```bash
# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# Or view detailed error
npx prisma db push --skip-generate
```

### Real-Time Not Working
**Problem**: Connection shows "Offline"

**Solution**:
- Check browser WebSocket support
- Verify firewall allows WebSocket on port 3000
- Check `/app/api/socket/route.ts` exists

---

## 📈 Performance Tips

1. **Add Indexes** for frequently queried fields:
   ```sql
   CREATE INDEX idx_order_status ON "Order"(status);
   CREATE INDEX idx_order_customer ON "Order"("customerId");
   ```

2. **Enable Query Performance Analysis**:
   - Go to **SQLEditor**
   - Run queries with `EXPLAIN ANALYZE`

3. **Connection Pooling** (for production):
   - Supabase includes connection pooling
   - Use session/transaction mode depending on your use case

4. **Caching** (optional):
   - Implement Redis caching layer
   - Supabase works with any cache

---

## 🔄 Migrating Existing Data

If you have existing data in local PostgreSQL:

```bash
# Export from local PostgreSQL
pg_dump postgresql://localhost/laundry_db > backup.sql

# Import to Supabase
psql "postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres?sslmode=require" < backup.sql
```

Or use Supabase's migration tool:
1. Go to **Migrate** in Supabase dashboard
2. Connect to your current PostgreSQL
3. Select tables to migrate
4. Automatic schema and data migration

---

## ✨ Advanced Features

### Vector Search (AI)
Enable pgvector for AI-powered search:
```bash
# In Supabase SQL Editor
create extension vector;
```

### Full-Text Search
Add to any text column:
```sql
ALTER TABLE "Service" ADD COLUMN search_vector tsvector;
CREATE INDEX idx_service_search ON "Service" USING gin(search_vector);
```

### GraphQL API
Supabase auto-generates GraphQL API:
- Go to **GraphQL** in dashboard
- Get instant GraphQL endpoint

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Supabase Guide**: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- **Live Chat Support**: Available in Supabase dashboard

---

## ✅ Completion Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied DATABASE_URL
- [ ] Updated .env.local
- [ ] Ran `npx prisma db push`
- [ ] Seeded demo data (optional)
- [ ] Tested login locally
- [ ] Verified tables in Supabase dashboard
- [ ] Enabled real-time (optional)
- [ ] Setup for production
- [ ] Created backup strategy

---

## 🎉 Done!

Your application is now using Supabase. No code changes needed - it's a true drop-in PostgreSQL replacement.

**Next Steps**:
1. Deploy to production using your preferred method
2. Test all features in production
3. Monitor database usage
4. Setup alerts and backups

---

**Questions?** Check [supabase.com/docs](https://supabase.com/docs) or ask in their community forum.
