const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment");
const Booking = require("../models/booking");

let razorpayInstance;

const initRazorpay = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not found in environment variables");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

module.exports.createOrder = async (req, res) => {
  try {
    const razorpayInstance = initRazorpay();
    let { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      req.flash("error", "Booking not found!");
      return res.redirect("/listings");
    }

    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You are not authorized!");
      return res.redirect("/listings");
    }

    // Create Razorpay order
    const options = {
      amount: booking.totalPrice * 100, // Amount in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `receipt_${booking._id}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Create payment record
    const payment = new Payment({
      booking: booking._id,
      user: req.user._id,
      razorpayOrderId: order.id,
      amount: booking.totalPrice,
      status: "pending",
    });

    let savedPayment = await payment.save();

    // Update booking with payment reference
    booking.paymentId = savedPayment._id;
    await booking.save();

    res.json({
      success: true,
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: booking.totalPrice * 100,
      userName: req.user.username,
      userEmail: req.user.email,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    req.flash("error", "Error creating payment order!");
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } =
      req.body;

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "success",
      },
      { new: true }
    );

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: "confirmed",
        paymentStatus: "completed",
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.paymentFailure = async (req, res) => {
  try {
    const { razorpayOrderId, bookingId } = req.body;

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { status: "failed" },
      { new: true }
    );

    res.json({
      success: false,
      message: "Payment failed",
    });
  } catch (error) {
    console.error("Error in payment failure handler:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getPaymentStatus = async (req, res) => {
  try {
    let { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!booking.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      });
    }

    res.json({
      success: true,
      status: booking.paymentStatus,
      bookingStatus: booking.status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
