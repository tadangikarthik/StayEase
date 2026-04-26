const Joi = require('joi');
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
         description:Joi.string().required(),
          location:Joi.string().required(),
           country:Joi.string().required(),
            price:Joi.number().required().min(0),
             image:Joi.string().allow("",null)
    }).required(),
});


module.exports.reviewSchema = Joi.object({
review:Joi.object({
rating:Joi.number().required().min(1).max(5),
comment:Joi.string().required(),
}).required(),
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        checkInDate: Joi.date().required().iso(),
        checkOutDate: Joi.date().required().iso().greater(Joi.ref('checkInDate')),
    }).required(),
});

module.exports.paymentSchema = Joi.object({
    payment: Joi.object({
        razorpayPaymentId: Joi.string().required(),
        razorpayOrderId: Joi.string().required(),
        razorpaySignature: Joi.string().required(),
    }).required(),
});

