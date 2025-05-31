// server/utils/emailService.js
const nodemailer = require("nodemailer");
const dotenv=require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "smtp@mailtrap.io",
    pass:process.env.MAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (order) => {
  const mailOptions = {
    from: '"Your eCommerce Store" <no-reply@demomailtrap.co>',
    to: order.email,
    subject: `Order Confirmation - #${order.orderNumber}`,
    html: `
      <h1>Thank you for your order, <span class="math-inline">${order.customerName}!</h1\>
<p>Your order ${order.orderNumber} has been successfully placed.</p>
<h2>Order Summary:</h2>
<p>Product: ${order.product.name}</p>
<p>Variant: ${order.product.selectedVariant || "N/A"}</p>
<p>Quantity: ${order.product.quantity}</p>
<p>Total: $${order.total.toFixed(2)}</p>
<p>Shipping to: ${order.address}, ${order.city}, ${order.state} ${
      order.zipCode
    }</p>
<p>We will notify you when your order ships.</p>
`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent to:", order.email);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};
const sendTransactionFailedEmail = async (orderDetails) => {
  const mailOptions = {
    from: '"Your eCommerce Store" <no-reply@demomailtrap.co>',
    to: orderDetails.email,
    subject: "Order Transaction Failed",
    html: `
      <h1>Hi ${orderDetails.customerName},</h1>
      <p>We are sorry, but your recent transaction for order attempt failed.</p>
      <p>Reason: ${
        orderDetails.failureReason ||
        "Payment provider declined the transaction."
      }</p>
      <p>Please try placing your order again with a different payment method or contact our support if the issue persists.</p>
      <p>Product: ${orderDetails.product.name}</p>
      <p>Quantity: ${orderDetails.product.quantity}</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Transaction failed email sent to:", orderDetails.email);
  } catch (error) {
    console.error("Error sending transaction failed email:", error);
  }
};

module.exports = { sendOrderConfirmationEmail, sendTransactionFailedEmail };
