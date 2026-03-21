# 🚀 QUICK START - Vercel Deployment

Vercel is the recommended deployment platform for Next.js applications.

## ✅ Prerequisites

- GitHub account (repository pushed)
- Vercel account (free at vercel.com)
- PostgreSQL database (AWS RDS, Heroku, Railway, etc.)

## 📋 Step-by-Step Deployment

### Step 1: Prepare PostgreSQL Database

Choose one of these options:

#### Option A: Railway (Recommended - Free)
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Provision PostgreSQL"
3. Database created automatically
4. Copy connection string from "Connect" tab
5. Format: `postgresql://user:password@host:port/database`

#### Option B: AWS RDS
1. Go to AWS RDS Dashboard
2. Create PostgreSQL instance
3. Get endpoint URL
4. Create database: `laundry_db`
5. Create user with full permissions

#### Option C: DigitalOcean
1. Go to DigitalOcean Dashboard
2. Create Managed PostgreSQL cluster
3. Get connection string from "Connection Details"

#### Option D: Supabase (PostgreSQL + Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to "Settings" → "Database"
4. Copy connection string

### Step 2: Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Deploy to Vercel

1. **Click "New Project"** on Vercel Dashboard
2. **Select Repository**
   - Find and select your Laundry-Specialism repository
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: (leave empty - repository root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL=postgresql://user:password@host:5432/laundry_db
   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-domain.vercel.app
   SEED_SECRET=your-unique-seed-secret
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - You'll see "Congratulations! Your site is live"

### Step 4: Setup Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add custom domain (e.g., laundry.yourdomain.com)
3. Add DNS records as shown
4. Wait for SSL certificate (auto-provisioned)

### Step 5: Initialize Database

Run these once after first deployment:

```bash
# Via Vercel CLI
vercel env pull          # Download env vars locally
npx prisma db push      # Setup database schema
npx prisma db seed      # Add demo data (optional)
```

Or via Vercel Dashboard:
1. Go to "Functions" → Access Logs
2. Run deployment logs to confirm database setup

## 🔄 Redeployment

Every time you push to main branch:
1. Vercel automatically rebuilds
2. Deployment takes 2-3 minutes
3. No manual action needed

Or manually redeploy:
```bash
git push origin main    # Vercel detects and deploys
```

## ✅ Verification

After deployment, verify:

1. **Site Loading**
   - Visit: https://your-domain.vercel.app
   - Should show login page

2. **Login Test**
   - Use: owner@demo.com / 123456
   - Should redirect to /owner

3. **Language Test**
   - Click language switcher
   - Should toggle EN/AR

4. **Database Connection**
   - Navigate to owner dashboard
   - Should show statistics from database

## 🔒 Environment Variables Checklist

| Variable | Value | Required |
|----------|-------|----------|
| DATABASE_URL | PostgreSQL connection string | ✅ |
| NEXTAUTH_SECRET | 32+ char random string | ✅ |
| NEXTAUTH_URL | Your production domain | ✅ |
| SEED_SECRET | Your custom seed secret | ⚠️ |
| NODE_ENV | "production" | ⚠️ |

## 📊 Vercel Dashboard Features

After deployment, you can:
- View logs: "Functions" → "Logs"
- Monitor performance: "Analytics"
- Configure domains: "Settings" → "Domains"
- Set environment variables: "Settings" → "Environment Variables"
- View deployments: "Deployments"

## 🚨 Troubleshooting

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
1. Verify DATABASE_URL format
2. Check database is running with `psql -c "SELECT 1"`
3. Verify IP whitelist in database settings

### Build Failed

**Error**: `npm ERR! code E402`

**Solution**:
1. Rebuild: Click "Redeploy" in dashboard
2. Check build logs for specific errors
3. Verify all dependencies install locally first

### "NEXTAUTH_SECRET not set"

**Solution**:
1. Generate: `openssl rand -base64 32`
2. Add to Vercel Environment Variables
3. Redeploy

### "Lighthouse score low"

**Solution**:
1. Database too slow: optimize queries
2. Large images: compress and use Next.js Image
3. Too much JS: code split or lazy load

## 📈 Monitoring

Set up monitoring:

1. **Email Alerts**
   - Settings → Notifications
   - Get alerts on deployment failures

2. **Performance Monitoring**
   - Analytics tab shows insights
   - Monitor Core Web Vitals

3. **Logs**
   - Functions → Logs
   - Real-time error monitoring

## 🆘 Support

Having issues?

1. Check Vercel Documentation: https://vercel.com/docs
2. Review logs: Dashboard → Deployments → Logs
3. Test locally: `npm run dev`

## 🎉 Success!

Your application is now live on:
```
https://[projectname].vercel.app
```

Next steps:
1. Set up custom domain (see Step 4)
2. Change demo user credentials
3. Setup backups for database
4. Monitor performance

---

**Estimated Time**: 10-15 minutes  
**Cost**: Free tier available (perfect for testing)  
**Uptime**: 99.95% SLA

For production-level support and advanced features, check Vercel Pro: https://vercel.com/pricing
