# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- Production database (PostgreSQL)
- Kinde application configured
- Stripe account with webhooks
- UploadThing account
- (Optional) Resend for emails
- (Optional) Upstash Redis for caching

## Environment Variables

Copy all variables from `.env.example` and update for production:

```env
# Use your production database URL with connection pooling
DATABASE_URL="postgresql://..."

# Update all URLs to your production domain
KINDE_SITE_URL=https://yourdomain.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://yourdomain.com
KINDE_POST_LOGIN_REDIRECT_URL=https://yourdomain.com/api/auth/creation
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Vercel Deployment

### 1. Connect Repository
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Select the Next.js framework preset

### 2. Configure Environment Variables
Add all environment variables from `.env.example` in the Vercel dashboard.

### 3. Configure Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: (leave default)

### 4. Deploy
Click "Deploy" and wait for the build to complete.

### 5. Post-Deployment
After deployment:
1. Update Kinde callback URLs to use your production domain
2. Update Stripe webhook endpoint
3. Run database migrations if needed

## Database Setup

### Initial Migration
```bash
npx prisma db push
```

### Seeding (Optional)
```bash
npx prisma db seed
```

## Stripe Webhooks

Create a webhook in Stripe Dashboard pointing to:
```
https://yourdomain.com/api/stripe/webhook
```

Select events:
- `checkout.session.completed`
- `payment_intent.succeeded`

## Kinde Configuration

Update in Kinde Dashboard:
- Allowed callback URLs
- Allowed logout redirect URLs

## Health Checks

After deployment, verify:
- [ ] Homepage loads
- [ ] Products page displays
- [ ] Auth flow works
- [ ] Admin panel accessible
- [ ] Checkout completes

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure IP is whitelisted in database
- Check connection pooling settings

### Auth Issues
- Verify Kinde URLs match exactly
- Check client ID and secret

### Upload Issues
- Verify UploadThing credentials
- Check file size limits
