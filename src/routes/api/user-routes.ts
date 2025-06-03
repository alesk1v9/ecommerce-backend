import { Router, Request, Response } from "express";
import { User, Order } from "../../models/index";
import { UserProps } from "../../types/user";
import { isAdmin, verifyToken } from "../../middleware/authMiddleware";
import sendEmail from "../../utils/sendEmail";

const router = Router();

// Get all users
router.get("/", isAdmin, async (req: Request, res: Response) => {
    try {
        const users: UserProps[] = await User.findAll({
            include: [
                {
                    model: Order,
                } 
            ],
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a user by ID
router.get("/:id", isAdmin, async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user: UserProps | null = await User.findByPk(userId, 
            {
                include: [
                    {
                        model: Order,
                    }
                ],
            }
        );

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
router.delete("/:id", verifyToken || isAdmin ,async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Find the user by ID
        const user: UserProps | null = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Send an email to the user before deletion
                const emailSubject = "Account Deletion Confirmation";
                const emailContent = `
                    <h1>User Deleted</h1>
                    <p>Your account has been successfully deleted.</p>
                `;
                await sendEmail(user.email, emailSubject, emailContent);
        // Delete the user
        const deleted = await User.destroy({ where: { id: userId } });
        // Check if the user was deleted
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
router.put("/:id", verifyToken || isAdmin, async (req: Request, res: Response) => {
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