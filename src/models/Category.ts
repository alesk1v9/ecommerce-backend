import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection';
import { CategoryProps } from '../types/category';

class Category extends Model<CategoryProps> implements CategoryProps {
    public id!: number;
    public name!: string;
    public description!: string;
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize, // passing the `sequelize` instance is required
        tableName: 'categories',
        timestamps: true, // ensures Sequelize manages timestamps
    }
);

export default Category;