import { Router, Request, Response } from "express";
import { isAdmin, verifyToken } from "../../middleware/authMiddleware";
import { Order } from "../../models/index";
import { OrderProps } from "../../types/order";
import { User } from "../../models/index";
import Product from "../../models/Product";
import OrderItem from "../../models/OrderItem";

const router = Router();

// Get all orders
router.get("/", isAdmin, async (req: Request, res: Response) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Product,
                    through: { attributes: ["quantity"] },
                },
            ],
        });

        if (!orders) {
            res.status(404).json({ error: "No orders found" });
            return;
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a single order by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Product,
                    through: { attributes: ["quantity"] },
                },
            ],
        });

        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new order
router.post("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { products } = req.body;
        let totalPrice = 0;

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


        for (const product of products) {
            const productDetails = await Product.findByPk(product.productId);
            if (!productDetails) continue;

            await OrderItem.create({
                orderId: newOrder.id!,
                productId: product.productId,
                quantity: product.quantity,
                price: productDetails.price,
            });
        }
        
        const fullOrder = await Order.findByPk(newOrder.id, {
            include: [
                { model: Product, through: { attributes: ["quantity", "price"] } },
                { model: User, attributes: ["id", "name", "email"] }
            ]
        });

        res.status(201).json(fullOrder);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update an order by ID
router.put("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        // Find the order by ID
        const order = await Order.findByPk(orderId);

        if (order) {
            order.status = status;
            await order.save();
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete an order by ID
router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const deleted = await Order.destroy({ where: { id: orderId } });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all orders for a specific user
router.get("/user-orders/:userId", verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const requesterId = (req as any).user.id;
        const requesterRole = (req as any).user.role;

        if (requesterId !== parseInt(userId) && requesterRole !== "admin") {
            res.status(403).json({ error: "Forbidden: not your order" });
        }
        const orders: OrderProps[] = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Product,
                    through: { attributes: ["quantity"] },
                },
            ],
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders for user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;