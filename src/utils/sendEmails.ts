import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Order } from '../interfaces';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderConfirmationEmail = async (email: string, order: any) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Order Confirmation',
        html: `
        <h2>Thank you for your order!</h2>
        <p>Order ID: <strong>${order._id}</strong></p>
        <p>Total Amount: <strong>₹${order.price}</strong></p>
        <p>Items:</p>
        <ul>
          ${order.items
                .map(
                    (item: any) =>
                        `<li>${item.product.name} - ₹${item.product.price} x ${item.quantity}</li>`
                )
                .join("")}
        </ul>
        <p>We will notify you when your order is shipped.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
};
