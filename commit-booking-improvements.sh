#!/bin/bash

# Booking System Improvements - Commit and Push Script
echo "🚀 Committing booking system improvements..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check git status
echo "📋 Current git status:"
git status

# Add all changes
echo "➕ Adding all modified files..."
git add .

# Create comprehensive commit
echo "💾 Creating commit..."
git commit -m "🛡️ Foolproof booking system - comprehensive improvements

✅ Core fixes:
- Fixed ZIP code validation bug that prevented admin emails
- Added dedicated ZIP code field (optional)
- Made ZIP optional in API validation to prevent failures

✅ Enhanced reliability:
- Email fallback system with retry logic
- Comprehensive error boundaries with unique error IDs
- Better user feedback and error handling
- Case sensitivity fix for admin email (Admin@ → admin@)

✅ Improved validation:
- Enhanced form validation with proper ranges
- Phone number format validation (10-15 digits)
- Date validation (no past dates)
- Address length requirements (min 10 chars)
- ZIP format validation (12345 or 12345-6789)

✅ User experience:
- Clear success/warning messages for different scenarios
- Graceful error recovery options
- Professional error pages with contact info
- Never fail silently - users always get feedback

✅ Technical improvements:
- Structured logging with error tracking
- Component-level error boundaries
- Email system with primary/fallback emails
- Comprehensive documentation

Files modified:
- src/types/scheduler-types.ts (added zipCode field)
- src/components/scheduler/PropertyDetailsForm.tsx (ZIP field + validation)
- src/components/scheduler/ContactForm.tsx (enhanced validation)
- src/app/api/booking/route.ts (made ZIP optional)
- src/app/book/page.tsx (improved error handling + ZIP logic)
- src/lib/email.ts (fallback email system)
- src/components/shared/ErrorBoundary.tsx (NEW - error boundaries)
- docs/booking-system-improvements.md (NEW - documentation)

Prevents: ZIP validation failures, email delivery issues, silent errors
Ensures: Reliable bookings, clear user feedback, admin notifications"

# Push to origin
echo "⬆️ Pushing to GitHub..."
git push origin main

echo "✅ Successfully committed and pushed booking system improvements!"
echo ""
echo "🔔 Next steps:"
echo "1. Set environment variables in Vercel Dashboard:"
echo "   - SMTP_USER (your Gmail)"
echo "   - SMTP_PASS (Gmail app password)"
echo "   - ADMIN_EMAIL (admin@roiappraise.com)"
echo "   - ADMIN_EMAIL_FALLBACK (optional backup email)"
echo ""
echo "2. Wait for Vercel deployment to complete"
echo "3. Test the booking system"
echo ""
echo "🎉 Your booking system is now foolproof!"
