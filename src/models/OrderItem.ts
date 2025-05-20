import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection';
import { OrderItemProps } from '../types/orderItem';

class OrderItem extends Model<OrderItemProps> implements OrderItemProps {
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public price!: number;
};

OrderItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize, // passing the `sequelize` instance is required
        tableName: 'order_items',
        timestamps: true, // ensures Sequelize manages timestamps
    }
);

export default OrderItem;