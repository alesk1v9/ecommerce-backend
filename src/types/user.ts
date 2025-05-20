import { Model } from "sequelize";

export interface UserProps {
    id?: number;
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin";
};

export interface UserInstance extends Model<UserProps>, UserProps {
  checkPassword(password: string): Promise<boolean>;
}