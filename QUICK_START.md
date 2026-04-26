# StayEase - Quick Start Guide for New Features

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create/update `.env` file:
```env
# Get from Razorpay Dashboard
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

### 3. Start Application
```bash
npm start
```

---

## ✨ Features Quick Start

### 🔍 Search Listings
1. Go to `/listings`
2. Use the search form:
   - **Search Box:** Search by title, description, or location
   - **Price Range:** Filter by min and max price
   - **Country:** Filter by country
3. Click "Search" to filter or "Clear" to reset

### 📅 Book a Listing
1. Browse a listing and click **"Book Now"**
2. Select check-in and check-out dates
3. View automatic price calculation
4. Click **"Proceed to Payment"**
5. Review booking summary
6. Click **"Pay with Razorpay"**
7. Use test card: `4111111111111111` (CVV: any, Date: any future)
8. Booking confirmed!

### 💳 Payment Process
- **Amount:** Automatically calculated (nightly price × number of nights)
- **Gateway:** Razorpay (test mode)
- **Security:** Server-side signature verification
- **Confirmation:** Auto-redirect on successful payment

### ❌ Cancel Booking
1. Go to "My Bookings"
2. Click on a booking
3. Click **"Cancel Booking"**
4. Refund calculated automatically:
   - >24 hours before check-in: **100% refund**
   - <24 hours before check-in: **50% refund**

### 📋 View My Bookings
1. Click **"My Bookings"** (available after login)
2. See all your bookings with statuses
3. Quick actions for each booking:
   - View full details
   - Complete payment (if pending)
   - Cancel booking
   - View listing

---

## 🧪 Test Scenarios

### Test Search
```
URL: /listings?search=beach&minPrice=1000&maxPrice=5000
Expected: Show only beach-related listings between ₹1000-5000
```

### Test Booking with Valid Dates
```
1. Click Book Now on any listing
2. Select dates (e.g., 2024-06-01 to 2024-06-05)
3. Verify price = listing price × 4 nights
4. Click Proceed to Payment
```

### Test Payment with Razorpay Test Card
```
Card Number: 4111111111111111
CVV: 123
Expiry: 12/25
```

### Test Cancellation - Full Refund
```
1. Book with check-in 5 days from now
2. Cancel immediately
3. See 100% refund amount
```

---

## 📁 Quick File Reference

| Feature | File | Type |
|---------|------|------|
| Search | `controllers/listings.js` | Controller |
| Booking Form | `views/bookings/new.ejs` | View |
| Payment Form | `views/bookings/payment.ejs` | View |
| Booking Logic | `controllers/bookings.js` | Controller |
| Payment Logic | `controllers/payments.js` | Controller |
| Routes | `routes/booking.js` | Routes |
| Database | `models/booking.js`, `models/payment.js` | Models |
| Middleware | `middleware.js` | Middleware |

---

## 🔧 Troubleshooting

### "Payment failed" Error
- Check Razorpay credentials in `.env`
- Use valid test card number
- Verify internet connection

### "Booking not found"
- Ensure you're logged in
- Check if booking was created (see My Bookings)
- Verify booking ID in URL is correct

### "This listing is already booked"
- Select different dates
- View availability on listing page

### Search not returning results
- Check if listings exist in database
- Try simpler search terms
- Use "Clear" button to reset filters

---

## 📊 API Endpoints

```
GET    /listings                    - List all listings (with search filters)
POST   /bookings/:id/book          - Create new booking
GET    /bookings/:id/book          - Show booking form
GET    /bookings/my/bookings       - List user's bookings
GET    /bookings/:id               - View booking details
GET    /bookings/:id/pay           - Show payment form
POST   /bookings/:id/create-order  - Create Razorpay order
POST   /bookings/verify-payment    - Verify payment
DELETE /bookings/:id/cancel        - Cancel booking
```

---

## 📝 Database Collections

### Bookings
```javascript
{
  _id: ObjectId,
  listing: ObjectId,
  user: ObjectId,
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: Number,
  numberOfNights: Number,
  status: "pending|confirmed|cancelled",
  paymentStatus: "pending|completed|failed|refunded",
  createdAt: Date,
  cancelledAt: Date,
  refundAmount: Number
}
```

### Payments
```javascript
{
  _id: ObjectId,
  booking: ObjectId,
  user: ObjectId,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  status: "pending|success|failed",
  createdAt: Date
}
```

---

## 🎯 Common Workflows

### Workflow 1: Browse → Search → Book
```
1. /listings (see all listings)
2. Use search filter (e.g., location="Paris", maxPrice=5000)
3. Click on listing
4. Click "Book Now"
5. Select dates
6. Proceed to payment
```

### Workflow 2: View My Bookings → Manage
```
1. Click "My Bookings" (in navbar or listing detail)
2. See all bookings with statuses
3. Click booking to view details
4. Action: View Details / Pay / Cancel / View Listing
```

### Workflow 3: Complete Payment Flow
```
1. Create booking
2. Redirected to payment page
3. Click "Pay with Razorpay"
4. Modal opens
5. Enter card details
6. Click "Pay"
7. Verification on server
8. Success page with booking confirmation
```

---

## 🛡️ Security Features

✅ User authentication required for all booking operations  
✅ Booking authorization (only booking user can modify)  
✅ Payment signature verification (prevents tampering)  
✅ Date validation (prevents invalid bookings)  
✅ Duplicate booking prevention (no double-booking)  
✅ Error handling (no sensitive data exposed)  

---

## 📞 Need Help?

1. Check `IMPLEMENTATION_GUIDE.md` for detailed documentation
2. Review error messages in browser console
3. Check server logs for database errors
4. Verify environment variables are set correctly
5. Test with Razorpay test credentials

---

## 🎉 You're All Set!

The StayEase application now includes:
- ✅ Advanced search with filters
- ✅ Complete booking system
- ✅ Secure payment processing
- ✅ Smart cancellation with refunds
- ✅ User booking management

**Happy booking!** 🏨✈️
