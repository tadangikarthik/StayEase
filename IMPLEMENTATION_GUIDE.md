# Implementation Guide: StayEase Feature Extensions

This guide covers all the features added to the StayEase application: Search functionality, Booking system, Payment integration with Razorpay, and Cancellation with refunds.

---

## 📋 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Features Overview](#features-overview)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Environment Variables](#environment-variables)
6. [File Structure](#file-structure)
7. [Testing Guide](#testing-guide)

---

## Installation & Setup

### Step 1: Install Dependencies

```bash
cd stayease
npm install
```

The new dependency added:
- **razorpay** ^2.9.2 - Payment gateway integration

### Step 2: Update Environment Variables

Add the following to your `.env` file:

```env
# Existing variables
ATLASDB_URL=your_mongodb_url
SECRET=your_session_secret
MAP_BOX=your_mapbox_token
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

# New variables for Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Getting Razorpay Credentials:**
1. Sign up at [Razorpay](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy both Key ID and Key Secret
4. For testing, use test mode credentials

### Step 3: Start the Application

```bash
npm start
# or
node app.js
```

---

## Features Overview

### 1. **Search Functionality**
- **Location:** Listings index page (`/listings`)
- **Features:**
  - Search by title, description, or location (case-insensitive)
  - Filter by price range (min and max)
  - Filter by country
  - Combine multiple filters
  - Clear filters to show all listings

**Database Query:** Uses MongoDB regex patterns for flexible searching

### 2. **Booking System**
- **Flow:** Browse listing → Click "Book Now" → Select dates → Proceed to payment
- **Features:**
  - Date selection with validation
  - Automatic duplicate booking prevention
  - Price calculation based on number of nights
  - Booking status tracking (pending, confirmed, cancelled)
  - User booking history

**Models Used:**
- `Booking` - Stores booking information
- `User` - Updated with bookings array reference

### 3. **Payment Integration (Razorpay)**
- **Gateway:** Razorpay (test mode available)
- **Features:**
  - Secure payment order creation
  - Payment verification using signatures
  - Payment status tracking
  - Booking confirmation after successful payment

**Payment Flow:**
1. Create booking (status: pending)
2. Create Razorpay order
3. User completes payment in Razorpay modal
4. Verify payment signature on server
5. Update booking status to confirmed
6. Create payment record

### 4. **Cancellation & Refunds**
- **Refund Policy:**
  - More than 24 hours before check-in: **100% refund**
  - 0-24 hours before check-in: **50% refund**
  - After check-in: **No refund**

**Cancellation Status:** Booking marked as "cancelled" with refund amount recorded

---

## Database Schema

### Booking Model
```javascript
{
  listing: ObjectId (ref: Listing),
  user: ObjectId (ref: User),
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: Number,
  numberOfNights: Number,
  status: String (pending|confirmed|cancelled),
  paymentId: ObjectId (ref: Payment),
  paymentStatus: String (pending|completed|failed|refunded),
  createdAt: Date,
  cancelledAt: Date,
  refundAmount: Number
}
```

### Payment Model
```javascript
{
  booking: ObjectId (ref: Booking),
  user: ObjectId (ref: User),
  razorpayOrderId: String (unique),
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  currency: String (default: INR),
  status: String (pending|success|failed),
  method: String (default: razorpay),
  createdAt: Date
}
```

### User Model (Updated)
```javascript
{
  username: String (from Passport),
  email: String,
  bookings: [ObjectId] (ref: Booking),
  // Passport fields: password hash, salt, etc.
}
```

---

## API Endpoints

### Booking Routes

#### 1. Render Booking Form
```
GET /bookings/:id/book
```
- **Authentication:** Required (isLoggedIn)
- **Parameters:** `id` = listing ID
- **Response:** Booking form with listing details and price calculator

#### 2. Create Booking
```
POST /bookings/:id/book
```
- **Authentication:** Required
- **Body:**
```json
{
  "booking": {
    "checkInDate": "2024-05-15",
    "checkOutDate": "2024-05-18"
  }
}
```
- **Validations:**
  - Check-out must be after check-in
  - Check-in must be in future
  - No overlapping bookings
- **Response:** Redirect to payment page

#### 3. List User's Bookings
```
GET /bookings/my/bookings
```
- **Authentication:** Required
- **Response:** HTML page with all user's bookings

#### 4. View Single Booking
```
GET /bookings/:id
```
- **Authentication:** Required
- **Authorization:** Only booking user can view
- **Response:** Detailed booking information

#### 5. Render Payment Form
```
GET /bookings/:id/pay
```
- **Authentication:** Required
- **Response:** Payment form with Razorpay integration

#### 6. Create Razorpay Order
```
POST /bookings/:id/create-order
```
- **Authentication:** Required
- **Response:** JSON with order details
```json
{
  "success": true,
  "razorpayOrderId": "order_xxxxx",
  "razorpayKeyId": "rzp_test_xxxxx",
  "amount": 5000,
  "userName": "john_doe",
  "userEmail": "john@example.com"
}
```

#### 7. Verify Payment
```
POST /bookings/verify-payment
```
- **Authentication:** Required
- **Body:**
```json
{
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature_xxxxx",
  "bookingId": "booking_id"
}
```
- **Response:** Success/failure with booking details

#### 8. Cancel Booking
```
DELETE /bookings/:id/cancel
```
- **Authentication:** Required
- **Authorization:** Only booking user can cancel
- **Response:** Redirect with cancellation confirmation and refund amount

#### 9. Get Payment Status
```
GET /bookings/:id/payment-status
```
- **Authentication:** Required
- **Response:** JSON with payment and booking status

### Listing Routes (Updated)

#### Search with Filters
```
GET /listings?search=term&minPrice=1000&maxPrice=5000&country=India
```
- **Parameters:** All optional
- **Query Operators:**
  - `search`: Searches title, description, location (case-insensitive regex)
  - `minPrice`: Filters price >= minPrice
  - `maxPrice`: Filters price <= maxPrice
  - `country`: Filters by country (case-insensitive regex)
- **Response:** Filtered listings with search parameters preserved in view

---

## Environment Variables

### Required for New Features

```env
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Optional: Test Credentials
# Key ID: rzp_test_1DP5MMOk6gan6b
# Key Secret: (available in Razorpay test dashboard)
```

### Testing with Razorpay

**Test Credentials:**
- Key ID: Available from test dashboard
- Key Secret: Available from test dashboard

**Test Payment Cards:**
- Visa: 4111111111111111 (CVV: any, Date: any future date)
- Mastercard: 5555555555554444
- Amount: Any amount in INR

---

## File Structure

```
stayease/
├── models/
│   ├── listing.js (existing)
│   ├── review.js (existing)
│   ├── user.js (updated - added bookings array)
│   ├── booking.js (NEW)
│   └── payment.js (NEW)
│
├── controllers/
│   ├── listings.js (updated - added search functionality)
│   ├── reviews.js (existing)
│   ├── users.js (existing)
│   ├── bookings.js (NEW)
│   └── payments.js (NEW)
│
├── routes/
│   ├── listing.js (existing)
│   ├── review.js (existing)
│   ├── user.js (existing)
│   └── booking.js (NEW)
│
├── views/
│   ├── listings/
│   │   ├── index.ejs (updated - added search filters)
│   │   ├── show.ejs (updated - added Book Now button)
│   │   ├── new.ejs (existing)
│   │   ├── edit.ejs (existing)
│   │   └── error.ejs (existing)
│   ├── bookings/ (NEW)
│   │   ├── new.ejs (booking form)
│   │   ├── payment.ejs (payment page)
│   │   ├── show.ejs (booking details)
│   │   └── myBookings.ejs (user bookings list)
│   └── ...
│
├── middleware.js (updated - added booking middleware)
├── schema.js (updated - added booking & payment validation schemas)
├── app.js (updated - added booking routes)
└── package.json (updated - added razorpay dependency)
```

---

## Testing Guide

### 1. Test Search Functionality

1. **Navigate to listings page:** `/listings`
2. **Test search by title:**
   - Enter a title keyword in search box
   - Verify only matching listings appear
3. **Test price filters:**
   - Enter min price: 1000
   - Enter max price: 5000
   - Verify only listings in range appear
4. **Test country filter:**
   - Enter a country name
   - Verify matching listings appear
5. **Test combined filters:**
   - Use multiple filters together
   - Verify all conditions are applied

### 2. Test Booking System

1. **Log in** to your account
2. **Navigate to a listing**
3. **Click "Book Now"** button
4. **Select check-in and check-out dates:**
   - Verify price calculation updates
   - Try invalid dates (check-out before check-in)
5. **Submit booking:**
   - Verify redirect to payment page
   - Check booking created with "pending" status

### 3. Test Payment Integration

1. **On payment page, click "Pay with Razorpay"**
2. **Razorpay modal opens:**
   - Verify order amount is correct
   - Verify user details are pre-filled
3. **Use test card (4111111111111111):**
   - CVV: any 3 digits
   - Date: any future date
4. **Complete payment:**
   - Verify successful redirect to booking details
   - Check booking status changed to "confirmed"
   - Verify payment status is "completed"

### 4. Test Cancellation

#### Test Full Refund (>24 hours before check-in)
1. Create booking with check-in date 3 days from now
2. Go to booking details
3. Click "Cancel Booking"
4. Verify refund amount = total price (100%)

#### Test Partial Refund (<24 hours before check-in)
1. Create booking with check-in date 12 hours from now
2. Go to booking details
3. Click "Cancel Booking"
4. Verify refund amount = 50% of total price

#### Test No Refund (after check-in)
1. Create booking with check-in date in past
2. Go to booking details
3. Click "Cancel Booking"
4. Verify refund amount = 0 or not shown

### 5. Test User Booking History

1. **Log in**
2. **Click "My Bookings"** (in listing detail or nav)
3. **Verify all user's bookings displayed:**
   - Shows listing details
   - Shows check-in/check-out dates
   - Shows booking and payment status
   - Shows action buttons (View, Pay, Cancel, View Listing)

### 6. Test Authorization

- Try accessing other user's booking: Should be denied
- Try accessing booking without login: Should redirect to login
- Try viewing booking detail of different user: Should show error

---

## Error Handling

The application includes comprehensive error handling:

### Validation Errors
- **Invalid dates:** "Check-out date must be after check-in date!"
- **Past dates:** "Check-in date must be in the future!"
- **Overlapping bookings:** "This listing is already booked for the selected dates!"

### Authorization Errors
- **Not logged in:** Redirect to login page
- **Not booking user:** "You are not authorized to access this booking"
- **Not listing owner:** "You are not the owner of this listing"

### Payment Errors
- **Signature mismatch:** "Payment signature verification failed"
- **Order creation failed:** "Error creating payment order!"

---

## Important Notes

1. **Payment Gateway Testing:**
   - Always use test credentials for development
   - Never commit real API keys to version control
   - Use `.env.example` for documenting required variables

2. **Database Backup:**
   - Ensure MongoDB backups before deploying
   - Keep transaction records (Payment collection) for audit trail

3. **Security Considerations:**
   - Payment verification is crucial - never skip signature validation
   - User authorization checks are in place for all booking operations
   - HTTPS is recommended for production (handles sensitive payment data)

4. **Performance Optimization:**
   - Search queries use MongoDB regex (index on title/location recommended)
   - Booking queries filter by dates and status
   - Add indexing for frequently queried fields

5. **Future Enhancements:**
   - Email notifications for booking confirmation and cancellation
   - Calendar view for availability
   - Payment refund automation (webhook handling)
   - Multiple payment methods (Stripe, PayPal, etc.)
   - Booking modifications (extend stay, change dates)

---

## Troubleshooting

### "Razorpay order creation failed"
- Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`
- Verify API keys have payment permissions
- Check network connectivity to Razorpay API

### "Booking not found" error
- Verify booking ID exists in database
- Check user is logged in and has access to booking
- Ensure booking hasn't been deleted

### Payment verification fails
- Verify signature validation logic
- Check that payment data hasn't been tampered with
- Ensure `RAZORPAY_KEY_SECRET` is correct

### Search not working
- Verify search query is being passed correctly
- Check MongoDB connection and listings data
- Test regex patterns in MongoDB client

---

## Support & Contact

For issues or questions:
1. Check database logs: `db.logs`
2. Review application error logs
3. Check Razorpay dashboard for payment issues
4. Verify all environment variables are set correctly
