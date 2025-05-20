import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import { UserProps } from "../types/user";
import bcrypt from "bcrypt";

// This is the User model that represents the users table in the database
// It extends the Sequelize Model class and implements the UserProps interface
// The User model has the following properties:
// - id: number (auto-incremented primary key)
// - name: string (user's name)
// - email: string (user's email, unique)
// - password: string (user's password, hashed)
// The User model also has the following hooks:
// - beforeCreate: hashes the password before creating a new user
// - beforeUpdate: hashes the password before updating an existing user
// The User model is initialized with the following options:
// - sequelize: the Sequelize instance
// - tableName: the name of the table in the database
// - timestamps: true (automatically adds createdAt and updatedAt timestamps)

class User extends Model<UserProps> implements UserProps {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: "admin" | "user"; // or any other role you want to define
    public checkPassword?: (password: string) => Promise<boolean>;
}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "user", 
        },
        
    },
    {
        sequelize, // passing the `sequelize` instance is required
        tableName: "users",
        timestamps: true, // ensures Sequelize manages timestamps
    }
);

User.beforeCreate(async (user: User) => {
    const salt = 10;
    user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user: User) => {
    if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.prototype.checkPassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};


export default User;