import { Router } from "express";
import Stripe from "stripe";
import { verifyToken } from "../../middleware/authMiddleware";
import { Product, Order, OrderItem, User } from "../../models/index";
import { OrderProps } from "../../types/order";
import sendEmail from "../../utils/sendEmail";


const stripe = new Stripe(process.env.STRIPE_KEY || "");
const router = Router();

router.post("/create-checkout-session", verifyToken, async (req, res) => {
try {
        const userId = (req as any).user.id;
        const userEmail = (req as any).user.email;
        const { products } = req.body;
        let totalPrice = 0;

        if (!products || !Array.isArray(products) || products.length === 0) {
            res.status(400).json({ error: "Invalid products data" });
            return;
        }

        for (const product of products) {
            const productDetails = await Product.findByPk(product.productId);
            if (!productDetails) continue;

            if (productDetails.stock < product.quantity) {
                res.status(400).json({ error: `Insufficient stock for product ID ${product.productId}` });
                return;
            }

            totalPrice += productDetails.price * product.quantity;

            productDetails.stock -= product.quantity;
            await productDetails.save();
        }

        // Create a new order
        const newOrder: OrderProps = await Order.create({
            userId,
            totalPrice,
            status: "pending",
        });

        const items = [];
        const purchasedProducts: { productName: string; quantity: number }[] = [];

    for (const product of products) {
        const productDetails = await Product.findByPk(product.productId);
        if (!productDetails) continue;

        items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: productDetails.name,
                    description: productDetails.description,
                },
                unit_amount: Math.round(productDetails.price * 100), // Convert to cents
            },
            quantity: product.quantity || 1,
        });

        purchasedProducts.push({
            productName: productDetails.name,
            quantity: product.quantity,
        });

            await OrderItem.create({
                orderId: newOrder.id!,
                productId: product.productId,
                quantity: product.quantity,
                price: productDetails.price,
            });
        }

        if (items.length === 0) {
        res.status(400).json({ error: "No valid products found for checkout." });
        return;
        }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items,
        mode: "payment",
        success_url: "http://localhost:3000/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url: "http://localhost:3000/cancel",
      });

      res.status(200).json({ url: session.url });

        const subject = "Order Confirmation";
        const text = `Hello,\n\nThank you for your order! Here are the details:\n\nOrder ID: ${newOrder.id}\nTotal Price: $${totalPrice.toFixed(2)}\n\nProducts:\n${purchasedProducts.map(p => `- ${p.productName} (x${p.quantity})`).join("\n")}\n\nYou can view your order at: ${session.url}\n\nBest regards,\nThe Team`;
        await sendEmail(userEmail, subject, text);
        
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/success", (req, res) => {
    res.send("Payment successful! Thank you for your purchase.");
});

router.get("/cancel", (req, res) => {
    res.send("Payment cancelled. Please try again.");
});

export default router;