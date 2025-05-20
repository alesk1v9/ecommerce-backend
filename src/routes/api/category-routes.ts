import { Router, Request, Response } from "express";
import { Category } from "../../models/index";
import { CategoryProps } from "../../types/category";
import { isAdmin } from "../../middleware/authMiddleware";

const router = Router();

// Get all categories
router.get("/", async (req: Request, res: Response) => {
    try {
        const categories: CategoryProps[] = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a category by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const category: CategoryProps | null = await Category.findByPk(categoryId);

        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new category
router.post("/", isAdmin, async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const newCategory: CategoryProps = await Category.create({ name, description });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a category by ID
router.put("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;

        // Find the category by ID
        const category = await Category.findByPk(categoryId);

        if (category) {
            category.name = name;
            await category.save();
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a category by ID
router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const deleted = await Category.destroy({ where: { id: categoryId } });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;