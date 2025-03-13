import Stripe from 'stripe';
import { Config, Context } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SK as string);


export default async (req: Request, context: Context) => {
    const formData = await req.formData();
    let formAmount = formData.get("amount");
    let amount = 0;

    if (formAmount) amount = Number(formAmount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Window',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:4242/success',
    cancel_url: 'http://localhost:4242/cancel',
  });

  return new Response(null, {
    status: 303, // Redirect status code
    headers: {
      Location: session.url!, // Redirect to Stripe Checkout URL
    },
  });
};

export const config: Config = {
  path: "/api/v1/checkout"
};