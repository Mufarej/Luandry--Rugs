# 🚀 DEPLOYMENT GUIDE - Laundry Management System

## 📋 Pre-Deployment Checklist

### ✅ Development Verification
- [x] Production build successful (TypeScript checks passed)
- [x] All pages compile without errors
- [x] Real-time features implemented
- [x] Multi-language support (EN/AR) complete
- [x] Authentication system working
- [x] API endpoints functional
- [x] Database migrations applied

### ✅ Features Verified
- [x] Login/Registration system
- [x] Role-based access control (OWNER, ADMIN, CASHIER, DELIVERY, TECHNICIAN, CUSTOMER)
- [x] Order management system
- [x] Real-time updates with Socket.io
- [x] Language switcher (English/Arabic)
- [x] Statistics and analytics
- [x] RTL support for Arabic

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.production` file with the following:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/laundry_db"

# NextAuth
NEXTAUTH_SECRET="your-min-32-character-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Seed Secret (change in production)
SEED_SECRET="your-production-seed-secret"

# Node Environment
NODE_ENV="production"
```

### Critical Security Settings

1. **NEXTAUTH_SECRET**: Generate a secure random string (min 32 chars)
   ```bash
   openssl rand -base64 32
   ```

2. **Database**: Use a managed PostgreSQL service (AWS RDS, DigitalOcean, Heroku Postgres, etc.)

3. **SEED_SECRET**: Change from the demo value
   - Keep this secret and never commit it
   - Use for initializing demo data only in development

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Advantages**: Optimized for Next.js, automatic deployments, built-in CDN

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Add Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.production`

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

### Option 2: Docker (For any Cloud Provider)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t laundry-system:latest .
docker push your-registry/laundry-system:latest
```

### Option 3: DigitalOcean App Platform

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy with automatic updates on push

### Option 4: AWS EC2

1. **Launch Ubuntu 22.04 instance**
2. **Install Node.js & PostgreSQL**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql postgresql-contrib
   ```

3. **Clone and Setup**
   ```bash
   git clone your-repo.git
   cd laundry-system
   npm install --legacy-peer-deps
   npm run build
   ```

4. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "laundry" -- start
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx as Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Setup HTTPS with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 📦 Database Migration

### For Existing PostgreSQL Database

1. **Backup**
   ```bash
   pg_dump laundry_db > backup.sql
   ```

2. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Demo Data (Optional)**
   ```bash
   npx prisma db seed
   # Or via API:
   curl -X POST https://your-domain.com/api/seed \
     -H "Authorization: Bearer $SEED_SECRET" \
     -H "Content-Type: application/json"
   ```

---

## 🔐 Security Checklist

- [ ] Database credentials stored in environment variables only
- [ ] NEXTAUTH_SECRET changed and kept secret
- [ ] SEED_SECRET changed from demo value
- [ ] HTTPS/SSL certificate installed
- [ ] Database backups configured
- [ ] Rate limiting enabled on API endpoints
- [ ] CORS properly configured
- [ ] Session timeout configured
- [ ] Admin credentials changed
- [ ] Firewall rules applied (only allow ports 80, 443)

---

## 📊 Monitoring Setup

### Application Monitoring
- **Sentry**: For error tracking
  ```bash
  npm install @sentry/nextjs
  # Configure in next.config.js
  ```

### Database Monitoring
- Enable slow query logs
- Setup regular backups
- Monitor disk space

### Performance Monitoring
- Setup Google Analytics
- Monitor Core Web Vitals
- Use Lighthouse for performance testing

---

## 🚀 Production Startup

### Using npm start
```bash
npm run build
npm start
```

Server will run on `http://localhost:3000`

### Using PM2
```bash
pm2 start npm --name "laundry" -- start
pm2 monit
pm2 logs laundry
```

### Using Docker
```bash
docker run -p 3000:3000 --env-file .env.production laundry-system:latest
```

---

## 📱 Accessing the Application

### URLs
- **Login Page**: `https://your-domain.com`
- **Owner Dashboard**: `https://your-domain.com/owner`
- **Admin Dashboard**: `https://your-domain.com/admin`
- **Cashier Dashboard**: `https://your-domain.com/cashier`

### Demo Accounts (Change These in Production!)
| Role | Email | Password |
|------|-------|----------|
| Owner | owner@demo.com | 123456 |
| Admin | admin@demo.com | 123456 |
| Cashier | cashier@demo.com | 123456 |
| Delivery | delivery@demo.com | 123456 |
| Technician | tech@demo.com | 123456 |
| Customer | customer@demo.com | 123456 |

⚠️ **IMPORTANT**: Create new accounts and delete demo accounts after deployment!

---

## 🧪 Post-Deployment Testing

### 1. Health Check API
```bash
curl https://your-domain.com/api/statistics
# Should return 401 if not authenticated, confirming API is working
```

### 2. Language Switching
- Visit app and click language switcher
- Verify EN/AR language changes
- Check RTL layout applies for Arabic

### 3. Login Test
- Test with multiple user roles
- Verify role-based redirects work
- Check session persistence

### 4. Real-Time Features
- Check connection status indicator
- Verify statistics update
- Test refresh button functionality

---

## 🔄 Continuous Deployment

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🚨 Troubleshooting

### Issue: Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Issue: Database connection fails
- Verify DATABASE_URL format
- Check firewall allows connections
- Verify PostgreSQL is running

### Issue: Authentication not working
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches domain
- Clear browser cookies

### Issue: Real-time updates not working
- Verify Socket.io is initialized
- Check WebSocket connections in browser DevTools
- Verify server logs for socket errors

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] Monitor disk space
- [ ] Review application logs
- [ ] Update dependencies monthly
- [ ] Backup database daily
- [ ] Check for security updates

### Backup Strategy
```bash
# Daily automated backup
0 2 * * * pg_dump laundry_db | gzip > /backups/laundry_$(date +\%Y\%m\%d).sql.gz
```

---

## ✅ Final Deployment Verification

After deployment, verify:
1. [x] Application loads without errors
2. [x] Login page displays in both languages
3. [x] Authentication works for all roles
4. [x] Dashboards load correctly
5. [x] Real-time status indicator shows connected
6. [x] Language switcher functional
7. [x] API endpoints respond correctly
8. [x] Database queries execute successfully

---

## 📞 Contact & Support

For issues or questions:
1. Check application logs: `pm2 logs laundry`
2. Review database logs
3. Check browser console for errors
4. Verify environment variables are set

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Production URL**: _______________
