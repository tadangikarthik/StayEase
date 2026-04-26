const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, validateBooking, isBookingUser } = require("../middleware.js");

const bookingController = require("../controllers/bookings");
const paymentController = require("../controllers/payments");

// List all user's bookings
router.get("/my/bookings", isLoggedIn, wrapAsync(bookingController.listMyBookings));

// Booking form - GET (from listing/:id/book)
router.get("/create/:listingId", isLoggedIn, wrapAsync(bookingController.renderBookingForm));

// Create booking - POST
router.post("/create/:listingId", isLoggedIn, validateBooking, wrapAsync(bookingController.createBooking));

// Payment form - GET
router.get("/:bookingId/pay", isLoggedIn, isBookingUser, wrapAsync(bookingController.renderPaymentForm));

// Create Razorpay order
router.post("/:bookingId/create-order", isLoggedIn, isBookingUser, wrapAsync(paymentController.createOrder));

// Verify payment
router.post("/verify-payment", isLoggedIn, wrapAsync(paymentController.verifyPayment));

// Payment failure handler
router.post("/payment-failure", isLoggedIn, wrapAsync(paymentController.paymentFailure));

// Get payment status
router.get("/:bookingId/payment-status", isLoggedIn, isBookingUser, wrapAsync(paymentController.getPaymentStatus));

// View single booking
router.get("/:bookingId", isLoggedIn, isBookingUser, wrapAsync(bookingController.getBooking));

// Cancel booking
router.delete("/:bookingId/cancel", isLoggedIn, isBookingUser, wrapAsync(bookingController.cancelBooking));

module.exports = router;
