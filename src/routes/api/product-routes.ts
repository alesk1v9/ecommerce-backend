import { Router, Request, Response } from "express";
import { Product } from "../../models/index";
import { ProductProps } from "../../types/product";
import { isAdmin } from "../../middleware/authMiddleware";

const router = Router();

// Get all products
router.get("/", async (req: Request, res: Response) => {
    try {
        const products: ProductProps[] = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a product by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product: ProductProps | null = await Product.findByPk(productId);

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a product by ID
router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const deleted = await Product.destroy({ where: { id: productId } });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a product by ID
router.put("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const { name, description, price, stock, categoryId } = req.body;

        // Find the product by ID
        const product = await Product.findByPk(productId);

        if (product) {
            // Update the product details
            product.name = name;
            product.description = description;
            product.price = price;
            product.stock = stock;
            product.categoryId = categoryId;

            await product.save();
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new product
router.post("/", isAdmin, async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;

        // Create a new product
        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            categoryId
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;