import Stripe from 'stripe';
import { Config, Context } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SK as string);

export default async (req: Request, context: Context) => {
  let { totalPrice } = await new Response(req.body).json();
  
  totalPrice = totalPrice * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Window',
          },
          unit_amount: totalPrice,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,
  });

  return new Response(JSON.stringify({id: session.id}), {
    status: 303, 
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  });
};

export const config: Config = {
  path: "/api/v1/checkout"
};