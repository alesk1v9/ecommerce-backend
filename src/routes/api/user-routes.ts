import { Router, Request, Response } from "express";
import { User } from "../../models/index";
import { UserProps } from "../../types/user";

const router = Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
    try {
        const users: UserProps[] = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a user by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user: UserProps | null = await User.findByPk(userId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a user by ID
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const deleted = await User.destroy({ where: { id: userId } });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a user by ID
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { name, email, password, role } = req.body;

        // Find the user by ID
        const user = await User.findByPk(userId);

        if (user) {
        // Update the user properties
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.role = role || user.role;

        await user.save(); // Save the updated user to the database
        // Return the updated user
        res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
        
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;