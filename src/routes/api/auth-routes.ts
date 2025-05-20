import { Router, Request, Response } from "express";
import { User } from "../../models/index";
import { UserProps, UserInstance } from "../../types/user";
import { signToken } from "../../utils/auth";
import { PayloadProps } from "../../types/payload";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// User registration route
router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    try {
        const newUser: UserProps = await User.create({ name, email, password, role });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// User login route
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } }) as UserInstance | null;
        if (!user) {
             res.status(401).json({ message: "Invalid credentials" });
             return;
        }
        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
             res.status(401).json({ message: "Invalid credentials" });
        }
        const payload: PayloadProps = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = signToken(payload);
            res.json({ token, user });
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ error, message: "Server Error" });
    }
});

export default router;