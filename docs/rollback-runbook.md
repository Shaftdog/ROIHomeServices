# Rollback Runbook - ROI Home Services

**Emergency rollback procedures for production deployments**

---

## 🚨 **Quick Rollback (Emergency)**

### Vercel "Promote to Production" (Fastest)

**Use when:** Previous deployment is stable and available in Vercel dashboard

1. **Access Vercel Dashboard**
   - [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - [ ] Select `ROIHomeServices` project
   - [ ] Navigate to **Deployments** tab

2. **Identify Target Deployment**
   - [ ] Find the last known good deployment (before the issue)
   - [ ] Verify deployment status shows ✅ **Ready**
   - [ ] Note the commit hash and timestamp

3. **Promote to Production**
   - [ ] Click **⋯** (three dots) on the target deployment
   - [ ] Select **"Promote to Production"**
   - [ ] Confirm the promotion in the modal dialog
   - [ ] Wait for DNS propagation (~30-60 seconds)

4. **Verify Rollback**
   - [ ] Check production URL: `https://roiappraise.com`
   - [ ] Test critical paths: `/offerings`, `/book`, `/contact`
   - [ ] Verify API endpoints are responding
   - [ ] Check error monitoring (Sentry) for new issues

**⏱️ Expected Time:** 2-3 minutes

---

## 🔄 **Git Rollback (Code-Level)**

### When to Use
- Vercel promote isn't available
- Need to rollback multiple deployments
- Code-level issues require permanent revert

### Steps

1. **Identify Problem Commit**
   ```bash
   # View recent commits
   git log --oneline -10
   
   # Find the problematic commit hash
   git show <commit-hash>
   ```

2. **Create Revert Commit**
   ```bash
   # Revert single commit (safest)
   git revert <bad-commit-hash>
   
   # Revert multiple commits (range)
   git revert <oldest-bad-commit>..<newest-bad-commit>
   
   # Revert merge commit
   git revert -m 1 <merge-commit-hash>
   ```

3. **Push and Deploy**
   ```bash
   # Push revert commit
   git push origin main
   
   # Vercel will auto-deploy the revert
   # Monitor deployment in Vercel dashboard
   ```

4. **Verification Checklist**
   - [ ] New deployment shows in Vercel
   - [ ] Production site loads correctly
   - [ ] Critical functionality works
   - [ ] No new errors in monitoring

**⏱️ Expected Time:** 5-10 minutes

---

## 🔧 **Environment Variables Backup & Restore**

### Pre-Deployment Backup (Preventive)

```bash
# Create environment snapshot
vercel env pull .env.backup.$(date +%Y%m%d-%H%M%S)

# Store in secure location
# - Local encrypted storage
# - Team password manager
# - Secure cloud storage
```

### Restore Environment Variables

1. **Pull Current State**
   ```bash
   # Download current env vars
   vercel env pull .env.current
   
   # Compare with backup
   diff .env.backup.YYYYMMDD-HHMMSS .env.current
   ```

2. **Restore from Backup**
   - [ ] Access [Vercel Project Settings](https://vercel.com/dashboard/roi-home-services/settings/environment-variables)
   - [ ] Remove problematic variables
   - [ ] Add variables from backup file
   - [ ] Redeploy to apply changes

3. **Environment Variable Checklist**
   - [ ] `NEXT_PUBLIC_APP_URL`
   - [ ] `NEXT_PUBLIC_CALENDLY_URL`
   - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - [ ] `STRIPE_SECRET_KEY`
   - [ ] `SMTP_*` variables
   - [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - [ ] `SENTRY_*` variables
   - [ ] `LOG_LEVEL`

**📁 Storage Locations:**
- Local: `~/backups/roi-env/`
- Team Drive: `Shared/ROI-Backups/env/`
- Password Manager: Environment Variables vault

---

## 💾 **Database Snapshot & Restore**

### Pre-Deployment Database Backup

**For PostgreSQL/MySQL:**
```bash
# Create timestamped backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
# or
mysqldump -u $DB_USER -p $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql
```

**For MongoDB:**
```bash
mongodump --uri="$MONGODB_URI" --out=backup_$(date +%Y%m%d_%H%M%S)
```

**For Supabase:**
- [ ] Use Supabase Dashboard → Settings → Database → Backups
- [ ] Download backup file
- [ ] Store securely with timestamp

### Database Restore Checklist

1. **Preparation**
   - [ ] Stop application traffic (maintenance mode)
   - [ ] Verify backup file integrity
   - [ ] Test restore on staging environment first

2. **Restore Process**
   - [ ] **PostgreSQL:** `psql $DATABASE_URL < backup_file.sql`
   - [ ] **MySQL:** `mysql -u $USER -p $DB_NAME < backup_file.sql`
   - [ ] **MongoDB:** `mongorestore --uri="$MONGODB_URI" backup_directory/`
   - [ ] **Supabase:** Use Dashboard restore feature

3. **Post-Restore Verification**
   - [ ] Check critical tables/collections exist
   - [ ] Verify data integrity with sample queries
   - [ ] Test application functionality
   - [ ] Check user authentication works
   - [ ] Verify booking system functionality

4. **Resume Operations**
   - [ ] Remove maintenance mode
   - [ ] Monitor error rates
   - [ ] Check user reports

**⚠️ Critical:** Always test restore on staging first!

---

## 🧪 **Staging Dry-Run Checklist**

### Before Production Rollback

1. **Staging Environment Setup**
   - [ ] Deploy rollback version to staging
   - [ ] Use production-like data (anonymized)
   - [ ] Configure staging environment variables
   - [ ] Point to staging database

2. **Functionality Testing**
   - [ ] **Homepage:** Loads correctly, all sections visible
   - [ ] **Navigation:** All menu items work
   - [ ] **Offerings:** Service pages load and display properly
   - [ ] **Booking System:** Calendar integration works
   - [ ] **Contact Form:** Submits successfully
   - [ ] **API Endpoints:** `/api/booking`, `/api/contact`, `/api/quote`
   - [ ] **Search:** Site search functionality
   - [ ] **Error Pages:** 404 and error boundaries work

3. **Performance Testing**
   - [ ] Page load times < 3 seconds
   - [ ] Lighthouse score > 90
   - [ ] No console errors
   - [ ] Mobile responsiveness

4. **Integration Testing**
   - [ ] Calendly integration works
   - [ ] Stripe payment processing (test mode)
   - [ ] Email notifications send
   - [ ] Google Analytics tracking
   - [ ] Sentry error reporting

5. **Database Testing** (if applicable)
   - [ ] Data reads correctly
   - [ ] Writes/updates work
   - [ ] Migrations applied successfully
   - [ ] Indexes functioning

### Staging Approval Checklist

- [ ] All critical functionality tested
- [ ] No breaking errors found
- [ ] Performance meets requirements
- [ ] Team lead approval obtained
- [ ] Rollback plan documented

---

## 📞 **Emergency Contacts**

| Role | Contact | Availability |
|------|---------|-------------|
| **Lead Developer** | [Name] - [Email] | 24/7 |
| **DevOps** | [Name] - [Email] | Business hours |
| **Project Manager** | [Name] - [Email] | Business hours |
| **Vercel Support** | support@vercel.com | 24/7 (Pro plan) |

---

## 🔗 **Quick Links**

- **Vercel Dashboard:** https://vercel.com/dashboard/roi-home-services
- **GitHub Repository:** https://github.com/Shaftdog/ROIHomeServices
- **Production Site:** https://roiappraise.com
- **Staging Site:** [staging-url]
- **Sentry Dashboard:** [sentry-project-url]
- **Status Page:** [status-page-url]

---

## 📋 **Post-Rollback Actions**

### Immediate (0-30 minutes)
- [ ] Verify production is stable
- [ ] Update team on status
- [ ] Monitor error rates for 30 minutes
- [ ] Document what was rolled back

### Short-term (1-24 hours)
- [ ] Investigate root cause of original issue
- [ ] Plan proper fix for rolled-back changes
- [ ] Update rollback runbook if needed
- [ ] Conduct post-mortem meeting

### Long-term (1-7 days)
- [ ] Implement permanent fix
- [ ] Test thoroughly in staging
- [ ] Deploy fix with proper testing
- [ ] Update deployment procedures if needed

---

**📝 Last Updated:** [Date]  
**📋 Version:** 1.0  
**👥 Reviewed by:** [Team Lead Name]

---

> **⚠️ Remember:** Always test rollback procedures in staging first. When in doubt, choose the fastest rollback method (Vercel Promote) to minimize downtime.
