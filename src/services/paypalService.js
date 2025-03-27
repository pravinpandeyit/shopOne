const paypal = require("../config/paypalConfig");

const createPayment = async (amount, description, orderId) => {
  return new Promise((resolve, reject) => {
    const paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `http://localhost:3000/api/payment/success?orderId=${orderId}`,
        cancel_url: "http://localhost:3000/api/payment/cancel",
      },
      transactions: [
        {
          amount: { total: amount, currency: "USD" },
          description: description,
        },
      ],
    };

    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        reject(error);
      } else {
        const approvalUrl = payment.links.find((link) => link.rel === "approval_url").href;
        resolve(approvalUrl);
      }
    });
  });
};

module.exports = { createPayment };
