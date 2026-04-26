const Booking = require("../models/booking");
const Payment = require("../models/payment");
const Listing = require("../models/listing");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

module.exports.renderBookingForm = async (req, res) => {
  let { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("bookings/new.ejs", { listing });
};

module.exports.createBooking = async (req, res, next) => {
  let { listingId } = req.params;
  const { checkInDate, checkOutDate } = req.body.booking;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  // Validate dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn >= checkOut) {
    req.flash("error", "Check-out date must be after check-in date!");
    return res.redirect(`/bookings/create/${listingId}`);
  }

  // Check if dates are in future
  if (checkIn < new Date()) {
    req.flash("error", "Check-in date must be in the future!");
    return res.redirect(`/bookings/create/${listingId}`);
  }

  // Check for existing bookings on same dates
  const existingBooking = await Booking.findOne({
    listing: listingId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
      },
    ],
  });

  if (existingBooking) {
    req.flash("error", "This listing is already booked for the selected dates!");
    return res.redirect(`/bookings/create/${listingId}`);
  }

  // Calculate price
  const numberOfNights = Math.ceil(
    (checkOut - checkIn) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = listing.price * numberOfNights;

  const newBooking = new Booking({
    listing: listingId,
    user: req.user._id,
    checkInDate,
    checkOutDate,
    numberOfNights,
    totalPrice,
  });

  let savedBooking = await newBooking.save();
  
  // Add booking to user's bookings list
  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { bookings: savedBooking._id } },
    { new: true }
  );

  req.flash("success", "Booking created! Proceed to payment.");
  res.redirect(`/bookings/${savedBooking._id}/pay`);
};

module.exports.renderPaymentForm = async (req, res) => {
  let { bookingId } = req.params;
  const booking = await Booking.findById(bookingId).populate("listing");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not authorized to access this booking!");
    return res.redirect("/listings");
  }

  if (booking.status === "cancelled") {
    req.flash("error", "This booking has been cancelled!");
    return res.redirect("/listings");
  }

  res.render("bookings/payment.ejs", { booking });
};

module.exports.getBooking = async (req, res) => {
  let { bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("user");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }

  if (!booking.user._id.equals(req.user._id) && !booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorized to view this booking!");
    return res.redirect("/listings");
  }

  res.render("bookings/show.ejs", { booking });
};

module.exports.listMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/myBookings.ejs", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
  let { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not authorized to cancel this booking!");
    return res.redirect("/listings");
  }

  if (booking.status === "cancelled") {
    req.flash("error", "This booking is already cancelled!");
    return res.redirect(`/bookings/${bookingId}`);
  }

  // Calculate refund (100% refund if cancelled more than 24 hours before check-in)
  const hoursUntilCheckIn = (booking.checkInDate - new Date()) / (1000 * 60 * 60);
  let refundAmount = 0;

  if (hoursUntilCheckIn > 24) {
    refundAmount = booking.totalPrice; // Full refund
  } else if (hoursUntilCheckIn > 0) {
    refundAmount = booking.totalPrice * 0.5; // 50% refund
  }
  // No refund if cancelled after check-in

  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  booking.refundAmount = refundAmount;
  booking.paymentStatus = "refunded";

  await booking.save();

  // Update payment status if exists
  if (booking.paymentId) {
    await Payment.findByIdAndUpdate(
      booking.paymentId,
      { status: "failed" },
      { new: true }
    );
  }

  req.flash("success", `Booking cancelled! Refund amount: ₹${refundAmount}`);
  res.redirect(`/bookings/${bookingId}`);
};
