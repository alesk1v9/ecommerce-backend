import express, { Router, Request, Response } from "express";
import Stripe from "stripe";
import { Order, Product } from "../../models/index";
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const stripe = new Stripe(process.env.STRIPE_KEY! || "");

router.post("/", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] || '';
  let event;

  try {
    event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
        );

switch (event.type) {
  case 'checkout.session.completed': {
    const session = event.data.object;

    // Get the order ID from metadata
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await Order.update(
        { status: 'completed' },
        { where: { id: orderId } }
      );
    }

    break;
  }

  case 'checkout.session.expired': {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Product,
          through: { attributes: ['quantity'] }
        }
      ]
    });

    // Type assertion to inform TypeScript that 'order' includes 'Products'
    const orderWithProducts = order as Order & { Products: (Product & { OrderItem: { quantity: number } })[] };

    if (orderWithProducts && orderWithProducts.Products) {
      // 2. Loop over products and restore stock
      for (const product of orderWithProducts.Products) {
        const quantity = product.OrderItem.quantity;
        product.stock += quantity;
        await product.save();
      }

      await Order.update(
        { status: 'cancelled' },
        { where: { id: orderId } }
      );
    }

    break;
  }
  }

  default:
    console.log(`Unhandled event type: ${event.type}`);
}
        
  } catch (error) {
    console.error("Error parsing webhook:", error);
    res.status(400).send(`Webhook Error`);
    return;
  }
});

export default router;