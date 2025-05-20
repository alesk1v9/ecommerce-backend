import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import { ProductProps } from "../types/product";

class Product extends Model<ProductProps> implements ProductProps {
    public id!: number;
    // public userId!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public stock!: number;
    public categoryId!: number;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categories", // name of Target model
                key: "id", // key in Target model that we're referencing
            },
        }
    },
    {
        sequelize, // passing the `sequelize` instance is required
        tableName: "products",
        timestamps: true, // ensures Sequelize manages timestamps
    }
);

export default Product;