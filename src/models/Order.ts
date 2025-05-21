import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import { OrderProps } from "../types/order";

class Order extends Model<OrderProps> implements OrderProps {
    public id!: number;
    public userId!: number;
    public totalPrice!: number;
    public status!: "pending" | "completed" | "cancelled";
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users", // name of Target model
                key: "id", // key in Target model that we're referencing
            },
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "completed", "cancelled"),
            allowNull: false,
            defaultValue: "pending",
        },
    },
    {
        sequelize, // passing the `sequelize` instance is required
        tableName: "orders",
        timestamps: true, // ensures Sequelize manages timestamps
    }
);

export default Order;