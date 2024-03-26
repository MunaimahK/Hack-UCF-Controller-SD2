require("dotenv").config();
const stripe = require("stripe")(process.env.stripe);
/*
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:4242";*/
/*
const stripeEP = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1OwDKdKUjwOMdwQr5jCjRDnO",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `https://www.google.com?success=true`,
    cancel_url: `https://www.youtube.com?canceled=true`,
  });

  //res.redirect(303, session.url);
  res.json({ msg: session.url });
  //  res.json({ msg: true });
};*/
const stripeEP = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1OwCvLKUjwOMdwQruLK6n9Z0",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http:/paid-dues`,
    cancel_url: `http://localhost:3003/pay/Dues/Stripe?canceled=true`,
  });

  //res.redirect(303, session.url);
  res.json({ msg: session.url });
};

module.exports = { stripeEP };
